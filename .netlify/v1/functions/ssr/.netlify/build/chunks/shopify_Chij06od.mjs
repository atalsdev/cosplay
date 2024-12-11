import { createClient } from 'redis';
import { MongoClient } from 'mongodb';

const client$1 = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379"
});
client$1.on("error", (err) => console.error("Redis Client Error", err));
async function getRedisClient() {
  if (!client$1.isOpen) {
    await client$1.connect();
  }
  return client$1;
}
async function getCachedData(key) {
  const redis = await getRedisClient();
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
}
async function setCachedData(key, data, ttl = 3600) {
  const redis = await getRedisClient();
  await redis.setEx(key, ttl, JSON.stringify(data));
}

const MONGODB_URI = process.env.MONGODB_URI || "";
let client = null;
async function connectToDatabase() {
  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }
  try {
    if (client) {
      await client.db().command({ ping: 1 });
      return client;
    }
    client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 6e4,
      connectTimeoutMS: 1e4,
      socketTimeoutMS: 45e3
    });
    await client.connect();
    console.log("✅ Connected to MongoDB");
    return client;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 6e4,
      connectTimeoutMS: 1e4,
      socketTimeoutMS: 45e3
    });
    await client.connect();
    return client;
  }
}

const domain = process.env.PUBLIC_SHOPIFY_SHOP;
const storefrontAccessToken = process.env.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
async function backgroundSyncProducts() {
  console.log("🔄 [BACKGROUND] Starting products sync");
  try {
    const client = await connectToDatabase();
    const collection = client.db("shopify_cache").collection("products");
    await fetchAndSaveAllProducts(collection);
    console.log("✅ [BACKGROUND] Products sync completed");
  } catch (error) {
    console.error("❌ [BACKGROUND] Products sync failed:", error);
  }
}
async function shopifyFetch({ query, variables }) {
  const endpoint = `https://${domain}/api/2024-01/graphql.json`;
  try {
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken
      },
      body: JSON.stringify({ query, variables })
    });
    return {
      status: result.status,
      body: await result.json()
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      status: 500,
      error: "Error receiving data"
    };
  }
}
async function fetchFromShopifyWithRedis(redisKey, fetchFunction, cacheDuration = 3600) {
  try {
    const redisCache = await getCachedData(redisKey);
    if (redisCache) {
      console.log("🚀 [REDIS CACHE HIT] Data retrieved");
      return redisCache;
    }
    console.log("🔄 [SHOPIFY API] Direct fetch");
    const data = await fetchFunction();
    console.log("💾 [REDIS] Caching Shopify response");
    await setCachedData(redisKey, data, cacheDuration);
    return data;
  } catch (error) {
    console.error("❌ [ERROR] Error in Shopify/Redis operation:", error);
    throw error;
  }
}
async function getAllProducts() {
  const redisKey = "shopify_all_products";
  const redisCache = await getCachedData(redisKey);
  if (redisCache) {
    console.log("🚀 [REDIS CACHE HIT] Retrieved products from Redis");
    return redisCache;
  }
  console.log("📛 [REDIS CACHE MISS] Products not found in Redis");
  try {
    const client = await connectToDatabase();
    const collection = client.db("shopify_cache").collection("products");
    const hasData = await collection.countDocuments({ type: "products_cache" });
    if (!hasData) {
      console.log("📢 [MONGODB] Empty collection detected, triggering background sync");
      backgroundSyncProducts().catch(console.error);
      const products = await fetchAndSaveAllProducts(null);
      await setCachedData(redisKey, products, 3600);
      return products;
    }
    try {
      console.log("🔍 [MONGODB] Attempting to fetch products...");
      const cacheData = await collection.findOne(
        { type: "products_cache" },
        {
          projection: {
            "products.node": {
              id: 1,
              title: 1,
              handle: 1,
              description: 1,
              priceRange: 1,
              "images.edges": { $slice: 1 }
            },
            lastUpdated: 1
          }
        }
      );
      if (!cacheData?.products) {
        console.log("📛 [MONGODB CACHE MISS] Fetching from Shopify API");
        const products = await fetchAndSaveAllProducts(collection);
        console.log("💾 [REDIS] Caching Shopify response");
        await setCachedData(redisKey, products, 3600);
        return products;
      }
      console.log("💾 [REDIS] Caching MongoDB result");
      await setCachedData(redisKey, cacheData.products, 3600);
      console.log(`✅ [MONGODB CACHE HIT] Retrieved ${cacheData.products.length} products`);
      return cacheData.products;
    } catch (error) {
      console.error("❌ [ERROR] Error fetching products:", error);
      throw error;
    }
  } catch (mongoError) {
    console.error("❌ [MONGODB ERROR] Falling back to Shopify:", mongoError);
    return fetchFromShopifyWithRedis("shopify_all_products", async () => {
      const products = await fetchAndSaveAllProducts(null);
      return products;
    });
  }
}
async function fetchAndSaveAllProducts(collection) {
  let hasNextPage = true;
  let cursor = null;
  let allProducts = [];
  while (hasNextPage) {
    const query = `
      query Products${cursor ? "($cursor: String!)" : ""} {
        products(first: 250${cursor ? ", after: $cursor" : ""}) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              handle
              description
              descriptionHtml
              seo {
                  title
                  description
                }
              images(first: 100) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 100) {
                edges {
                  node {
                    id
                    title
                    image {
                        id
                        altText
                    }
                    selectedOptions {
                      name
                      value
                    }
                    price {
                      amount
                      currencyCode
                    }
                    compareAtPrice {
                      amount
                      currencyCode
                    }
                    availableForSale
                  }
                }
              }
              options {
                name
                values
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    `;
    const variables = cursor ? { cursor } : {};
    const response = await shopifyFetch({ query, variables });
    if (!response.body?.data?.products?.edges) {
      throw new Error("Invalid response from Shopify");
    }
    const { edges, pageInfo } = response.body.data.products;
    allProducts = [...allProducts, ...edges];
    hasNextPage = pageInfo.hasNextPage;
    cursor = pageInfo.endCursor;
    console.log(`📦 Batch retrieved: ${edges.length} products (Total: ${allProducts.length})`);
  }
  if (collection) {
    try {
      console.log("💾 Saving all products to MongoDB cache");
      await collection.updateOne(
        { type: "products_cache" },
        {
          $set: {
            products: allProducts,
            lastUpdated: /* @__PURE__ */ new Date(),
            lastFetchStatus: "success",
            productCount: allProducts.length
          }
        },
        { upsert: true }
      );
      console.log("✅ Products cache updated successfully");
    } catch (error) {
      console.error("❌ [MONGODB ERROR] Failed to save cache:", error);
    }
  }
  return allProducts;
}
const PRODUCT_BY_HANDLE_QUERY = `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      descriptionHtml
      seo {
          title
          description
      }
      images(first: 100) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 100) {
        edges {
          node {
            id
            title
            selectedOptions {
              name
              value
            }
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            availableForSale
          }
        }
      }
      options {
        name
        values
      }
    }
    products(first: 4) {
      edges {
        node {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;
async function getProductByHandle(handle) {
  try {
    const redisKey = `shopify_product_${handle}`;
    const redisCache = await getCachedData(redisKey);
    if (redisCache) {
      console.log("🚀 [REDIS CACHE HIT] Product found");
      return redisCache;
    }
    console.log("📛 [REDIS CACHE MISS] Product not found");
    try {
      const client = await connectToDatabase();
      const collection = client.db("shopify_cache").collection("products");
      const hasData = await collection.countDocuments({ type: "products_cache" });
      if (!hasData) {
        console.log("📢 [MONGODB] Empty collection detected, triggering background sync");
        backgroundSyncProducts().catch(console.error);
        const response2 = await shopifyFetch({
          query: PRODUCT_BY_HANDLE_QUERY,
          variables: { handle }
        });
        const result2 = {
          product: response2?.body?.data?.product,
          relatedProducts: response2?.body?.data?.products?.edges || []
        };
        await setCachedData(`shopify_product_${handle}`, result2, 3600);
        return result2;
      }
      const cachedProduct = await getProductFromCache(handle);
      if (cachedProduct) {
        console.log("✅ [MONGODB CACHE HIT] Product found");
        const result2 = {
          product: cachedProduct,
          relatedProducts: await getRelatedProducts()
        };
        console.log("💾 [REDIS] Caching MongoDB result");
        await setCachedData(redisKey, result2, 3600);
        return result2;
      }
      console.log("📛 [MONGODB CACHE MISS] Product not found");
      console.log("🔄 [SHOPIFY API] Fetching product directly");
      const response = await shopifyFetch({
        query: PRODUCT_BY_HANDLE_QUERY,
        variables: { handle }
      });
      const product = response?.body?.data?.product;
      const relatedProducts = response?.body?.data?.products?.edges || [];
      if (!product) {
        throw new Error("Product not found in Shopify");
      }
      console.log("💾 [MONGODB] Saving new product to cache");
      await saveProductToMongo(product);
      const result = { product, relatedProducts };
      console.log("💾 [REDIS] Caching Shopify response");
      await setCachedData(redisKey, result, 3600);
      return result;
    } catch (mongoError) {
      console.error("❌ [MONGODB ERROR] Falling back to Shopify:", mongoError);
      return fetchFromShopifyWithRedis(`shopify_product_${handle}`, async () => {
        const response = await shopifyFetch({
          query: PRODUCT_BY_HANDLE_QUERY,
          variables: { handle }
        });
        const product = response?.body?.data?.product;
        const relatedProducts = response?.body?.data?.products?.edges || [];
        if (!product) {
          throw new Error("Product not found in Shopify");
        }
        return { product, relatedProducts };
      });
    }
  } catch (error) {
    console.error("❌ [ERROR] Error fetching product:", {
      handle,
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}
async function getRelatedProducts() {
  const client = await connectToDatabase();
  const collection = client.db("shopify_cache").collection("products");
  const relatedProducts = await collection.findOne(
    { type: "products_cache" },
    {
      projection: {
        products: {
          $slice: 4
        }
      }
    }
  );
  return relatedProducts?.products || [];
}
async function saveProductToMongo(product) {
  const client = await connectToDatabase();
  const collection = client.db("shopify_cache").collection("products");
  await collection.updateOne(
    { type: "products_cache" },
    {
      $push: {
        products: {
          node: {
            ...product,
            images: {
              edges: product.processedImages.map((img) => ({
                node: {
                  id: img.id,
                  url: img.url,
                  altText: img.altText
                }
              }))
            }
          }
        }
      },
      $set: {
        lastUpdated: /* @__PURE__ */ new Date()
      }
    },
    { upsert: true }
  );
  console.log("✅ New product saved to MongoDB cache with processed images");
}
async function getProductFromCache(handle) {
  try {
    console.log("🔍 Checking MongoDB for product:", handle);
    const client = await connectToDatabase();
    const collection = client.db("shopify_cache").collection("products");
    const cachedData = await collection.findOne(
      { type: "products_cache" },
      {
        projection: {
          products: {
            $elemMatch: { "node.handle": handle }
          },
          lastUpdated: 1
        }
      }
    );
    if (cachedData?.products?.[0]?.node) {
      console.log("✅ Found product in cache");
      return cachedData.products[0].node;
    }
    console.log("❌ Product not found in cache");
    return null;
  } catch (error) {
    console.error("❌ Error accessing cache:", error);
    return null;
  }
}
async function getPaginatedTranslatedProducts(page = 1, limit = 20, language = "EN") {
  try {
    const redisKey = `translated_products_${language.toLowerCase()}_page_${page}_limit_${limit}`;
    console.log(`🔄 Starting product fetch for language: ${language}, page: ${page}`);
    const redisCache = await getCachedData(redisKey);
    if (redisCache) {
      console.log(`🚀 [REDIS CACHE HIT] Retrieved ${language} products page ${page}`);
      return redisCache;
    }
    console.log(`📛 [REDIS CACHE MISS] ${language} products page ${page}`);
    const client = await connectToDatabase();
    const collection = client.db("shopify_cache").collection("products_language");
    const cachedData = await collection.findOne(
      { language: language.toUpperCase() },
      {
        projection: {
          products: { $slice: [(page - 1) * limit, limit] },
          productCount: 1
        }
      }
    );
    if (cachedData?.products) {
      console.log(`✅ [MONGODB] Found cached products for ${language}`);
      const result2 = {
        products: cachedData.products,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(cachedData.productCount / limit),
          totalProducts: cachedData.productCount,
          hasNextPage: page * limit < cachedData.productCount,
          hasPreviousPage: page > 1
        }
      };
      console.log(`💾 [REDIS] Caching ${language} products page ${page}`);
      await setCachedData(redisKey, result2, 3600);
      return result2;
    }
    console.log(`📛 [MONGODB] No cache found for ${language}, fetching ALL from Shopify`);
    let allProducts = [];
    let hasNextPage = true;
    let endCursor = null;
    let pageCount = 1;
    while (hasNextPage) {
      const query = `
        query Products${endCursor ? "($cursor: String!)" : ""} @inContext(language: ${language.toUpperCase()}) {
          products(first: 250${endCursor ? ", after: $cursor" : ""}) {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              node {
                id
                title
                handle
                description
                descriptionHtml
                seo {
                  title
                  description
                }
                images(first: 100) {
                  edges {
                    node {
                      id
                      url
                      altText
                    }
                  }
                }
                variants(first: 100) {
                  edges {
                    node {
                      id
                      title
                      image {
                        id
                      }
                      selectedOptions {
                        name
                        value
                      }
                      price {
                        amount
                        currencyCode
                      }
                      compareAtPrice {
                        amount
                        currencyCode
                      }
                      availableForSale
                    }
                  }
                }
                options {
                  name
                  values
                }
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      `;
      const variables = endCursor ? { cursor: endCursor } : {};
      const response = await shopifyFetch({ query, variables });
      if (!response.body?.data?.products?.edges) {
        throw new Error("Invalid response from Shopify");
      }
      const { edges, pageInfo } = response.body.data.products;
      if (language.toUpperCase() !== "EN") {
        console.log(`🔄 Fetching English variants for ${edges.length} products (Batch ${pageCount})`);
        for (const edge of edges) {
          if (!edge.node.variants?.edges || edge.node.variants.edges.length === 0) {
            try {
              const enQuery = `
                query ProductByHandle($handle: String!) {
                  product(handle: "${edge.node.handle}") {
                    seo {
                      title
                      description
                    }
                    variants(first: 100) {
                      edges {
                        node {
                          id
                          title
                          selectedOptions {
                            name
                            value
                          }
                          price {
                            amount
                            currencyCode
                          }
                          compareAtPrice {
                            amount
                            currencyCode
                          }
                          availableForSale
                        }
                      }
                    }
                    options {
                      name
                      values
                    }
                  }
                }
              `;
              const enResponse = await shopifyFetch({ query: enQuery });
              if (enResponse?.body?.data?.product?.variants) {
                edge.node.variants = enResponse.body.data.product.variants;
                edge.node.options = enResponse.body.data.product.options;
                console.log(`✅ Added English variants for ${edge.node.handle}`);
              }
            } catch (error) {
              console.error(`❌ Failed to fetch English variants for ${edge.node.handle}:`, error);
            }
          }
        }
      }
      allProducts = [...allProducts, ...edges];
      hasNextPage = pageInfo.hasNextPage;
      endCursor = pageInfo.endCursor;
      pageCount++;
      console.log(`📦 Fetched batch ${pageCount - 1} (Total products: ${allProducts.length})`);
    }
    try {
      console.log(`💾 [MONGODB] Saving ${allProducts.length} products for ${language}`);
      await collection.updateOne(
        { language: language.toUpperCase() },
        {
          $set: {
            products: allProducts,
            lastUpdated: /* @__PURE__ */ new Date(),
            productCount: allProducts.length
          }
        },
        { upsert: true }
      );
      console.log("✅ [MONGODB] Cache updated successfully");
    } catch (mongoError) {
      console.error("❌ [MONGODB] Error saving cache:", mongoError);
    }
    const start = (page - 1) * limit;
    const paginatedProducts = allProducts.slice(start, start + limit);
    const result = {
      products: paginatedProducts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(allProducts.length / limit),
        totalProducts: allProducts.length,
        hasNextPage: start + limit < allProducts.length,
        hasPreviousPage: page > 1
      }
    };
    console.log(`💾 [REDIS] Caching ${language} products page ${page}`);
    await setCachedData(redisKey, result, 3600);
    return result;
  } catch (error) {
    console.error(`❌ [ERROR] Error fetching translated products for ${language}:`, error);
    throw error;
  }
}
async function getTranslatedProductByHandle(handle, language = "EN") {
  try {
    const redisKey = `product_${language.toLowerCase()}_${handle}`;
    console.log(`🔍 [REDIS] Checking cache for ${redisKey}`);
    const cachedProduct = await getCachedData(redisKey);
    if (cachedProduct) {
      console.log(`✅ [REDIS] Cache hit for ${language} product: ${handle}`);
      return cachedProduct;
    }
    console.log(`📛 [REDIS] Cache miss for ${language} product: ${handle}`);
    console.log(`🔍 [MONGODB] Looking for product ${handle} in ${language}`);
    const client = await connectToDatabase();
    const collection = client.db("shopify_cache").collection("products_language");
    const [productResult, relatedProducts] = await Promise.all([
      collection.findOne(
        {
          language: language.toUpperCase(),
          "products.node.handle": handle
        },
        {
          projection: {
            "products.$": 1
          }
        }
      ),
      collection.aggregate([
        { $match: { language: language.toUpperCase() } },
        { $unwind: "$products" },
        { $match: { "products.node.handle": { $ne: handle } } },
        { $limit: 4 },
        { $project: { _id: 0, node: "$products.node" } }
      ]).toArray()
    ]);
    if (productResult?.products?.[0]?.node) {
      console.log(`✅ [MONGODB] Found ${handle} in ${language}`);
      const result = {
        product: productResult.products[0].node,
        relatedProducts: relatedProducts.map((item) => ({ node: item.node }))
      };
      console.log(`💾 [REDIS] Caching ${language} product: ${handle}`);
      await setCachedData(redisKey, result, 3600);
      return result;
    }
    console.log(`⚠️ [MONGODB] No ${language} version found for ${handle}`);
    if (language.toUpperCase() !== "EN") {
      console.log("↩️ Falling back to English version");
      const englishVersion = await getProductByHandle(handle);
      await setCachedData(redisKey, englishVersion, 3600);
      return englishVersion;
    }
    throw new Error(`Product ${handle} not found in any language`);
  } catch (error) {
    console.error(`❌ [ERROR] Failed to fetch ${language} product:`, {
      handle,
      error: error.message,
      stack: error.stack
    });
    if (language.toUpperCase() !== "EN") {
      console.log("↩️ Error occurred, falling back to English version");
      return getProductByHandle(handle);
    }
    throw error;
  }
}
async function getAllCollections(language = "EN") {
  try {
    const redisKey = `shopify_collections_${language.toLowerCase()}`;
    const redisCache = await getCachedData(redisKey);
    if (redisCache) {
      console.log("🚀 [REDIS CACHE HIT] Retrieved collections from cache");
      return redisCache;
    }
    console.log("📛 [REDIS CACHE MISS] Collections not found");
    const query = `
      query Collections @inContext(language: ${language}) {
        collections(first: 250) {
          edges {
            node {
              id
              title
              handle
              description
              image {
                url
                altText
              }
              products(first: 1) {
                edges {
                  node {
                    priceRange {
                      minVariantPrice {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;
    return fetchFromShopifyWithRedis(redisKey, async () => {
      console.log("🔄 [SHOPIFY API] Fetching collections");
      const response = await shopifyFetch({ query, variables: {} });
      if (!response.body?.data?.collections?.edges) {
        throw new Error("Invalid response from Shopify");
      }
      const collections = response.body.data.collections.edges;
      console.log(`✅ [SHOPIFY] Retrieved ${collections.length} collections`);
      return collections;
    }, 3600);
  } catch (error) {
    console.error("❌ [ERROR] Error fetching collections:", {
      language,
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}
async function getCollectionByHandle(handle, language = "EN") {
  try {
    const query = `
      query CollectionDetails($handle: String!, $language: LanguageCode!)
      @inContext(language: $language) {
        collection(handle: $handle) {
          id
          title
          handle
          description
          seo {
            title
            description
          }
          image {
            url
            altText
          }
          products(first: 250) {
            edges {
              node {
                id
                title
                handle
                description
                seo {
                  title
                  description
                }
                images(first: 1) {
                  edges {
                    node {
                      url
                      altText
                    }
                  }
                }
                variants(first: 1) {
                  edges {
                    node {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                      compareAtPrice {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;
    const redisKey = `collection_${handle}_${language.toLowerCase()}`;
    const cachedData = await getCachedData(redisKey);
    if (cachedData) {
      console.log("🚀 [REDIS] Retrieved collection from cache");
      return cachedData;
    }
    console.log("🔄 [SHOPIFY] Fetching collection");
    const response = await shopifyFetch({
      query,
      variables: {
        handle,
        language
      }
    });
    if (!response.body?.data?.collection) {
      throw new Error("Collection not found");
    }
    const collection = response.body.data.collection;
    await setCachedData(redisKey, collection, 3600);
    return collection;
  } catch (error) {
    console.error("❌ Error fetching collection:", error);
    throw error;
  }
}
async function getAllTranslatedProducts(language = "EN") {
  try {
    const redisKey = `all_translated_products_${language.toLowerCase()}`;
    console.log(`🔄 Starting product fetch for language: ${language}`);
    const redisCache = await getCachedData(redisKey);
    if (redisCache) {
      console.log(`🚀 [REDIS CACHE HIT] Retrieved all ${language} products`);
      return redisCache;
    }
    console.log(`📛 [REDIS CACHE MISS] ${language} products not found`);
    try {
      const client = await connectToDatabase();
      const collection = client.db("shopify_cache").collection("products_language");
      const cachedData = await collection.findOne(
        { language: language.toUpperCase() }
      );
      if (cachedData?.products) {
        console.log(`✅ [MONGODB] Found cached products for ${language}`);
        console.log(`💾 [REDIS] Caching ${language} products`);
        await setCachedData(redisKey, cachedData.products, 3600);
        return cachedData.products;
      }
      console.log(`📛 [CACHE MISS] No cached data found for ${language}, fetching from Shopify`);
      const allProducts = await getPaginatedTranslatedProducts(1, 1e3, language);
      if (allProducts?.products) {
        console.log(`💾 [REDIS] Caching ${language} products`);
        await setCachedData(redisKey, allProducts.products, 3600);
        return allProducts.products;
      }
      throw new Error(`No products found for language: ${language}`);
    } catch (mongoError) {
      console.error("❌ [MONGODB] Error:", mongoError);
      const allProducts = await getPaginatedTranslatedProducts(1, 1e3, language);
      if (allProducts?.products) {
        console.log(`💾 [REDIS] Caching ${language} products (MongoDB fallback)`);
        await setCachedData(redisKey, allProducts.products, 3600);
        return allProducts.products;
      }
      throw mongoError;
    }
  } catch (error) {
    console.error(`❌ [ERROR] Error fetching translated products for ${language}:`, error);
    throw error;
  }
}

export { getAllProducts as a, getAllTranslatedProducts as b, getPaginatedTranslatedProducts as c, getCollectionByHandle as d, getTranslatedProductByHandle as e, getAllCollections as g };

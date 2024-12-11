import { createClient } from 'redis';
import { getRedisClient, getCachedData as getRedisData, setCachedData as setRedisData } from './redis';
import { connectToDatabase } from './mongodb';

const domain = import.meta.env.PUBLIC_SHOPIFY_SHOP;
const storefrontAccessToken = import.meta.env.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

// Add new background sync function at the top of the file
async function backgroundSyncProducts() {
  console.log('🔄 [BACKGROUND] Starting products sync');
  try {
    const client = await connectToDatabase();
    const collection = client.db('shopify_cache').collection('products');
    await fetchAndSaveAllProducts(collection);
    console.log('✅ [BACKGROUND] Products sync completed');
  } catch (error) {
    console.error('❌ [BACKGROUND] Products sync failed:', error);
  }
}

export async function shopifyFetch({ query, variables }) {
  const endpoint = `https://${domain}/api/2024-01/graphql.json`;

  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
    });

    return {
      status: result.status,
      body: await result.json(),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      status: 500,
      error: 'Error receiving data',
    };
  }
}

function shouldRefreshCache(lastUpdated: Date): boolean {
  const now = new Date();
  const lastUpdateDay = lastUpdated.getUTCDate();
  const currentDay = now.getUTCDate();
  
  // If it's a different day and we're past midnight GMT
  return lastUpdateDay !== currentDay && now.getUTCHours() >= 0;
}

// Add new helper function
async function fetchFromShopifyWithRedis(redisKey: string, fetchFunction: () => Promise<any>, cacheDuration = 3600) {
  try {
    // Try Redis first
    const redisCache = await getRedisData(redisKey);
    if (redisCache) {
      console.log('🚀 [REDIS CACHE HIT] Data retrieved');
      return redisCache;
    }
    
    // Fetch from Shopify
    console.log('🔄 [SHOPIFY API] Direct fetch');
    const data = await fetchFunction();
    
    // Cache in Redis
    console.log('💾 [REDIS] Caching Shopify response');
    await setRedisData(redisKey, data, cacheDuration);
    
    return data;
  } catch (error) {
    console.error('❌ [ERROR] Error in Shopify/Redis operation:', error);
    throw error;
  }
}

// Update getAllProducts with fallback
export async function getAllProducts() {
  // Try Redis first
  const redisKey = 'shopify_all_products';
  const redisCache = await getRedisData(redisKey);
  
  if (redisCache) {
    console.log('🚀 [REDIS CACHE HIT] Retrieved products from Redis');
    return redisCache;
  }
  console.log('📛 [REDIS CACHE MISS] Products not found in Redis');

  try {
    // Try MongoDB
    const client = await connectToDatabase();
    const collection = client.db('shopify_cache').collection('products');

    // Add this check before the existing MongoDB query
    const hasData = await collection.countDocuments({ type: 'products_cache' });
    if (!hasData) {
      console.log('📢 [MONGODB] Empty collection detected, triggering background sync');
      backgroundSyncProducts().catch(console.error);
      
      // Proceed with Shopify fetch and Redis cache
      const products = await fetchAndSaveAllProducts(null);
      await setRedisData(redisKey, products, 3600);
      return products;
    }

    try {
      console.log('🔍 [MONGODB] Attempting to fetch products...');
      const cacheData = await collection.findOne(
        { type: 'products_cache' },
        { 
          projection: { 
            'products.node': {
              id: 1,
              title: 1,
              handle: 1,
              description: 1,
              priceRange: 1,
              'images.edges': { $slice: 1 }
            },
            lastUpdated: 1
          }
        }
      );

      if (!cacheData?.products) {
        console.log('📛 [MONGODB CACHE MISS] Fetching from Shopify API');
        const products = await fetchAndSaveAllProducts(collection);
        console.log('💾 [REDIS] Caching Shopify response');
        await setRedisData(redisKey, products, 3600);
        return products;
      }

      console.log('💾 [REDIS] Caching MongoDB result');
      await setRedisData(redisKey, cacheData.products, 3600);
      console.log(`✅ [MONGODB CACHE HIT] Retrieved ${cacheData.products.length} products`);
      return cacheData.products;

    } catch (error) {
      console.error('❌ [ERROR] Error fetching products:', error);
      throw error;
    }
  } catch (mongoError) {
    console.error('❌ [MONGODB ERROR] Falling back to Shopify:', mongoError);
    
    // Fallback to Shopify with Redis caching
    return fetchFromShopifyWithRedis('shopify_all_products', async () => {
      const products = await fetchAndSaveAllProducts(null); // Pass null to skip MongoDB save
      return products;
    });
  }
}

// Update fetchAndSaveAllProducts to handle MongoDB failure
async function fetchAndSaveAllProducts(collection: any | null) {
  let hasNextPage = true;
  let cursor = null;
  let allProducts = [];

  while (hasNextPage) {
    const query = `
      query Products${cursor ? '($cursor: String!)' : ''} {
        products(first: 250${cursor ? ', after: $cursor' : ''}) {
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
      throw new Error('Invalid response from Shopify');
    }

    const { edges, pageInfo } = response.body.data.products;
    allProducts = [...allProducts, ...edges];
    hasNextPage = pageInfo.hasNextPage;
    cursor = pageInfo.endCursor;

    console.log(`📦 Batch retrieved: ${edges.length} products (Total: ${allProducts.length})`);
  }

  // Only save to MongoDB if collection is provided
  if (collection) {
    try {
      console.log('💾 Saving all products to MongoDB cache');
      await collection.updateOne(
        { type: 'products_cache' },
        { 
          $set: {
            products: allProducts,
            lastUpdated: new Date(),
            lastFetchStatus: 'success',
            productCount: allProducts.length
          }
        },
        { upsert: true }
      );
      console.log('✅ Products cache updated successfully');
    } catch (error) {
      console.error('❌ [MONGODB ERROR] Failed to save cache:', error);
      // Continue without MongoDB cache
    }
  }

  return allProducts;
}

export async function refreshProductCache() {
  const now = new Date();
  if (now.getUTCHours() !== 0) {
    console.log('⏰ Manual refresh only allowed at 00:00 GMT');
    return null;
  }

  console.log('🔄 Manual cache refresh triggered during allowed window');
  const client = await connectToDatabase();
  const collection = client.db('shopify_cache').collection('products');
  
  try {
    console.log('🗑️ Invalidating current cache...');
    await collection.updateOne(
      { type: 'products_cache' },
      { $set: { lastUpdated: new Date(0) } }
    );
    
    console.log('🔄 Fetching fresh data...');
    const result = await getAllProducts();
    console.log('✅ Manual cache refresh completed successfully');
    return result;
  } catch (error) {
    console.error('❌ Error during manual cache refresh:', error);
    throw error;
  }
}

// Query declaration
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

// Update getProductByHandle with consistent image handling
export async function getProductByHandle(handle: string) {
  try {
    // Try Redis first
    const redisKey = `shopify_product_${handle}`;
    const redisCache = await getRedisData(redisKey);
    
    if (redisCache) {
      console.log('🚀 [REDIS CACHE HIT] Product found');
      return redisCache;
    }
    console.log('📛 [REDIS CACHE MISS] Product not found');

    try {
      // Try MongoDB
      const client = await connectToDatabase();
      const collection = client.db('shopify_cache').collection('products');

      // Add background sync trigger
      const hasData = await collection.countDocuments({ type: 'products_cache' });
      if (!hasData) {
        console.log('📢 [MONGODB] Empty collection detected, triggering background sync');
        backgroundSyncProducts().catch(console.error);
        
        // Proceed with Shopify fetch and Redis cache
        const response = await shopifyFetch({ 
          query: PRODUCT_BY_HANDLE_QUERY, 
          variables: { handle } 
        });
        const result = {
          product: response?.body?.data?.product,
          relatedProducts: response?.body?.data?.products?.edges || []
        };
        await setRedisData(`shopify_product_${handle}`, result, 3600);
        return result;
      }

      const cachedProduct = await getProductFromCache(handle);
      if (cachedProduct) {
        console.log('✅ [MONGODB CACHE HIT] Product found');
        const result = {
          product: cachedProduct,
          relatedProducts: await getRelatedProducts()
        };
        console.log('💾 [REDIS] Caching MongoDB result');
        await setRedisData(redisKey, result, 3600);
        return result;
      }
      console.log('📛 [MONGODB CACHE MISS] Product not found');

      // Fallback to Shopify
      console.log('🔄 [SHOPIFY API] Fetching product directly');
      const response = await shopifyFetch({ 
        query: PRODUCT_BY_HANDLE_QUERY, 
        variables: { handle } 
      });

      const product = response?.body?.data?.product;
      const relatedProducts = response?.body?.data?.products?.edges || [];

      if (!product) {
        throw new Error('Product not found in Shopify');
      }

      console.log('💾 [MONGODB] Saving new product to cache');
      await saveProductToMongo(product);

      const result = { product, relatedProducts };
      console.log('💾 [REDIS] Caching Shopify response');
      await setRedisData(redisKey, result, 3600);
      
      return result;
    } catch (mongoError) {
      console.error('❌ [MONGODB ERROR] Falling back to Shopify:', mongoError);
      
      // Fallback to Shopify with Redis caching
      return fetchFromShopifyWithRedis(`shopify_product_${handle}`, async () => {
        const response = await shopifyFetch({ 
          query: PRODUCT_BY_HANDLE_QUERY, 
          variables: { handle } 
        });

        const product = response?.body?.data?.product;
        const relatedProducts = response?.body?.data?.products?.edges || [];

        if (!product) {
          throw new Error('Product not found in Shopify');
        }

        return { product, relatedProducts };
      });
    }
  } catch (error) {
    console.error('❌ [ERROR] Error fetching product:', {
      handle,
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}

// Helper function to get related products
async function getRelatedProducts() {
  const client = await connectToDatabase();
  const collection = client.db('shopify_cache').collection('products');
  const relatedProducts = await collection.findOne(
    { type: 'products_cache' },
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

// Update saveProductToMongo to handle the processed data
async function saveProductToMongo(product) {
  const client = await connectToDatabase();
  const collection = client.db('shopify_cache').collection('products');
  
  await collection.updateOne(
    { type: 'products_cache' },
    { 
      $push: { 
        products: {
          node: {
            ...product,
            images: {
              edges: product.processedImages.map(img => ({
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
        lastUpdated: new Date()
      }
    },
    { upsert: true }
  );
  console.log('✅ New product saved to MongoDB cache with processed images');
}

export async function getProductFromCache(handle: string) {
  try {
    console.log('🔍 Checking MongoDB for product:', handle);
    const client = await connectToDatabase();
    const collection = client.db('shopify_cache').collection('products');
    
    // Use projection to only fetch the specific product
    const cachedData = await collection.findOne(
      { type: 'products_cache' },
      { 
        projection: {
          products: {
            $elemMatch: { 'node.handle': handle }
          },
          lastUpdated: 1
        }
      }
    );

    if (cachedData?.products?.[0]?.node) {
      console.log('✅ Found product in cache');
      return cachedData.products[0].node;
    }

    console.log('❌ Product not found in cache');
    return null;
  } catch (error) {
    console.error('❌ Error accessing cache:', error);
    return null;
  }
}

// Add index for faster queries
export async function createIndexes() {
  const client = await connectToDatabase();
  const collection = client.db('shopify_cache').collection('products');
  
  await collection.createIndex({ type: 1 });
  await collection.createIndex({ 'products.node.handle': 1 });
  console.log('✅ Indexes created');
}

// Update getPaginatedProducts with fallback
export async function getPaginatedProducts(page: number = 1, limit: number = 20) {
  const redisKey = `shopify_paginated_products_${page}_${limit}`;
  
  try {
    // Try Redis first
    const redisCache = await getRedisData(redisKey);
    if (redisCache) {
      console.log(`🚀 [REDIS CACHE HIT] Retrieved page ${page} from Redis`);
      return redisCache;
    }
    console.log(`📛 [REDIS CACHE MISS] Page ${page} not found in Redis`);

    try {
      // Try MongoDB
      const client = await connectToDatabase();
      const collection = client.db('shopify_cache').collection('products');

      // Add background sync trigger
      const hasData = await collection.countDocuments({ type: 'products_cache' });
      if (!hasData) {
        console.log('📢 [MONGODB] Empty collection detected, triggering background sync');
        backgroundSyncProducts().catch(console.error);
        
        // Proceed with Shopify fetch and Redis cache
        const allProducts = await fetchAndSaveAllProducts(null);
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
        
        await setRedisData(redisKey, result, 3600);
        return result;
      }

      try {
        console.log(`🔍 [MONGODB] Attempting to fetch page ${page}...`);
        
        // Get total count first
        const totalCount = await collection.findOne(
          { type: 'products_cache' },
          { projection: { productCount: 1 } }
        );

        const skip = (page - 1) * limit;
        
        const cacheData = await collection.findOne(
          { type: 'products_cache' },
          { 
            projection: { 
              products: {
                $slice: [skip, limit]
              }
            }
          }
        );

        if (!cacheData?.products) {
          console.log('📛 [MONGODB CACHE MISS] Fetching from Shopify API');
          await fetchAndSaveAllProducts(collection);
          
          // Retry MongoDB query after fetching from Shopify
          const freshData = await collection.findOne(
            { type: 'products_cache' },
            { 
              projection: { 
                products: {
                  $slice: [skip, limit]
                }
              }
            }
          );

          const totalProducts = totalCount?.productCount || freshData.products.length;
          const totalPages = Math.ceil(totalProducts / limit);

          const result = {
            products: freshData.products,
            pagination: {
              currentPage: page,
              totalPages,
              totalProducts,
              hasNextPage: page < totalPages,
              hasPreviousPage: page > 1
            }
          };

          console.log('💾 [REDIS] Caching Shopify response');
          await setRedisData(redisKey, result, 3600); // Cache for 1 hour
          
          console.log(`✅ [SHOPIFY] Retrieved page ${page} (${freshData.products.length} items)`);
          return result;
        }

        const totalProducts = totalCount?.productCount || cacheData.products.length;
        const totalPages = Math.ceil(totalProducts / limit);

        const result = {
          products: cacheData.products,
          pagination: {
            currentPage: page,
            totalPages,
            totalProducts,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
          }
        };

        console.log('💾 [REDIS] Caching MongoDB result');
        await setRedisData(redisKey, result, 3600); // Cache for 1 hour

        console.log(`✅ [MONGODB CACHE HIT] Retrieved page ${page} (${cacheData.products.length} items)`);
        return result;

      } catch (error) {
        console.error('❌ [ERROR] Error fetching paginated products:', error);
        throw error;
      }
    } catch (mongoError) {
      console.error('❌ [MONGODB ERROR] Falling back to Shopify:', mongoError);
      
      // Fallback to Shopify with Redis caching
      return fetchFromShopifyWithRedis(redisKey, async () => {
        const allProducts = await fetchAndSaveAllProducts(null);
        const start = (page - 1) * limit;
        const paginatedProducts = allProducts.slice(start, start + limit);
        
        return {
          products: paginatedProducts,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(allProducts.length / limit),
            totalProducts: allProducts.length,
            hasNextPage: start + limit < allProducts.length,
            hasPreviousPage: page > 1
          }
        };
      });
    }
  } catch (error) {
    console.error('❌ [ERROR] Error fetching paginated products:', error);
    throw error;
  }
}

// Add new function to fetch translated products
export async function getPaginatedTranslatedProducts(page: number = 1, limit: number = 20, language: string = 'EN') {
  try {
    const redisKey = `translated_products_${language.toLowerCase()}_page_${page}_limit_${limit}`;
    console.log(`🔄 Starting product fetch for language: ${language}, page: ${page}`);
    
    // Try Redis first
    const redisCache = await getRedisData(redisKey);
    if (redisCache) {
      console.log(`🚀 [REDIS CACHE HIT] Retrieved ${language} products page ${page}`);
      return redisCache;
    }
    console.log(`📛 [REDIS CACHE MISS] ${language} products page ${page}`);
    
    // Try MongoDB first
    const client = await connectToDatabase();
    const collection = client.db('shopify_cache').collection('products_language');

    // Check if we have cached data for this language
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
      
      const result = {
        products: cachedData.products,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(cachedData.productCount / limit),
          totalProducts: cachedData.productCount,
          hasNextPage: page * limit < cachedData.productCount,
          hasPreviousPage: page > 1
        }
      };

      // Cache in Redis
      console.log(`💾 [REDIS] Caching ${language} products page ${page}`);
      await setRedisData(redisKey, result, 3600); // Cache for 1 hour
      
      return result;
    }

    // If no cache exists, we need to fetch ALL products for initial build
    console.log(`📛 [MONGODB] No cache found for ${language}, fetching ALL from Shopify`);

    let allProducts = [];
    let hasNextPage = true;
    let endCursor = null;
    let pageCount = 1;

    // Keep fetching until we get ALL products
    while (hasNextPage) {
      const query = `
        query Products${endCursor ? '($cursor: String!)' : ''} @inContext(language: ${language.toUpperCase()}) {
          products(first: 250${endCursor ? ', after: $cursor' : ''}) {
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
        throw new Error('Invalid response from Shopify');
      }

      const { edges, pageInfo } = response.body.data.products;
      
      // If it's not English, fetch English variants for each product
      if (language.toUpperCase() !== 'EN') {
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

    // Save ALL products to MongoDB
    try {
      console.log(`💾 [MONGODB] Saving ${allProducts.length} products for ${language}`);
      await collection.updateOne(
        { language: language.toUpperCase() },
        { 
          $set: {
            products: allProducts,
            lastUpdated: new Date(),
            productCount: allProducts.length
          }
        },
        { upsert: true }
      );
      console.log('✅ [MONGODB] Cache updated successfully');
    } catch (mongoError) {
      console.error('❌ [MONGODB] Error saving cache:', mongoError);
    }

    // Calculate pagination for requested page
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

    // Cache paginated result in Redis
    console.log(`💾 [REDIS] Caching ${language} products page ${page}`);
    await setRedisData(redisKey, result, 3600); // Cache for 1 hour

    return result;

  } catch (error) {
    console.error(`❌ [ERROR] Error fetching translated products for ${language}:`, error);
    throw error;
  }
}

// Add a function to refresh language-specific cache
export async function refreshLanguageCache(language: string) {
  try {
    const client = await connectToDatabase();
    const collection = client.db('shopify_cache').collection('products_language');
    
    console.log(`🔄 Refreshing cache for language: ${language}`);
    
    // Delete existing cache for this language
    await collection.deleteOne({ language: language.toUpperCase() });
    
    // Fetch fresh data
    return getPaginatedTranslatedProducts(1, 20, language);
  } catch (error) {
    console.error(`❌ Error refreshing ${language} cache:`, error);
    throw error;
  }
}

// Add a function to check cache age and refresh if needed
export async function checkAndRefreshLanguageCache(language: string) {
  try {
    const client = await connectToDatabase();
    const collection = client.db('shopify_cache').collection('products_language');
    
    const cacheData = await collection.findOne({ language: language.toUpperCase() });
    
    if (!cacheData) return false;
    
    const cacheAge = new Date().getTime() - new Date(cacheData.lastUpdated).getTime();
    const MAX_CACHE_AGE = 24 * 60 * 60 * 1000; // 24 hours
    
    if (cacheAge > MAX_CACHE_AGE) {
      console.log(`⏰ Cache for ${language} is older than 24 hours, refreshing...`);
      await refreshLanguageCache(language);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error checking cache age for ${language}:`, error);
    return false;
  }
}

// Query declaration for translated products
const TRANSLATED_PRODUCT_QUERY = `
  query ProductByHandle($handle: String!) @inContext(language: $language) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
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
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
    }
    products(first: 4) {
      edges {
        node {
          id
          title
          handle
          description
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
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

export async function getTranslatedProductByHandle(handle: string, language: string = 'EN') {
  try {
    const redisKey = `product_${language.toLowerCase()}_${handle}`;
    console.log(`🔍 [REDIS] Checking cache for ${redisKey}`);

    // Try Redis first
    const cachedProduct = await getRedisData(redisKey);
    if (cachedProduct) {
      console.log(`✅ [REDIS] Cache hit for ${language} product: ${handle}`);
      return cachedProduct;
    }
    console.log(`📛 [REDIS] Cache miss for ${language} product: ${handle}`);

    // Try MongoDB
    console.log(`🔍 [MONGODB] Looking for product ${handle} in ${language}`);
    const client = await connectToDatabase();
    const collection = client.db('shopify_cache').collection('products_language');

    // Find specific product and related products in one query
    const [productResult, relatedProducts] = await Promise.all([
      collection.findOne(
        { 
          language: language.toUpperCase(),
          'products.node.handle': handle 
        },
        {
          projection: {
            'products.$': 1
          }
        }
      ),
      collection.aggregate([
        { $match: { language: language.toUpperCase() } },
        { $unwind: '$products' },
        { $match: { 'products.node.handle': { $ne: handle } } },
        { $limit: 4 },
        { $project: { _id: 0, node: '$products.node' } }
      ]).toArray()
    ]);

    if (productResult?.products?.[0]?.node) {
      console.log(`✅ [MONGODB] Found ${handle} in ${language}`);
      
      const result = {
        product: productResult.products[0].node,
        relatedProducts: relatedProducts.map(item => ({ node: item.node }))
      };

      // Cache in Redis
      console.log(`💾 [REDIS] Caching ${language} product: ${handle}`);
      await setRedisData(redisKey, result, 3600); // Cache for 1 hour

      return result;
    }

    console.log(`⚠️ [MONGODB] No ${language} version found for ${handle}`);
    
    // If not English, try English version
    if (language.toUpperCase() !== 'EN') {
      console.log('↩️ Falling back to English version');
      const englishVersion = await getProductByHandle(handle);
      
      // Cache the English fallback
      await setRedisData(redisKey, englishVersion, 3600);
      
      return englishVersion;
    }

    throw new Error(`Product ${handle} not found in any language`);

  } catch (error) {
    console.error(`❌ [ERROR] Failed to fetch ${language} product:`, {
      handle,
      error: error.message,
      stack: error.stack
    });

    // If not English and error occurs, try English version
    if (language.toUpperCase() !== 'EN') {
      console.log('↩️ Error occurred, falling back to English version');
      return getProductByHandle(handle);
    }

    throw error;
  }
}

// Add new function to fetch all collections
export async function getAllCollections(language: string = 'EN') {
  try {
    // Define Redis key for this specific language
    const redisKey = `shopify_collections_${language.toLowerCase()}`;
    
    // Try Redis first
    const redisCache = await getRedisData(redisKey);
    if (redisCache) {
      console.log('🚀 [REDIS CACHE HIT] Retrieved collections from cache');
      return redisCache;
    }
    console.log('📛 [REDIS CACHE MISS] Collections not found');

    // Define the Shopify GraphQL query
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

    // Fetch from Shopify using the existing helper function
    return fetchFromShopifyWithRedis(redisKey, async () => {
      console.log('🔄 [SHOPIFY API] Fetching collections');
      const response = await shopifyFetch({ query, variables: {} });

      if (!response.body?.data?.collections?.edges) {
        throw new Error('Invalid response from Shopify');
      }

      const collections = response.body.data.collections.edges;
      console.log(`✅ [SHOPIFY] Retrieved ${collections.length} collections`);
      
      return collections;
    }, 3600); // Cache for 1 hour

  } catch (error) {
    console.error('❌ [ERROR] Error fetching collections:', {
      language,
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}

export async function getCollectionByHandle(handle: string, language: string = 'EN') {
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

    // Try Redis first
    const redisKey = `collection_${handle}_${language.toLowerCase()}`;
    const cachedData = await getRedisData(redisKey);
    
    if (cachedData) {
      console.log('🚀 [REDIS] Retrieved collection from cache');
      return cachedData;
    }

    // Fetch from Shopify
    console.log('🔄 [SHOPIFY] Fetching collection');
    const response = await shopifyFetch({ 
      query, 
      variables: { 
        handle,
        language 
      } 
    });

    if (!response.body?.data?.collection) {
      throw new Error('Collection not found');
    }

    const collection = response.body.data.collection;
    
    // Cache in Redis
    await setRedisData(redisKey, collection, 3600); // Cache for 1 hour
    
    return collection;
  } catch (error) {
    console.error('❌ Error fetching collection:', error);
    throw error;
  }
}

export async function getAllTranslatedProducts(language: string = 'EN') {
  try {
    const redisKey = `all_translated_products_${language.toLowerCase()}`;
    console.log(`🔄 Starting product fetch for language: ${language}`);
    
    // Try Redis first
    const redisCache = await getRedisData(redisKey);
    if (redisCache) {
      console.log(`🚀 [REDIS CACHE HIT] Retrieved all ${language} products`);
      return redisCache;
    }
    console.log(`📛 [REDIS CACHE MISS] ${language} products not found`);
    
    try {
      // Try MongoDB
      const client = await connectToDatabase();
      const collection = client.db('shopify_cache').collection('products_language');

      // Check if we have cached data for this language
      const cachedData = await collection.findOne(
        { language: language.toUpperCase() }
      );
      
      if (cachedData?.products) {
        console.log(`✅ [MONGODB] Found cached products for ${language}`);
        
        // Cache in Redis
        console.log(`💾 [REDIS] Caching ${language} products`);
        await setRedisData(redisKey, cachedData.products, 3600); // Cache for 1 hour
        
        return cachedData.products;
      }

      // If no cache exists, fetch from Shopify
      console.log(`📛 [CACHE MISS] No cached data found for ${language}, fetching from Shopify`);
      
      // Use the existing getPaginatedTranslatedProducts to fetch all products
      const allProducts = await getPaginatedTranslatedProducts(1, 1000, language);
      
      if (allProducts?.products) {
        // Cache in Redis
        console.log(`💾 [REDIS] Caching ${language} products`);
        await setRedisData(redisKey, allProducts.products, 3600); // Cache for 1 hour
        
        return allProducts.products;
      }
      
      throw new Error(`No products found for language: ${language}`);

    } catch (mongoError) {
      console.error('❌ [MONGODB] Error:', mongoError);
      
      // If MongoDB fails, try fetching directly from Shopify
      const allProducts = await getPaginatedTranslatedProducts(1, 1000, language);
      
      if (allProducts?.products) {
        // Cache in Redis even if MongoDB failed
        console.log(`💾 [REDIS] Caching ${language} products (MongoDB fallback)`);
        await setRedisData(redisKey, allProducts.products, 3600);
        
        return allProducts.products;
      }
      
      throw mongoError;
    }

  } catch (error) {
    console.error(`❌ [ERROR] Error fetching translated products for ${language}:`, error);
    throw error;
  }
}


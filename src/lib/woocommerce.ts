import { createClient } from 'redis';
import { getRedisClient, getCachedData as getRedisData, setCachedData as setRedisData } from './redis';
import { connectToDatabase } from './mongodb';
import { invalidatePageCache } from './cache';
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';

// Initialize WooCommerce API
const api = new WooCommerceRestApi.default({
  url: import.meta.env.WOOCOMMERCE_URL,
  consumerKey: import.meta.env.WOOCOMMERCE_CONSUMER_KEY,
  consumerSecret: import.meta.env.WOOCOMMERCE_SECRET_KEY,
  version: 'wc/v3'
});

// Add store identifier to Redis key prefix
const getStorePrefix = () => {
  const domain = import.meta.env.WOOCOMMERCE_URL?.split('//')[1]?.split('.')[0] || '';
  return `store_${domain}_`;
};

// Add this helper function at the top of the file
const getStoreName = () => {
  const domain = import.meta.env.WOOCOMMERCE_URL?.split('//')[1]?.split('.')[0] || 'default';
  return `woocommerce_${domain}_cache`;
};

// Background sync function
async function backgroundSyncProducts() {
  console.log('🔄 [BACKGROUND] Starting products sync');
  try {
    const client = await connectToDatabase();
    const dbName = getStoreName();
    const collection = client.db(dbName).collection('products');
    await fetchAndSaveAllProducts(collection);
    
    await invalidatePageCache('*/products/*');
    
    console.log('✅ [BACKGROUND] Products sync completed');
  } catch (error) {
    console.error('❌ [BACKGROUND] Products sync failed:', error);
  }
}

// Fetch all products from WooCommerce
async function fetchAndSaveAllProducts(collection: any | null) {
  let page = 1;
  let allProducts = [];
  const perPage = 100;

  while (true) {
    try {
      console.log(`📦 Fetching products page ${page}`);
      const response = await api.get('products', {
        per_page: perPage,
        page: page
      });

      const products = response.data;
      
      if (products.length === 0) break;
      
      allProducts = [...allProducts, ...products];
      console.log(`📦 Retrieved ${products.length} products (Total: ${allProducts.length})`);
      
      page++;
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      throw error;
    }
  }

  // Save to MongoDB if collection is provided
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
    }
  }

  return allProducts;
}

// Get all products
export async function getAllProducts() {
  const redisKey = `${getStorePrefix()}woo_all_products`;
  const redisCache = await getRedisData(redisKey);
  
  if (redisCache) {
    console.log('🚀 [REDIS CACHE HIT] Retrieved products from Redis');
    return redisCache;
  }
  console.log('📛 [REDIS CACHE MISS] Products not found in Redis');

  try {
    const client = await connectToDatabase();
    const dbName = getStoreName();
    const collection = client.db(dbName).collection('products');

    const hasData = await collection.countDocuments({ type: 'products_cache' });
    if (!hasData) {
      console.log('📢 [MONGODB] Empty collection detected, triggering background sync');
      backgroundSyncProducts().catch(console.error);
      
      const products = await fetchAndSaveAllProducts(null);
      await setRedisData(redisKey, products, 3600);
      return products;
    }

    const cacheData = await collection.findOne({ type: 'products_cache' });
    
    if (cacheData?.products) {
      console.log('✅ [MONGODB CACHE HIT] Retrieved products');
      await setRedisData(redisKey, cacheData.products, 3600);
      return cacheData.products;
    }

    const products = await fetchAndSaveAllProducts(collection);
    await setRedisData(redisKey, products, 3600);
    return products;

  } catch (error) {
    console.error('❌ Error fetching products:', error);
    throw error;
  }
}

// Get random products
async function getRandomProducts() {
  try {
    const redisKey = `${getStorePrefix()}woo_random_products`;
    const redisCache = await getRedisData(redisKey);
    
    if (redisCache) {
      return redisCache;
    }

    const client = await connectToDatabase();
    const dbName = getStoreName();
    const collection = client.db(dbName).collection('products');
    
    const randomProducts = await collection
      .aggregate([
        { $match: { type: 'products_cache' }},
        { $unwind: '$products' },
        { $sample: { size: 4 } },
        { $project: { _id: 0, product: '$products' } }
      ])
      .toArray();

    const result = randomProducts.map(item => item.product);
    await setRedisData(redisKey, result, 3600); // Cache for 1 hour
    return result;

  } catch (error) {
    console.error('❌ Error getting random products:', error);
    return [];
  }
}

// Get product by ID or slug
export async function getProductByHandle(handle: string) {
  try {
    const client = await connectToDatabase();
    const dbName = getStoreName();
    const collection = client.db(dbName).collection('products');
    
    // Try to find product in cache
    const cachedData = await collection.findOne({ type: 'products_cache' });
    const product = cachedData?.products?.find(p => p.slug === handle);

    if (product) {
      // Get random products
      const randomProducts = await getRandomProducts();
      return { product, relatedProducts: randomProducts };
    }

    // If not in cache, fetch from WooCommerce
    const response = await api.get('products', { slug: handle });
    if (!response.data?.[0]) throw new Error('Product not found');
    
    const wooProduct = response.data[0];
    
    // Save to cache if not exists
    if (cachedData) {
      await collection.updateOne(
        { type: 'products_cache' },
        { $addToSet: { products: wooProduct } }
      );
    } else {
      await collection.insertOne({
        type: 'products_cache',
        products: [wooProduct]
      });
    }

    // Get random products after saving
    const randomProducts = await getRandomProducts();
    return { product: wooProduct, relatedProducts: randomProducts };

  } catch (error) {
    console.error('Error in getProductByHandle:', error);
    throw error;
  }
}

// Get paginated products
export async function getPaginatedProducts(page: number = 1, limit: number = 20) {
  try {
    const redisKey = `${getStorePrefix()}woo_paginated_products_${page}_${limit}`;
    const redisCache = await getRedisData(redisKey);
    
    if (redisCache) {
      return redisCache;
    }

    const client = await connectToDatabase();
    const dbName = getStoreName();
    const collection = client.db(dbName).collection('products');
    
    // Check if we have data in MongoDB
    const cachedData = await collection.findOne({ type: 'products_cache' });
    
    if (!cachedData?.products?.length) {
      console.log('📢 [MONGODB] No products found, triggering background sync');
      // Trigger background sync and get data directly from API for immediate response
      backgroundSyncProducts().catch(console.error);
      
      const response = await api.get('products', {
        page,
        per_page: limit
      });

      const result = {
        products: response.data,
        pagination: {
          currentPage: page,
          totalPages: parseInt(response.headers['x-wp-totalpages']),
          totalProducts: parseInt(response.headers['x-wp-total']),
          hasNextPage: page < parseInt(response.headers['x-wp-totalpages']),
          hasPreviousPage: page > 1
        }
      };

      await setRedisData(redisKey, result, 3600);
      return result;
    }

    // Calculate pagination from MongoDB data
    const allProducts = cachedData.products;
    const totalProducts = allProducts.length;
    const totalPages = Math.ceil(totalProducts / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedProducts = allProducts.slice(startIndex, endIndex);

    const result = {
      products: paginatedProducts,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    };

    await setRedisData(redisKey, result, 3600);
    return result;

  } catch (error) {
    console.error('❌ Error fetching paginated products:', error);
    throw error;
  }
}

// Get all categories
export async function getAllCategories() {
  try {
    const redisKey = `${getStorePrefix()}woo_categories`;
    const redisCache = await getRedisData(redisKey);
    
    if (redisCache) {
      return redisCache;
    }

    const response = await api.get('products/categories', {
      per_page: 100
    });

    await setRedisData(redisKey, response.data, 3600);
    return response.data;

  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    throw error;
  }
}

// Get products by category
export async function getProductsByCategory(categoryId: number, page: number = 1, limit: number = 20) {
  try {
    const redisKey = `${getStorePrefix()}woo_category_${categoryId}_page_${page}`;
    const redisCache = await getRedisData(redisKey);
    
    if (redisCache) {
      return redisCache;
    }

    const response = await api.get('products', {
      category: categoryId,
      page,
      per_page: limit
    });

    const totalProducts = parseInt(response.headers['x-wp-total']);
    const totalPages = parseInt(response.headers['x-wp-totalpages']);

    const result = {
      products: response.data,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    };

    await setRedisData(redisKey, result, 3600);
    return result;

  } catch (error) {
    console.error('❌ Error fetching products by category:', error);
    throw error;
  }
}

// Search products
export async function searchProducts(query: string, page: number = 1, limit: number = 20) {
  try {
    const redisKey = `${getStorePrefix()}woo_search_${query}_page_${page}`;
    const redisCache = await getRedisData(redisKey);
    
    if (redisCache) {
      return redisCache;
    }

    const response = await api.get('products', {
      search: query,
      page,
      per_page: limit
    });

    const totalProducts = parseInt(response.headers['x-wp-total']);
    const totalPages = parseInt(response.headers['x-wp-totalpages']);

    const result = {
      products: response.data,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    };

    await setRedisData(redisKey, result, 3600);
    return result;

  } catch (error) {
    console.error('❌ Error searching products:', error);
    throw error;
  }
}

// Refresh cache
export async function refreshProductCache() {
  try {
    const client = await connectToDatabase();
    const dbName = getStoreName();
    const collection = client.db(dbName).collection('products');
    
    console.log('🔄 Manual cache refresh triggered');
    await collection.updateOne(
      { type: 'products_cache' },
      { $set: { lastUpdated: new Date(0) } }
    );
    
    const result = await getAllProducts();
    await invalidatePageCache('products/*');
    
    return result;
  } catch (error) {
    console.error('❌ Error refreshing cache:', error);
    throw error;
  }
}

export async function getAllCollections() {
  try {
    const redisKey = `${getStorePrefix()}woo_collections`;
    const redisCache = await getRedisData(redisKey);
    
    if (redisCache) {
      return redisCache;
    }

    const response = await api.get('products/categories', {
      per_page: 100
    });

    // Transform WooCommerce categories to match Shopify collections structure
    const collections = response.data.map(category => ({
      node: {
        id: category.id.toString(),
        title: category.name,
        handle: category.slug,
        description: category.description,
        image: category.image ? {
          url: category.image.src,
          altText: category.image.alt || category.name
        } : null,
        products: {
          edges: [{
            node: {
              priceRange: {
                minVariantPrice: {
                  amount: '0',
                  currencyCode: 'USD'
                }
              }
            }
          }]
        }
      }
    }));

    await setRedisData(redisKey, collections, 3600);
    return collections;

  } catch (error) {
    console.error('❌ Error fetching collections:', error);
    return [];
  }
}

export async function getCollectionByHandle(handle: string) {
  try {
    const redisKey = `${getStorePrefix()}woo_collection_${handle}`;
    const redisCache = await getRedisData(redisKey);
    
    if (redisCache) {
      return redisCache;
    }

    // Get category by slug
    const response = await api.get('products/categories', { 
      slug: handle
    });

    if (!response.data?.[0]) {
      throw new Error('Collection not found');
    }

    const category = response.data[0];
    let allProducts = [];
    let page = 1;
    
    // Fetch all products with pagination
    while (true) {
      try {
        const productsResponse = await api.get('products', {
          category: category.id,
          per_page: 100,  // Reduced from 250 to 100
          page: page
        });
        
        if (!productsResponse.data || productsResponse.data.length === 0) {
          break;
        }
        
        allProducts = [...allProducts, ...productsResponse.data];
        
        // Check if we've reached the last page
        const totalPages = parseInt(productsResponse.headers['x-wp-totalpages']);
        if (page >= totalPages) {
          break;
        }
        
        page++;
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));
        
      } catch (error) {
        console.error(`Error fetching products page ${page}:`, error);
        break;
      }
    }

    // Transform to match Shopify structure
    const collection = {
      id: category.id.toString(),
      title: category.name,
      handle: category.slug,
      description: category.description,
      seo: {
        title: category.name,
        description: category.description
      },
      image: category.image ? {
        url: category.image.src,
        altText: category.image.alt || category.name
      } : null,
      products: {
        edges: allProducts.map(product => ({
          node: {
            id: product.id.toString(),
            title: product.name,
            handle: product.slug,
            description: product.description,
            seo: {
              title: product.name,
              description: product.short_description || product.description
            },
            images: {
              edges: product.images.map(img => ({
                node: {
                  url: img.src,
                  altText: img.alt || product.name
                }
              }))
            },
            variants: {
              edges: [{
                node: {
                  id: product.id.toString(),
                  title: product.name,
                  price: {
                    amount: product.price || '0',
                    currencyCode: 'USD'
                  },
                  compareAtPrice: product.regular_price ? {
                    amount: product.regular_price,
                    currencyCode: 'USD'
                  } : null
                }
              }]
            }
          }
        }))
      }
    };

    await setRedisData(redisKey, collection, 3600);
    return collection;

  } catch (error) {
    console.error('❌ Error fetching collection:', error);
    throw error;
  }
} 
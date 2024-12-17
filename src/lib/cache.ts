import { getRedisClient } from './redis';
import { createHash } from 'crypto';

const CACHE_TTL = 3600; // 1 hour in seconds

// Generate a cache key based on URL and other parameters
export function generateCacheKey(path: string, lang: string): string {
  const hash = createHash('md5')
    .update(`${path}_${lang}`)
    .digest('hex');
  return `page_cache_${hash}`;
}

// Cache the rendered HTML
export async function cachePageContent(key: string, content: string): Promise<void> {
  try {
    const redis = await getRedisClient();
    await redis.setEx(key, CACHE_TTL, content);
    console.log('✅ Page cached successfully:', key);
  } catch (error) {
    console.error('❌ Error caching page:', error);
  }
}

// Get cached content
export async function getCachedPage(key: string): Promise<string | null> {
  try {
    const redis = await getRedisClient();
    const cached = await redis.get(key);
    return cached;
  } catch (error) {
    console.error('❌ Error getting cached page:', error);
    return null;
  }
}

// Invalidate cache based on pattern
export async function invalidatePageCache(pattern: string): Promise<void> {
  try {
    const redis = await getRedisClient();
    const keys = await redis.keys(`page_cache_${pattern}`);
    if (keys.length > 0) {
      await redis.del(keys);
      console.log(`✅ Invalidated ${keys.length} cached pages`);
    }
  } catch (error) {
    console.error('❌ Error invalidating cache:', error);
  }
} 
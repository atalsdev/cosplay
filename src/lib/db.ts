import { createClient } from '@supabase/supabase-js';
import { getCachedData, setCachedData } from './redis';

// Initialize Supabase client
export const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

interface Review {
  name: string;
  rating: number;
  date: string;
  verified: boolean;
  comment: string;
  language: string;
  store_name: string;
}

export async function getReviews(language: string, storeName: string) {
  try {
    // Generate cache key based on store and language
    const cacheKey = `reviews:${storeName.toLowerCase()}:${language}`;

    // Try to get cached reviews first
    const cachedReviews = await getCachedData(cacheKey);
    if (cachedReviews) {
      console.log('📦 Serving reviews from cache:', {
        storeName,
        language,
        count: cachedReviews.length
      });
      return { reviews: cachedReviews, error: null };
    }

    // If not in cache, fetch from Supabase
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('store_name', storeName.toLowerCase())
      .eq('language', language)
      .order('date', { ascending: false });

    if (error) {
      console.error('❌ Error fetching reviews:', error);
      return { reviews: null, error };
    }

    // Cache the results for 24 hours (86400 seconds)
    if (reviews && reviews.length > 0) {
      await setCachedData(cacheKey, reviews, 86400);
      console.log('💾 Cached reviews for:', {
        storeName,
        language,
        count: reviews.length
      });
    }

    console.log('✅ Successfully fetched reviews:', {
      count: reviews?.length || 0,
      language,
      storeName,
      reviews: reviews?.map(review => ({
        name: review.name,
        rating: review.rating,
        date: review.date,
        verified: review.verified,
        comment: review.comment.substring(0, 50) + '...' // Truncate long comments
      }))
    });

    return { reviews, error: null };
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    return { reviews: null, error: err };
  }
}

// Function to invalidate cache when new reviews are added
export async function invalidateReviewsCache(storeName: string, language: string) {
  const cacheKey = `reviews:${storeName.toLowerCase()}:${language}`;
  const redis = await getRedisClient();
  await redis.del(cacheKey);
  console.log('🔄 Invalidated cache for:', { storeName, language });
}

// Function to add a new review
export async function addReview(review: Review) {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert([{
        name: review.name,
        rating: review.rating,
        date: review.date,
        verified: review.verified,
        comment: review.comment,
        language: review.language,
        store_name: review.store_name.toLowerCase()
      }])
      .select();

    if (error) {
      console.error('❌ Error adding review:', error);
      return { success: false, error };
    }

    // Invalidate cache for this store/language combination
    await invalidateReviewsCache(review.store_name, review.language);

    console.log('✅ Successfully added review:', {
      name: review.name,
      store: review.store_name,
      language: review.language
    });

    return { success: true, data };
  } catch (err) {
    console.error('❌ Unexpected error adding review:', err);
    return { success: false, error: err };
  }
}

// Function to get review statistics
export async function getReviewStats(storeName: string) {
  try {
    const cacheKey = `review-stats:${storeName.toLowerCase()}`;
    
    // Try to get cached stats
    const cachedStats = await getCachedData(cacheKey);
    if (cachedStats) {
      return { stats: cachedStats, error: null };
    }

    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('rating, language')
      .eq('store_name', storeName.toLowerCase());

    if (error) {
      return { stats: null, error };
    }

    const stats = {
      totalReviews: reviews.length,
      averageRating: reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length,
      ratingDistribution: {
        5: reviews.filter(r => r.rating === 5).length,
        4: reviews.filter(r => r.rating === 4).length,
        3: reviews.filter(r => r.rating === 3).length,
        2: reviews.filter(r => r.rating === 2).length,
        1: reviews.filter(r => r.rating === 1).length,
      },
      byLanguage: reviews.reduce((acc, rev) => {
        acc[rev.language] = (acc[rev.language] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    // Cache stats for 1 day (86400 seconds)
    await setCachedData(cacheKey, stats, 86400);

    return { stats, error: null };
  } catch (err) {
    console.error('❌ Error getting review stats:', err);
    return { stats: null, error: err };
  }
}

// Function to get recent reviews across all stores
export async function getRecentReviews(limit: number = 10) {
  const cacheKey = `recent-reviews:${limit}`;
  
  try {
    // Try to get cached recent reviews
    const cachedReviews = await getCachedData(cacheKey);
    if (cachedReviews) {
      return { reviews: cachedReviews, error: null };
    }

    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      return { reviews: null, error };
    }

    // Cache recent reviews for 24 hours
    await setCachedData(cacheKey, reviews, 86400);

    return { reviews, error: null };
  } catch (err) {
    console.error('❌ Error getting recent reviews:', err);
    return { reviews: null, error: err };
  }
} 
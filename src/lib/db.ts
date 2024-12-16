import { createClient } from '@supabase/supabase-js';

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
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('store_name', storeName)
      .eq('language', language)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      return { reviews: null, error };
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
    console.error('Unexpected error:', err);
    return { reviews: null, error: err };
  }
} 
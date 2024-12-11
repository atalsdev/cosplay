import type { APIRoute } from 'astro';

export interface ShopifyBlogPost {
  id: string;
  title: string;
  handle: string;
  body_html: string;
  published_at: string;
  author: string;
  tags: string[];
  metafields?: {
    title_tag?: string;
    description_tag?: string;
  };
  image?: {
    src: string;
    alt?: string;
  };
}

async function fetchFromShopify(endpoint: string) {
  const apiUrl = import.meta.env.SHOPIFY_API_URL;
  const accessToken = import.meta.env.SHOPIFY_ACCESS_TOKEN;
  const blogId = import.meta.env.SHOPIFY_BLOG_ID;

  if (!apiUrl || !accessToken || !blogId) {
    throw new Error('Missing Shopify credentials');
  }

  const response = await fetch(`${apiUrl}/admin/api/2024-01/blogs/${blogId}${endpoint}`, {
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.statusText}`);
  }

  return response.json();
}

async function fetchMetafields(articleId: string): Promise<any> {
  try {
    const data = await fetchFromShopify(`/articles/${articleId}/metafields.json`);
    const metafields = data.metafields.reduce((acc: any, field: any) => {
      if (field.namespace === 'global') {
        if (field.key === 'title_tag' || field.key === 'description_tag') {
          acc[field.key] = field.value.trim();
        }
      }
      return acc;
    }, {});
    return metafields;
  } catch (error) {
    console.error('Error fetching metafields:', error);
    return {};
  }
}

export async function fetchBlogPosts(): Promise<ShopifyBlogPost[]> {
  try {
    const data = await fetchFromShopify('/articles.json');
    const articles = await Promise.all(
      data.articles.map(async (article: any) => {
        const metafields = await fetchMetafields(article.id);
        return {
          ...article,
          image: article.image || undefined,
          metafields,
        };
      })
    );
    return articles;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function fetchBlogPost(handle: string): Promise<ShopifyBlogPost | null> {
  try {
    const data = await fetchFromShopify(`/articles.json?handle=${handle}`);
    const article = data.articles[0];
    if (!article) return null;
    
    const metafields = await fetchMetafields(article.id);
    return {
      ...article,
      image: article.image || undefined,
      metafields,
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}
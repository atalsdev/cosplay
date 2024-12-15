import type { CollectionEntry } from 'astro:content';

export interface SEOProps {
  title: string;
  description: string;
  image?: string;
  article?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}

export function generateCanonicalURL(pathname: string): string {
  const siteUrl = import.meta.env.DOMAINE || '';
  return `${siteUrl}${pathname}`;
}

export function generateSchema(props: SEOProps, pathname: string): string {
  const siteName = import.meta.env.PUBLIC_SITE_NAME;
  
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: generateCanonicalURL('/'),
    description: `Your ultimate destination for ${siteName} gear, reviews, and community.`,
  };

  if (props.article) {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: props.title,
      description: props.description,
      image: props.image,
      datePublished: props.publishedTime,
      dateModified: props.modifiedTime || props.publishedTime,
      publisher: {
        '@type': 'Organization',
        name: siteName,
        logo: {
          '@type': 'ImageObject',
          url: generateCanonicalURL('/images/logo.png'),
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': generateCanonicalURL(pathname),
      },
    });
  }

  if (pathname.startsWith('/shop')) {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Store',
      name: `${siteName} Store`,
      description: props.description,
      url: generateCanonicalURL(pathname),
      image: props.image,
      priceRange: '$$$',
    });
  }

  return JSON.stringify(baseSchema);
}

export function generateProductSchema(product: any): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    offers: {
      '@type': 'Offer',
      price: product.price.replace('$', ''),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  });
}
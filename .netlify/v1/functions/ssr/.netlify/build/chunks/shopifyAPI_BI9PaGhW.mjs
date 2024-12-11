async function fetchFromShopify(endpoint) {
  const apiUrl = "https://pod-uk1.myshopify.com";
  const accessToken = "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";
  const blogId = "82152357935";
  const response = await fetch(`${apiUrl}/admin/api/2024-01/blogs/${blogId}${endpoint}`, {
    headers: {
      "X-Shopify-Access-Token": accessToken,
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.statusText}`);
  }
  return response.json();
}
async function fetchMetafields(articleId) {
  try {
    const data = await fetchFromShopify(`/articles/${articleId}/metafields.json`);
    const metafields = data.metafields.reduce((acc, field) => {
      if (field.namespace === "global") {
        if (field.key === "title_tag" || field.key === "description_tag") {
          acc[field.key] = field.value.trim();
        }
      }
      return acc;
    }, {});
    return metafields;
  } catch (error) {
    console.error("Error fetching metafields:", error);
    return {};
  }
}
async function fetchBlogPosts() {
  try {
    const data = await fetchFromShopify("/articles.json");
    const articles = await Promise.all(
      data.articles.map(async (article) => {
        const metafields = await fetchMetafields(article.id);
        return {
          ...article,
          image: article.image || void 0,
          metafields
        };
      })
    );
    return articles;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}
async function fetchBlogPost(handle) {
  try {
    const data = await fetchFromShopify(`/articles.json?handle=${handle}`);
    const article = data.articles[0];
    if (!article) return null;
    const metafields = await fetchMetafields(article.id);
    return {
      ...article,
      image: article.image || void 0,
      metafields
    };
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

export { fetchBlogPosts as a, fetchBlogPost as f };

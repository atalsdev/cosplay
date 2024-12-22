import requests
import json
from concurrent.futures import ThreadPoolExecutor
import math

# WooCommerce credentials
WC_URL = "https://repbag.shop/wp-json/wc/v3/products"
WC_CONSUMER_KEY = "ck_3820fd40913002217597e44fa10cf2ec030838d6"
WC_CONSUMER_SECRET = "cs_ac9d297b5f67755aa3b683671d3e3ffd7e2ecc0f"

# Shopify credentials
SHOPIFY_URL = "https://bagdila.myshopify.com/admin/api/2023-04/products.json"
SHOPIFY_API_KEY = "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"

# Fetch products from WooCommerce
def fetch_woocommerce_products():
    all_products = []
    page = 1
    per_page = 100  # WooCommerce max per page

    while True:
        try:
            response = requests.get(
                WC_URL,
                auth=(WC_CONSUMER_KEY, WC_CONSUMER_SECRET),
                params={'page': page, 'per_page': per_page}
            )
            response.raise_for_status()
            products = response.json()
            
            if not products:  # No more products
                break
                
            all_products.extend(products)
            page += 1
            
        except requests.exceptions.RequestException as e:
            print(f"Error fetching WooCommerce products page {page}: {e}")
            break

    return all_products

# Create products in Shopify
def create_shopify_product(product):
    shopify_payload = {
        "product": {
            "title": product.get("name"),
            "body_html": product.get("description"),
            "vendor": product.get("brand", "WooCommerce"),
            "product_type": product.get("categories")[0].get("name") if product.get("categories") else "Uncategorized",
            "variants": [
                {
                    "price": product.get("price"),
                    "sku": product.get("sku"),
                    "inventory_management": "shopify",
                    "inventory_quantity": 10,
                }
            ],
            "images": [{"src": img["src"]} for img in product.get("images", [])],
        }
    }
    headers = {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": SHOPIFY_API_KEY,
    }
    try:
        response = requests.post(
            SHOPIFY_URL, headers=headers, data=json.dumps(shopify_payload)
        )
        response.raise_for_status()
        print(f"Product {product['name']} migrated successfully.")
    except requests.exceptions.RequestException as e:
        print(f"Error creating product in Shopify: {e}")

# Main function
def migrate_products():
    print("Fetching all products from WooCommerce...")
    wc_products = fetch_woocommerce_products()
    total_products = len(wc_products)
    print(f"Found {total_products} products. Migrating to Shopify in parallel...")
    
    # Process products in parallel batches of 10
    with ThreadPoolExecutor(max_workers=10) as executor:
        executor.map(create_shopify_product, wc_products)
    
    print("Migration complete.")

if __name__ == "__main__":
    migrate_products()

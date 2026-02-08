# N8N Workflow Design - Product Search Agent

**Workflow Name**: `product-search-agent`  
**Purpose**: Semantic product search using vector database and Shopify inventory

---

## Workflow Structure

### 1. Execute Workflow Trigger
**Node Type**: Execute Workflow Trigger  
**Called by**: Orchestrator Agent

**Input Parameters**:
```json
{
  "query": "user search query",
  "filters": {
    "priceMin": 0,
    "priceMax": 1000,
    "size": "M",
    "color": "blue",
    "category": "shirts"
  },
  "limit": 5
}
```

---

### 2. Generate Query Embedding
**Node Type**: HTTP Request  
**Method**: POST  
**URL**: `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent`

**Headers**:
```json
{
  "Content-Type": "application/json",
  "x-goog-api-key": "{{ $env.GOOGLE_GEMINI_API_KEY }}"
}
```

**Body**:
```json
{
  "content": {
    "parts": [{"text": "{{ $json.query }}"}]
  }
}
```

**Output**: 768-dimensional embedding vector

---

### 3. Vector Search in Qdrant
**Node Type**: HTTP Request  
**Method**: POST  
**URL**: `{{ $env.QDRANT_URL }}/collections/products/points/search`

**Headers**:
```json
{
  "Content-Type": "application/json",
  "api-key": "{{ $env.QDRANT_API_KEY }}"
}
```

**Body**:
```json
{
  "vector": {{ $json.embedding }},
  "limit": 10,
  "with_payload": true,
  "score_threshold": 0.7
}
```

**Output**: Top 10 matching products with similarity scores

---

### 4. Apply Filters
**Node Type**: Code (JavaScript)

**Code**:
```javascript
const results = $input.all();
const filters = $('Execute Workflow Trigger').item.json.filters;

let filtered = results.filter(item => {
  const payload = item.json.payload;
  
  // Price filter
  if (filters.priceMin && payload.price < filters.priceMin) return false;
  if (filters.priceMax && payload.price > filters.priceMax) return false;
  
  // Size filter
  if (filters.size && !payload.sizes.includes(filters.size)) return false;
  
  // Color filter
  if (filters.color && !payload.colors.includes(filters.color)) return false;
  
  // Category filter
  if (filters.category && payload.category !== filters.category) return false;
  
  return true;
});

// Limit results
filtered = filtered.slice(0, filters.limit || 5);

return filtered.map(item => ({json: item.json}));
```

---

### 5. Fetch Full Product Details
**Node Type**: HTTP Request (Shopify Admin API)  
**Method**: GET  
**URL**: `https://{{ $env.SHOPIFY_STORE_URL }}/admin/api/2024-01/products/{{ $json.shopify_product_id }}.json`

**Headers**:
```json
{
  "X-Shopify-Access-Token": "{{ $env.SHOPIFY_ACCESS_TOKEN }}"
}
```

**Execute Once Per Item**: Yes

---

### 6. Check Inventory
**Node Type**: HTTP Request  
**Method**: GET  
**URL**: `https://{{ $env.SHOPIFY_STORE_URL }}/admin/api/2024-01/inventory_levels.json?inventory_item_ids={{ $json.inventory_item_id }}`

**Purpose**: Get real-time stock availability

---

### 7. Format Results
**Node Type**: Code (JavaScript)

**Code**:
```javascript
const products = $input.all();

const formatted = products.map(item => {
  const product = item.json.product;
  return {
    id: product.id,
    title: product.title,
    description: product.body_html.substring(0, 200) + '...',
    price: product.variants[0].price,
    image: product.images[0]?.src || '',
    url: `https://{{ $env.SHOPIFY_STORE_URL }}/products/${product.handle}`,
    inStock: item.json.inventory_quantity > 0,
    variants: product.variants.map(v => ({
      size: v.option1,
      color: v.option2,
      available: v.inventory_quantity > 0
    }))
  };
});

return [{json: {products: formatted}}];
```

---

### 8. Generate Natural Language Response
**Node Type**: AI Agent  
**Model**: Google Gemini Chat Model (gemini-3-flash)

**System Prompt**:
```
You are a helpful clothing store assistant.

The user searched for: "{{ $('Execute Workflow Trigger').item.json.query }}"

I found these products:
{{ JSON.stringify($json.products, null, 2) }}

Generate a friendly, natural response that:
1. Acknowledges their search
2. Presents the top 3 products with key details (name, price, sizes)
3. Asks if they'd like more information
4. Is concise (max 150 words)

Do not use markdown formatting. Be conversational.
```

---

### 9. Return Response
**Node Type**: Return Data  

**Output**:
```json
{
  "response": "{{ $json.response }}",
  "products": {{ $json.products }},
  "totalFound": {{ $json.products.length }}
}
```

---

## Example Execution

### Input:
```json
{
  "query": "comfortable summer dresses",
  "filters": {
    "priceMax": 100,
    "size": "M"
  },
  "limit": 3
}
```

### Output:
```json
{
  "response": "I found some great summer dresses for you! Here are my top picks:\n\n1. **Floral Sundress** - $49.99 (Available in M, L)\n2. **Linen Maxi Dress** - $79.99 (Available in S, M, XL)\n3. **Cotton A-Line Dress** - $59.99 (Available in M)\n\nAll are perfect for warm weather! Would you like to see more details or other options?",
  "products": [...],
  "totalFound": 3
}
```

---

## Error Handling

**Scenario**: No products found  
**Response**: "I couldn't find products matching that description. Would you like me to suggest similar items or show our latest arrivals?"

**Scenario**: Qdrant API error  
**Response**: "I'm having trouble searching right now. Let me show you our featured products instead."

---

## Performance Optimization

1. **Caching**: Cache popular search embeddings
2. **Batch Processing**: Process multiple variants in parallel
3. **Timeout**: Set 3-second timeout for Shopify API calls
4. **Fallback**: If vector search fails, fall back to keyword search

---

## Next Steps

1. Build workflow in N8N
2. Test with various search queries
3. Tune similarity threshold (0.7 is starting point)
4. Monitor response times
5. Add caching layer if needed

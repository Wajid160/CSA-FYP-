# Database Schema Design

**Project**: Customer Support Agent for Clothing Web Store  
**Database**: PostgreSQL (Supabase)  
**Last Updated**: February 2, 2026

## Schema Overview

The database is designed to support:
- Conversation history and context
- Customer profiles and preferences
- Agent memory and learning
- Order tracking (synced from Shopify)
- Analytics and metrics

---

## Tables

### 1. `customers`
Stores customer profile information synced from Shopify.

```sql
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shopify_customer_id BIGINT UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    preferred_language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_customers_shopify_id ON customers(shopify_customer_id);
CREATE INDEX idx_customers_email ON customers(email);
```

---

### 2. `conversations`
Tracks individual conversation sessions.

```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    is_authenticated BOOLEAN DEFAULT FALSE,
    channel VARCHAR(50) DEFAULT 'web_chat', -- web_chat, voice, etc.
    status VARCHAR(50) DEFAULT 'active', -- active, resolved, escalated
    escalated_to_human BOOLEAN DEFAULT FALSE,
    escalation_reason TEXT,
    sentiment_score DECIMAL(3,2), -- 0.00 to 1.00
    started_at TIMESTAMP DEFAULT NOW(),
    ended_at TIMESTAMP,
    total_messages INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_conversations_customer ON conversations(customer_id);
CREATE INDEX idx_conversations_session ON conversations(session_id);
CREATE INDEX idx_conversations_status ON conversations(status);
```

---

### 3. `messages`
Stores all conversation messages (user and agent).

```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL, -- 'user', 'agent', 'system'
    content TEXT NOT NULL,
    metadata JSONB, -- Additional data (tool calls, function results, etc.)
    agent_name VARCHAR(100), -- Which sub-agent handled this (if applicable)
    response_time_ms INTEGER, -- Agent response time
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_role ON messages(role);
CREATE INDEX idx_messages_created ON messages(created_at);
```

---

### 4. `customer_preferences`
Stores learned customer preferences and shopping behavior.

```sql
CREATE TABLE customer_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    preference_key VARCHAR(100) NOT NULL, -- e.g., 'preferred_size', 'favorite_color', 'style'
    preference_value TEXT NOT NULL,
    confidence_score DECIMAL(3,2) DEFAULT 0.50, -- How confident we are (0.00-1.00)
    learned_from VARCHAR(50), -- 'conversation', 'purchase_history', 'explicit'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(customer_id, preference_key)
);

CREATE INDEX idx_preferences_customer ON customer_preferences(customer_id);
```

---

### 5. `orders_cache`
Cached Shopify order data for faster access.

```sql
CREATE TABLE orders_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shopify_order_id BIGINT UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    order_number VARCHAR(50),
    total_price DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'USD',
    status VARCHAR(50), -- pending, processing, shipped, delivered, cancelled
    fulfillment_status VARCHAR(50),
    financial_status VARCHAR(50),
    items JSONB, -- Array of order items
    shipping_address JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    synced_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_shopify_id ON orders_cache(shopify_order_id);
CREATE INDEX idx_orders_customer ON orders_cache(customer_id);
CREATE INDEX idx_orders_status ON orders_cache(status);
```

---

### 6. `agent_actions`
Logs autonomous actions taken by the agent.

```sql
CREATE TABLE agent_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    action_type VARCHAR(100) NOT NULL, -- 'refund', 'discount', 'order_modification', 'escalation'
    action_details JSONB NOT NULL,
    amount DECIMAL(10,2), -- Financial amount if applicable
    requires_approval BOOLEAN DEFAULT FALSE,
    approved BOOLEAN,
    approved_by VARCHAR(100), -- 'auto', 'admin_name'
    result VARCHAR(50), -- 'success', 'failed', 'pending'
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_actions_conversation ON agent_actions(conversation_id);
CREATE INDEX idx_actions_type ON agent_actions(action_type);
CREATE INDEX idx_actions_approval ON agent_actions(requires_approval, approved);
```

---

### 7. `faqs`
Frequently Asked Questions knowledge base.

```sql
CREATE TABLE faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100), -- 'shipping', 'returns', 'sizing', 'products'
    keywords TEXT[], -- Array of keywords for matching
    usage_count INTEGER DEFAULT 0,
    helpful_count INTEGER DEFAULT 0,
    not_helpful_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_faqs_category ON faqs(category);
CREATE INDEX idx_faqs_keywords ON faqs USING GIN(keywords);
```

---

### 8. `feedback`
Customer feedback on agent responses.

```sql
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    rating VARCHAR(20), -- 'thumbs_up', 'thumbs_down'
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_feedback_conversation ON feedback(conversation_id);
CREATE INDEX idx_feedback_rating ON feedback(rating);
```

---

### 9. `analytics_daily`
Daily aggregated analytics.

```sql
CREATE TABLE analytics_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE UNIQUE NOT NULL,
    total_conversations INTEGER DEFAULT 0,
    resolved_conversations INTEGER DEFAULT 0,
    escalated_conversations INTEGER DEFAULT 0,
    avg_response_time_ms INTEGER,
    avg_conversation_length INTEGER, -- Number of messages
    avg_sentiment_score DECIMAL(3,2),
    thumbs_up_count INTEGER DEFAULT 0,
    thumbs_down_count INTEGER DEFAULT 0,
    total_refunds_processed INTEGER DEFAULT 0,
    total_refund_amount DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_analytics_date ON analytics_daily(date);
```

---

## Vector Extension (pgvector)

For semantic search and RAG capabilities.

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Product embeddings table
CREATE TABLE product_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shopify_product_id BIGINT UNIQUE NOT NULL,
    product_title TEXT NOT NULL,
    product_description TEXT,
    embedding vector(768), -- Google Embedding API produces 768-dimensional vectors
    metadata JSONB, -- Price, category, sizes, colors, etc.
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_product_embeddings_vector ON product_embeddings 
    USING ivfflat (embedding vector_cosine_ops);

-- FAQ embeddings
CREATE TABLE faq_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faq_id UUID REFERENCES faqs(id) ON DELETE CASCADE,
    question_embedding vector(768),
    answer_embedding vector(768),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_faq_embeddings_question ON faq_embeddings 
    USING ivfflat (question_embedding vector_cosine_ops);
```

---

## Relationships Diagram

```
customers
    ├── conversations (1:N)
    │   ├── messages (1:N)
    │   ├── agent_actions (1:N)
    │   └── feedback (1:N)
    ├── customer_preferences (1:N)
    └── orders_cache (1:N)

faqs
    ├── faq_embeddings (1:1)
    └── (queried by agent)

product_embeddings
    └── (semantic search)
```

---

## Migration Strategy

### Phase 1 (MVP)
- ✅ `customers`
- ✅ `conversations`
- ✅ `messages`
- ✅ `faqs`
- ✅ `faq_embeddings`
- ✅ `product_embeddings`
- ✅ `feedback`

### Phase 2 (Autonomous Actions)
- ✅ `customer_preferences`
- ✅ `orders_cache`
- ✅ `agent_actions`

### Phase 3 (Analytics)
- ✅ `analytics_daily`

---

## Sample Queries

### Get conversation history
```sql
SELECT 
    m.role,
    m.content,
    m.created_at,
    m.response_time_ms
FROM messages m
WHERE m.conversation_id = 'uuid-here'
ORDER BY m.created_at ASC;
```

### Find similar products (RAG)
```sql
SELECT 
    product_title,
    product_description,
    metadata,
    1 - (embedding <=> '[embedding_vector]') AS similarity
FROM product_embeddings
ORDER BY embedding <=> '[embedding_vector]'
LIMIT 5;
```

### Daily agent performance
```sql
SELECT 
    date,
    total_conversations,
    ROUND((resolved_conversations::decimal / total_conversations) * 100, 2) AS resolution_rate,
    avg_response_time_ms,
    ROUND((thumbs_up_count::decimal / (thumbs_up_count + thumbs_down_count)) * 100, 2) AS satisfaction_rate
FROM analytics_daily
ORDER BY date DESC
LIMIT 30;
```

---

## Notes

- All tables use UUIDs for primary keys (better for distributed systems)
- JSONB fields for flexibility in storing dynamic data
- Indexes on foreign keys and frequently queried columns
- pgvector for semantic search (no need for separate Qdrant in some cases)
- Timestamps with timezone support
- Soft deletes not implemented (can add `deleted_at` if needed)

---

**Next Steps**:
1. Create SQL migration files
2. Set up Supabase project
3. Run migrations
4. Test with sample data

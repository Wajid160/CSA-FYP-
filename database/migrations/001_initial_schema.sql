-- Migration: Initial Schema Setup
-- Version: 001
-- Date: 2026-02-02
-- Description: Create core tables for Customer Support Agent

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Customers table
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

-- Conversations table
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    is_authenticated BOOLEAN DEFAULT FALSE,
    channel VARCHAR(50) DEFAULT 'web_chat',
    status VARCHAR(50) DEFAULT 'active',
    escalated_to_human BOOLEAN DEFAULT FALSE,
    escalation_reason TEXT,
    sentiment_score DECIMAL(3,2),
    started_at TIMESTAMP DEFAULT NOW(),
    ended_at TIMESTAMP,
    total_messages INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_conversations_customer ON conversations(customer_id);
CREATE INDEX idx_conversations_session ON conversations(session_id);
CREATE INDEX idx_conversations_status ON conversations(status);

-- Messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB,
    agent_name VARCHAR(100),
    response_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_role ON messages(role);
CREATE INDEX idx_messages_created ON messages(created_at);

-- FAQs table
CREATE TABLE faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    keywords TEXT[],
    usage_count INTEGER DEFAULT 0,
    helpful_count INTEGER DEFAULT 0,
    not_helpful_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_faqs_category ON faqs(category);
CREATE INDEX idx_faqs_keywords ON faqs USING GIN(keywords);

-- FAQ embeddings
CREATE TABLE faq_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faq_id UUID REFERENCES faqs(id) ON DELETE CASCADE,
    question_embedding vector(768),
    answer_embedding vector(768),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_faq_embeddings_question ON faq_embeddings 
    USING ivfflat (question_embedding vector_cosine_ops) WITH (lists = 100);

-- Product embeddings
CREATE TABLE product_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shopify_product_id BIGINT UNIQUE NOT NULL,
    product_title TEXT NOT NULL,
    product_description TEXT,
    embedding vector(768),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_product_embeddings_vector ON product_embeddings 
    USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Feedback table
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    rating VARCHAR(20),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_feedback_conversation ON feedback(conversation_id);
CREATE INDEX idx_feedback_rating ON feedback(rating);

-- Customer preferences
CREATE TABLE customer_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    preference_key VARCHAR(100) NOT NULL,
    preference_value TEXT NOT NULL,
    confidence_score DECIMAL(3,2) DEFAULT 0.50,
    learned_from VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(customer_id, preference_key)
);

CREATE INDEX idx_preferences_customer ON customer_preferences(customer_id);

-- Orders cache
CREATE TABLE orders_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shopify_order_id BIGINT UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    order_number VARCHAR(50),
    total_price DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'USD',
    status VARCHAR(50),
    fulfillment_status VARCHAR(50),
    financial_status VARCHAR(50),
    items JSONB,
    shipping_address JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    synced_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_shopify_id ON orders_cache(shopify_order_id);
CREATE INDEX idx_orders_customer ON orders_cache(customer_id);
CREATE INDEX idx_orders_status ON orders_cache(status);

-- Agent actions
CREATE TABLE agent_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    action_type VARCHAR(100) NOT NULL,
    action_details JSONB NOT NULL,
    amount DECIMAL(10,2),
    requires_approval BOOLEAN DEFAULT FALSE,
    approved BOOLEAN,
    approved_by VARCHAR(100),
    result VARCHAR(50),
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_actions_conversation ON agent_actions(conversation_id);
CREATE INDEX idx_actions_type ON agent_actions(action_type);
CREATE INDEX idx_actions_approval ON agent_actions(requires_approval, approved);

-- Analytics daily
CREATE TABLE analytics_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE UNIQUE NOT NULL,
    total_conversations INTEGER DEFAULT 0,
    resolved_conversations INTEGER DEFAULT 0,
    escalated_conversations INTEGER DEFAULT 0,
    avg_response_time_ms INTEGER,
    avg_conversation_length INTEGER,
    avg_sentiment_score DECIMAL(3,2),
    thumbs_up_count INTEGER DEFAULT 0,
    thumbs_down_count INTEGER DEFAULT 0,
    total_refunds_processed INTEGER DEFAULT 0,
    total_refund_amount DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_analytics_date ON analytics_daily(date);

-- Insert sample FAQs
INSERT INTO faqs (question, answer, category, keywords) VALUES
('What is your return policy?', 'We offer a 30-day return policy on all unworn items with tags attached. Simply contact us to initiate a return.', 'returns', ARRAY['return', 'refund', 'policy', 'exchange']),
('How long does shipping take?', 'Standard shipping takes 5-7 business days. Express shipping is available for 2-3 business day delivery.', 'shipping', ARRAY['shipping', 'delivery', 'time', 'tracking']),
('How do I track my order?', 'You can track your order using the tracking number sent to your email after shipment. Visit the tracking page on our website.', 'shipping', ARRAY['track', 'order', 'status', 'tracking number']),
('What payment methods do you accept?', 'We accept all major credit cards, PayPal, Apple Pay, and Google Pay.', 'payment', ARRAY['payment', 'credit card', 'paypal', 'apple pay']),
('How do I find my size?', 'Check our size guide on each product page. We provide detailed measurements for all clothing items.', 'sizing', ARRAY['size', 'fit', 'measurements', 'sizing guide']);

/**
 * ClothyMax AI Widget - Shopify Embed Script v2
 * Modern Voice-Enabled Chat Widget
 * 
 * INSTALLATION:
 * 1. Upload widget-v2.css and widget-v2.js to Shopify Files (Settings > Files)
 * 2. Get the CDN URLs for both files
 * 3. Add this code to your theme.liquid before </body>:
 * 
 * <!-- ClothyMax AI Chat Widget -->
 * <div id="clothymax-chat-widget"></div>
 * <link rel="stylesheet" href="YOUR_CSS_CDN_URL">
 * <script src="YOUR_JS_CDN_URL" defer></script>
 * 
 * OR use the inline version below:
 */

(function () {
    'use strict';

    // Configuration - Update these URLs after uploading to Shopify Files
    const WIDGET_CONFIG = {
        cssUrl: 'https://cdn.shopify.com/s/files/1/YOUR_SHOP_ID/files/widget-v2.css',
        jsUrl: 'https://cdn.shopify.com/s/files/1/YOUR_SHOP_ID/files/widget-v2.js'
    };

    // Create container
    if (!document.getElementById('clothymax-chat-widget')) {
        const container = document.createElement('div');
        container.id = 'clothymax-chat-widget';
        document.body.appendChild(container);
    }

    // Load CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = WIDGET_CONFIG.cssUrl;
    document.head.appendChild(cssLink);

    // Load JS
    const script = document.createElement('script');
    script.src = WIDGET_CONFIG.jsUrl;
    script.defer = true;
    document.body.appendChild(script);

    console.log('ClothyMax AI Widget v2 loaded');
})();

/*
 * ═══════════════════════════════════════════════════════════════════════════
 * SHOPIFY LIQUID SNIPPET (Alternative Method)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Save this as snippets/ai-chat-widget.liquid in your Shopify theme:
 * 
 * {% comment %} ClothyMax AI Chat Widget v2 {% endcomment %}
 * <div id="clothymax-chat-widget"></div>
 * 
 * {% comment %} Widget Styles {% endcomment %}
 * {{ 'widget-v2.css' | asset_url | stylesheet_tag }}
 * 
 * {% comment %} Widget Script {% endcomment %}
 * <script src="{{ 'widget-v2.js' | asset_url }}" defer></script>
 * 
 * {% comment %} Optional: Pass Shopify data to widget {% endcomment %}
 * <script>
 *   window.CLOTHYMAX_CONFIG = {
 *     shopDomain: '{{ shop.domain }}',
 *     customerEmail: {% if customer %}'{{ customer.email }}'{% else %}null{% endif %},
 *     customerId: {% if customer %}{{ customer.id }}{% else %}null{% endif %},
 *     cartItemCount: {{ cart.item_count }},
 *     currentPage: '{{ request.path }}'
 *   };
 * </script>
 * 
 * Then include in theme.liquid before </body>:
 * {% render 'ai-chat-widget' %}
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

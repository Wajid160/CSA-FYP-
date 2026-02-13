/**
 * ClothyMax AI Agent Widget v2
 * Text Chat + Voice Call Interface
 * Features: Text chat, Call Agent button, ElevenLabs integration ready
 */

(function () {
    'use strict';

    // ═══════════════════════════════════════════════════════════
    // CONFIGURATION
    // ═══════════════════════════════════════════════════════════

    const CONFIG = {
        webhookUrl: 'https://wajid8.app.n8n.cloud/webhook/orchestrator',
        botName: 'ClothyMax AI',
        welcomeMessage: "Welcome to ClothyMax! 👗 I'm your AI shopping assistant. How can I help you today?",
        quickReplies: [
            "Browse products",
            "Track my order",
            "Size guide",
            "Return policy"
        ],
        // ElevenLabs Configuration
        elevenLabs: {
            agentId: 'agent_1401kh1h34sef2ftkyd6yhvaqzr1'
        }
    };

    // ═══════════════════════════════════════════════════════════
    // STATE MANAGEMENT
    // ═══════════════════════════════════════════════════════════

    const state = {
        isOpen: false,
        isFirstOpen: true,
        isInCall: false,
        isMuted: false,
        callState: 'idle', // 'idle', 'connecting', 'listening', 'speaking'
        callStartTime: null,
        callTimerInterval: null,
        sessionId: generateSessionId()
    };

    function generateSessionId() {
        let sessionId = localStorage.getItem('cm_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('cm_session_id', sessionId);
        }
        return sessionId;
    }

    // ═══════════════════════════════════════════════════════════
    // WIDGET HTML
    // ═══════════════════════════════════════════════════════════

    function createWidget() {
        const container = document.getElementById('clothymax-chat-widget') || document.body;

        const widgetHTML = `
            <div class="cm-widget">
                <!-- Floating Button -->
                <button class="cm-chat-button" id="cm-toggle-btn" aria-label="Open AI Assistant">
                    <svg class="chat-icon" viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                    </svg>
                    <svg class="close-icon" viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>

                <!-- Chat Window -->
                <div class="cm-chat-window" id="cm-chat-window">
                    <!-- Header -->
                    <div class="cm-chat-header">
                        <div class="cm-header-avatar">✨</div>
                        <div class="cm-header-info">
                            <h3>${CONFIG.botName}</h3>
                            <p>Online</p>
                        </div>
                        <div class="cm-header-actions">
                            <button class="cm-header-btn call-btn" id="cm-call-btn" aria-label="Call Agent" title="Talk to AI">
                                <svg viewBox="0 0 24 24">
                                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                                </svg>
                            </button>
                            <button class="cm-header-btn" id="cm-clear-btn" aria-label="Clear chat" title="Clear History">
                                <svg viewBox="0 0 24 24">
                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                </svg>
                            </button>
                            <button class="cm-header-btn" id="cm-close-btn" aria-label="Close chat">
                                <svg viewBox="0 0 24 24">
                                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Messages Area -->
                    <div class="cm-chat-messages" id="cm-messages"></div>

                    <!-- Input Area -->
                    <div class="cm-chat-input-area">
                        <div class="cm-input-wrapper">
                            <input 
                                type="text" 
                                class="cm-chat-input" 
                                id="cm-input" 
                                placeholder="Type your message..." 
                                autocomplete="off"
                            >
                        </div>
                        <button class="cm-send-btn" id="cm-send-btn" aria-label="Send message">
                            <svg viewBox="0 0 24 24">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                            </svg>
                        </button>
                    </div>

                    <!-- Footer -->
                    <div class="cm-powered-by">
                        Powered by <span>ClothyMax AI</span>
                    </div>

                    <!-- Call Interface Overlay -->
                    <div class="cm-call-overlay" id="cm-call-overlay">
                        <div class="cm-call-header">
                            <h3>${CONFIG.botName}</h3>
                            <div class="cm-call-status" id="cm-call-status">Connecting...</div>
                            <div class="cm-call-timer" id="cm-call-timer">0:00</div>
                        </div>

                        <div class="cm-call-orb-container">
                            <div class="cm-call-orb" id="cm-call-orb">
                                <span class="cm-call-orb-icon">🎧</span>
                            </div>
                            <div class="cm-call-waveform" id="cm-call-waveform">
                                <div class="cm-call-wave-bar"></div>
                                <div class="cm-call-wave-bar"></div>
                                <div class="cm-call-wave-bar"></div>
                                <div class="cm-call-wave-bar"></div>
                                <div class="cm-call-wave-bar"></div>
                            </div>
                        </div>

                        <div class="cm-call-controls">
                            <button class="cm-call-control-btn mute-btn" id="cm-mute-btn" aria-label="Mute">
                                <svg viewBox="0 0 24 24" id="cm-mute-icon">
                                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                                </svg>
                                <svg viewBox="0 0 24 24" id="cm-muted-icon" style="display:none;">
                                    <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/>
                                </svg>
                            </button>
                            <button class="cm-call-control-btn end-btn" id="cm-end-call-btn" aria-label="End Call">
                                <svg viewBox="0 0 24 24">
                                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        if (container.id === 'clothymax-chat-widget') {
            container.innerHTML = widgetHTML;
        } else {
            const wrapper = document.createElement('div');
            wrapper.innerHTML = widgetHTML;
            container.appendChild(wrapper);
        }
    }

    // ═══════════════════════════════════════════════════════════
    // CALL INTERFACE FUNCTIONS
    // ═══════════════════════════════════════════════════════════

    function startCall() {
        state.isInCall = true;
        state.callState = 'connecting';
        state.callStartTime = null; // Don't start timer until connected

        const overlay = document.getElementById('cm-call-overlay');
        overlay?.classList.add('active');

        updateCallStatus('Connecting...');
        document.getElementById('cm-call-timer').textContent = '--:--';

        // Start timer interval (will only display when connected)
        state.callTimerInterval = setInterval(updateCallTimer, 1000);

        // Initialize ElevenLabs call
        initElevenLabsCall();
    }

    function endCall() {
        state.isInCall = false;
        state.callState = 'idle';
        state.isMuted = false;

        // Stop timer
        if (state.callTimerInterval) {
            clearInterval(state.callTimerInterval);
            state.callTimerInterval = null;
        }

        // Hide overlay
        const overlay = document.getElementById('cm-call-overlay');
        overlay?.classList.remove('active');

        // Reset UI
        updateCallStatus('');
        document.getElementById('cm-call-timer').textContent = '0:00';
        setCallOrbState('idle');
        updateMuteButton(false);

        // Close ElevenLabs connection
        closeElevenLabsCall();

        // Add message about call ending
        if (window.cmAddMessage) {
            window.cmAddMessage('Call ended. Is there anything else I can help you with?', 'bot');
        }
    }

    function toggleMute() {
        state.isMuted = !state.isMuted;
        updateMuteButton(state.isMuted);
        // TODO: Actually mute microphone in ElevenLabs
    }

    function updateMuteButton(isMuted) {
        const btn = document.getElementById('cm-mute-btn');
        const muteIcon = document.getElementById('cm-mute-icon');
        const mutedIcon = document.getElementById('cm-muted-icon');

        btn?.classList.toggle('muted', isMuted);
        if (muteIcon) muteIcon.style.display = isMuted ? 'none' : 'block';
        if (mutedIcon) mutedIcon.style.display = isMuted ? 'block' : 'none';
    }

    function updateCallStatus(status) {
        const el = document.getElementById('cm-call-status');
        if (el) el.textContent = status;
    }

    function updateCallTimer() {
        if (!state.callStartTime) return;

        const elapsed = Math.floor((Date.now() - state.callStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;

        const el = document.getElementById('cm-call-timer');
        if (el) el.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    function setCallOrbState(newState) {
        state.callState = newState;
        const orb = document.getElementById('cm-call-orb');

        if (!orb) return;

        orb.classList.remove('idle', 'connecting', 'listening', 'speaking');
        orb.classList.add(newState);

        const statusMap = {
            idle: '',
            connecting: 'Connecting...',
            listening: 'Listening...',
            speaking: 'Speaking...'
        };

        updateCallStatus(statusMap[newState] || '');
    }

    // ═══════════════════════════════════════════════════════════
    // ELEVENLABS INTEGRATION (Conversation SDK)
    // ═══════════════════════════════════════════════════════════

    let elevenLabsConversation = null;

    async function initElevenLabsCall() {
        try {
            updateCallStatus('Requesting microphone...');
            setCallOrbState('connecting');

            // Request microphone permission first
            await navigator.mediaDevices.getUserMedia({ audio: true });

            updateCallStatus('Connecting to agent...');

            // Load ElevenLabs SDK dynamically from ESM CDN
            if (!window.ElevenLabsConversation) {
                const module = await import('https://esm.sh/@11labs/client@latest');
                window.ElevenLabsConversation = module.Conversation;
            }

            const Conversation = window.ElevenLabsConversation;

            // Start the conversation session
            elevenLabsConversation = await Conversation.startSession({
                agentId: CONFIG.elevenLabs.agentId,

                onConnect: () => {
                    console.log('ElevenLabs: Connected');
                    setCallOrbState('listening');
                    updateCallStatus('Connected - Speak now');
                    // Reset timer to start from connection
                    state.callStartTime = Date.now();
                },

                onDisconnect: () => {
                    console.log('ElevenLabs: Disconnected');
                    endCall();
                },

                onMessage: (message) => {
                    console.log('ElevenLabs message:', message);
                    // Optionally show agent responses in chat
                    if (message.source === 'ai' && message.message) {
                        window.cmAddMessage?.(message.message, 'bot');
                    }
                },

                onModeChange: (mode) => {
                    console.log('ElevenLabs mode:', mode);
                    if (mode.mode === 'speaking') {
                        setCallOrbState('speaking');
                        updateCallStatus('AI is speaking...');
                    } else if (mode.mode === 'listening') {
                        setCallOrbState('listening');
                        updateCallStatus('Listening...');
                    }
                },

                onError: (error) => {
                    console.error('ElevenLabs error:', error);
                    updateCallStatus('Connection error');
                    setTimeout(() => endCall(), 2000);
                }
            });

            console.log('ElevenLabs: Session started');

        } catch (error) {
            console.error('Failed to initialize ElevenLabs:', error);

            if (error.name === 'NotAllowedError') {
                updateCallStatus('Microphone access denied');
            } else if (error.message?.includes('agent')) {
                updateCallStatus('Agent not available');
            } else {
                updateCallStatus('Connection failed');
            }

            setTimeout(() => endCall(), 2500);
        }
    }

    function closeElevenLabsCall() {
        if (elevenLabsConversation) {
            try {
                elevenLabsConversation.endSession();
            } catch (e) {
                console.log('Error ending session:', e);
            }
            elevenLabsConversation = null;
        }
    }

    // Toggle mute for the active call
    function toggleCallMute() {
        if (elevenLabsConversation) {
            try {
                if (state.isMuted) {
                    elevenLabsConversation.setVolume({ volume: 1 });
                } else {
                    elevenLabsConversation.setVolume({ volume: 0 });
                }
            } catch (e) {
                console.log('Mute toggle error:', e);
            }
        }
    }

    // ═══════════════════════════════════════════════════════════
    // INITIALIZE WIDGET
    // ═══════════════════════════════════════════════════════════

    function initWidget() {
        const toggleBtn = document.getElementById('cm-toggle-btn');
        const closeBtn = document.getElementById('cm-close-btn');
        const callBtn = document.getElementById('cm-call-btn');
        const chatWindow = document.getElementById('cm-chat-window');
        const messagesContainer = document.getElementById('cm-messages');
        const input = document.getElementById('cm-input');
        const sendBtn = document.getElementById('cm-send-btn');
        const muteBtn = document.getElementById('cm-mute-btn');
        const endCallBtn = document.getElementById('cm-end-call-btn');
        const clearBtn = document.getElementById('cm-clear-btn');

        // Toggle chat window
        function toggleChat() {
            state.isOpen = !state.isOpen;
            chatWindow.classList.toggle('open', state.isOpen);
            toggleBtn.classList.toggle('open', state.isOpen);

            if (state.isOpen && state.isFirstOpen) {
                state.isFirstOpen = false;
                // Only show welcome if no history
                if (!loadMessages()) {
                    addMessage(CONFIG.welcomeMessage, 'bot');
                    showQuickReplies();
                }
            }

            if (state.isOpen) {
                setTimeout(() => input.focus(), 300);
            }
        }

        toggleBtn.addEventListener('click', toggleChat);
        closeBtn.addEventListener('click', toggleChat);

        // Call button
        callBtn?.addEventListener('click', () => {
            if (!state.isInCall) {
                startCall();
            }
        });

        // Mute button
        muteBtn?.addEventListener('click', toggleMute);

        // End call button
        endCallBtn?.addEventListener('click', endCall);

        // Clear button
        clearBtn?.addEventListener('click', () => {
            if (confirm('Clear chat history?')) {
                localStorage.removeItem('cm_chat_history_' + state.sessionId);
                messagesContainer.innerHTML = '';
                addMessage(CONFIG.welcomeMessage, 'bot');
                showQuickReplies();
            }
        });

        // Add message to chat
        function addMessage(text, sender, save = true, type = 'text', products = []) {
            const messageDiv = document.createElement('div');

            if (type === 'products' && products.length > 0) {
                // Render Product Cards
                messageDiv.className = `cm-message ${sender} products`;
                messageDiv.style.background = 'transparent';
                messageDiv.style.padding = '0';
                messageDiv.style.boxShadow = 'none';

                let cardsHTML = `<div class="cm-products-container">`;
                products.forEach(product => {
                    const price = product.price ? (product.price.startsWith('$') ? product.price : `$${product.price}`) : '';
                    cardsHTML += `
                        <div class="cm-product-card">
                            <img src="${product.image || 'https://via.placeholder.com/220x220?text=No+Image'}" class="cm-product-image" alt="${product.title}">
                            <div class="cm-product-details">
                                <div class="cm-product-title" title="${product.title}">${product.title}</div>
                                <div class="cm-product-price">${price}</div>
                                <a href="${product.link || '#'}" target="_blank" class="cm-product-btn">View Product</a>
                            </div>
                        </div>
                    `;
                });
                cardsHTML += `</div>`;
                messageDiv.innerHTML = cardsHTML;
            } else {
                // Render Text Message
                messageDiv.className = `cm-message ${sender}`;
                messageDiv.textContent = text;
            }

            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            if (save) {
                saveMessage(text, sender, type, products);
            }
        }

        // Save message to local storage
        function saveMessage(text, sender, type = 'text', products = []) {
            const history = JSON.parse(localStorage.getItem('cm_chat_history_' + state.sessionId) || '[]');
            history.push({ text, sender, type, products, timestamp: Date.now() });
            localStorage.setItem('cm_chat_history_' + state.sessionId, JSON.stringify(history));
        }

        // Load messages from local storage
        function loadMessages() {
            const history = JSON.parse(localStorage.getItem('cm_chat_history_' + state.sessionId) || '[]');
            if (history.length > 0) {
                history.forEach(msg => addMessage(msg.text, msg.sender, false, msg.type, msg.products));
                return true;
            }
            return false;
        }

        // Make addMessage available globally
        window.cmAddMessage = addMessage;

        // Show quick replies
        function showQuickReplies() {
            const quickRepliesHTML = `
                <div class="cm-quick-replies">
                    ${CONFIG.quickReplies.map(reply =>
                `<button class="cm-quick-reply">${reply}</button>`
            ).join('')}
                </div>
            `;
            messagesContainer.insertAdjacentHTML('beforeend', quickRepliesHTML);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            document.querySelectorAll('.cm-quick-reply').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelector('.cm-quick-replies')?.remove();
                    sendMessage(btn.textContent);
                });
            });
        }

        // Show typing indicator
        function showTyping() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'cm-typing';
            typingDiv.id = 'cm-typing-indicator';
            typingDiv.innerHTML = '<span></span><span></span><span></span>';
            messagesContainer.appendChild(typingDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        function hideTyping() {
            document.getElementById('cm-typing-indicator')?.remove();
        }

        // Send message to backend
        async function sendMessage(text) {
            if (!text.trim()) return;

            addMessage(text, 'user');
            input.value = '';
            sendBtn.disabled = true;
            showTyping();

            try {
                const response = await fetch(CONFIG.webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        question: text,
                        sessionId: state.sessionId,
                        timestamp: new Date().toISOString(),
                        source: 'clothymax-widget-v2'
                    })
                });

                hideTyping();

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                // Debug: Log the raw response from N8N
                console.log('N8N Raw Response:', JSON.stringify(data, null, 2));

                // Extract response - N8N often returns arrays or nested structures
                let botResponse;

                // If data is an array, get first element
                const responseData = Array.isArray(data) ? data[0] : data;

                // Try common response keys (N8N uses various output formats)
                botResponse = responseData?.text_response  // Your N8N orchestrator format
                    || responseData?.voice_response
                    || responseData?.output
                    || responseData?.response
                    || responseData?.answer
                    || responseData?.message
                    || responseData?.text
                    || responseData?.result
                    || responseData?.reply
                    // Check for nested structures like { json: { output: "..." } }
                    || responseData?.json?.output
                    || responseData?.json?.response
                    || responseData?.json?.message
                    || responseData?.json?.text
                    // If it's a simple string response
                    || (typeof responseData === 'string' ? responseData : null)
                    || 'I apologize, but I encountered an issue. Please try again.';

                // Extract Products
                const products = responseData?.products
                    || responseData?.json?.products
                    || [];

                // 1. Show Text Response first
                if (botResponse) {
                    addMessage(botResponse, 'bot');
                }

                // 2. Show Products if available
                if (products && products.length > 0) {
                    addMessage('', 'bot', true, 'products', products);
                }

            } catch (error) {
                hideTyping();
                console.error('Chat error:', error);
                addMessage('Connection issue. Please try again in a moment.', 'bot');
            }

            sendBtn.disabled = false;
            input.focus();
        }

        // Event listeners
        sendBtn.addEventListener('click', () => sendMessage(input.value));

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input.value);
            }
        });
    }

    // ═══════════════════════════════════════════════════════════
    // INITIALIZE ON DOM READY
    // ═══════════════════════════════════════════════════════════

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            createWidget();
            initWidget();
        });
    } else {
        createWidget();
        initWidget();
    }

})();

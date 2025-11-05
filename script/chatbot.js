// Chatbot JavaScript
class ZonixtecChatbot {
    constructor() {
        this.sessionId = this.getOrCreateSessionId();
        this.isTyping = false;
        this.userName = localStorage.getItem('chatbot_user_name') || '';
        this.userEmail = localStorage.getItem('chatbot_user_email') || '';
        this.userPhone = localStorage.getItem('chatbot_user_phone') || '';
        this.init();
    }

    getOrCreateSessionId() {
        let sessionId = localStorage.getItem('chatbot_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('chatbot_session_id', sessionId);
        }
        return sessionId;
    }

    init() {
        this.injectHTML();
        this.attachEventListeners();
        if (this.userName && this.userEmail) {
            this.showChatInterface();
            this.addBotMessage("Welcome back, " + this.userName + "! How can I help you today?");
        } else {
            this.showWelcomeMessage();
        }
    }

    injectHTML() {
        const chatbotHTML = `
            <div class="chatbot-container">
                <button class="chatbot-toggle" id="chatbot-toggle" aria-label="Open chat">
                    <i class="fas fa-comments"></i>
                </button>
                <div class="chatbot-window" id="chatbot-window">
                    <div class="chatbot-header">
                        <div class="chatbot-header-info">
                            <div class="chatbot-avatar">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div class="chatbot-header-text">
                                <h3>Zonixtec Assistant</h3>
                                <p>Online • Ready to help</p>
                            </div>
                        </div>
                        <button class="chatbot-close" id="chatbot-close" aria-label="Close chat">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="chatbot-user-info" id="chatbot-user-info" style="display: none;">
                        <input type="text" id="user-name" placeholder="Your Name *" required>
                        <input type="email" id="user-email" placeholder="Your Email *" required>
                        <input type="tel" id="user-phone" placeholder="Your Phone (optional)">
                        <button id="start-chat-btn">Start Chat</button>
                    </div>
                    
                    <div class="chatbot-messages" id="chatbot-messages"></div>
                    
                    <div class="chatbot-input-container">
                        <form class="chatbot-input-form" id="chatbot-form" autocomplete="off">
                            <input 
                                type="text" 
                                class="chatbot-input" 
                                id="chatbot-input" 
                                name="chatbot-message"
                                placeholder="Type your message..." 
                                autocomplete="off"
                                spellcheck="true"
                                maxlength="500"
                            >
                            <button type="submit" class="chatbot-send" id="chatbot-send" aria-label="Send message">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    attachEventListeners() {
        const toggle = document.getElementById('chatbot-toggle');
        const close = document.getElementById('chatbot-close');
        const form = document.getElementById('chatbot-form');
        const startChatBtn = document.getElementById('start-chat-btn');
        const input = document.getElementById('chatbot-input');

        toggle.addEventListener('click', () => this.toggleChat());
        close.addEventListener('click', () => this.closeChat());
        form.addEventListener('submit', (e) => this.handleSubmit(e));
        startChatBtn.addEventListener('click', () => this.startChat());
        
        // Prevent any interference with space key
        input.addEventListener('keydown', (e) => {
            // Allow space key (keyCode 32 or key ' ')
            if (e.key === ' ' || e.keyCode === 32) {
                e.stopPropagation();
            }
        });
        
        // Allow all input
        input.addEventListener('keypress', (e) => {
            e.stopPropagation();
        });
    }

    toggleChat() {
        const window = document.getElementById('chatbot-window');
        window.classList.toggle('active');
    }

    closeChat() {
        const window = document.getElementById('chatbot-window');
        window.classList.remove('active');
    }

    showWelcomeMessage() {
        document.getElementById('chatbot-user-info').style.display = 'block';
        this.addBotMessage("👋 Welcome to Zonixtec! I'm your AI assistant. Please share your details to get started.");
    }

    startChat() {
        const name = document.getElementById('user-name').value.trim();
        const email = document.getElementById('user-email').value.trim();
        const phone = document.getElementById('user-phone').value.trim();

        if (!name || !email) {
            alert('Please enter your name and email');
            return;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        this.userName = name;
        this.userEmail = email;
        this.userPhone = phone;

        localStorage.setItem('chatbot_user_name', name);
        localStorage.setItem('chatbot_user_email', email);
        localStorage.setItem('chatbot_user_phone', phone);

        document.getElementById('chatbot-user-info').style.display = 'none';
        this.showChatInterface();
        this.addBotMessage(`Hello ${name}! 👋 How can I help you today?`);
        this.showQuickReplies();
    }

    showChatInterface() {
        document.getElementById('chatbot-user-info').style.display = 'none';
    }

    showQuickReplies() {
        const quickReplies = [
            'Our Services',
            'AI Solutions',
            'Contact Info',
            'Get a Quote'
        ];

        const repliesHTML = `
            <div class="quick-replies" id="quick-replies">
                ${quickReplies.map(reply => 
                    `<button class="quick-reply-btn" onclick="chatbot.sendQuickReply('${reply}')">${reply}</button>`
                ).join('')}
            </div>
        `;

        const messagesContainer = document.getElementById('chatbot-messages');
        messagesContainer.insertAdjacentHTML('beforeend', repliesHTML);
        this.scrollToBottom();
    }

    sendQuickReply(message) {
        document.querySelectorAll('.quick-replies').forEach(el => el.remove());
        this.sendMessage(message);
    }

    async handleSubmit(e) {
        e.preventDefault();
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();

        if (!message || this.isTyping) return;

        input.value = '';
        this.sendMessage(message);
    }

    async sendMessage(message) {
        this.addUserMessage(message);
        this.showTyping();

        try {
            const response = await fetch('https://zonixtec.com/server/chatbot/chatbot-send-message.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    session_id: this.sessionId,
                    user_name: this.userName,
                    user_email: this.userEmail,
                    user_phone: this.userPhone,
                    message: message
                })
            });

            const data = await response.json();

            setTimeout(() => {
                this.hideTyping();
                if (data.success && data.response) {
                    this.addBotMessage(data.response);
                } else {
                    this.addBotMessage("I'm sorry, I couldn't process that. Please try again or contact us directly.");
                }
            }, 800);

        } catch (error) {
            console.error('Chatbot error:', error);
            this.hideTyping();
            this.addBotMessage("Sorry, I'm having trouble connecting. Please try again later.");
        }
    }

    addUserMessage(message) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageHTML = `
            <div class="chat-message user">
                <div class="message-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="message-wrapper">
                    <div class="message-content">${this.escapeHtml(message)}</div>
                    <div class="message-time">${this.getCurrentTime()}</div>
                </div>
            </div>
        `;
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        this.scrollToBottom();
    }

    addBotMessage(message) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const formattedMessage = this.formatMessage(message);
        const messageHTML = `
            <div class="chat-message bot">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-wrapper">
                    <div class="message-content">${formattedMessage}</div>
                    <div class="message-time">${this.getCurrentTime()}</div>
                </div>
            </div>
        `;
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        this.scrollToBottom();
    }

    showTyping() {
        this.isTyping = true;
        const messagesContainer = document.getElementById('chatbot-messages');
        const typingHTML = `
            <div class="chat-message bot" id="typing-indicator">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-wrapper">
                    <div class="typing-indicator">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
            </div>
        `;
        messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
        this.scrollToBottom();
    }

    hideTyping() {
        this.isTyping = false;
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chatbot-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    formatMessage(text) {
        // Escape HTML first
        let formatted = this.escapeHtml(text);
        
        // Convert newlines to <br>
        formatted = formatted.replace(/\n/g, '<br>');
        
        // Convert bullet points
        formatted = formatted.replace(/•/g, '<span class="bullet">•</span>');
        
        // Make emojis stand out
        formatted = formatted.replace(/([\u{1F300}-\u{1F9FF}])/gu, '<span class="emoji">$1</span>');
        
        return formatted;
    }
}

// Initialize chatbot when DOM is ready
let chatbot;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        chatbot = new ZonixtecChatbot();
    });
} else {
    chatbot = new ZonixtecChatbot();
}

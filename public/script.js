// Global variables
let isTyping = false;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Campus Bot initialized!');
    loadQuickActions();
});

// Send message function
async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addMessage(message, 'user');
    input.value = '';
    
    // Show typing indicator
    showTyping();
    
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });
        
        const data = await response.json();
        
        // Hide typing and show bot response
        hideTyping();
        
        if (data.success) {
            addMessage(data.response, 'bot');
        } else {
            addMessage('Sorry, I encountered an error. Please try again.', 'bot');
        }
        
    } catch (error) {
        hideTyping();
        addMessage('Connection error. Please check your internet and try again.', 'bot');
        console.error('Error:', error);
    }
}

// Add message to chat
function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = sender === 'bot' ? '🤖' : '👤';
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <div class="message-text">${text}</div>
            <div class="message-time">${time}</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Quick message function
function sendQuickMessage(message) {
    document.getElementById('messageInput').value = message;
    sendMessage();
}

// Handle Enter key press
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Show typing indicator
function showTyping() {
    if (isTyping) return;
    isTyping = true;
    
    const typingIndicator = document.getElementById('typingIndicator');
    typingIndicator.style.display = 'flex';
    
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Hide typing indicator
function hideTyping() {
    isTyping = false;
    const typingIndicator = document.getElementById('typingIndicator');
    typingIndicator.style.display = 'none';
}

// Load quick actions
async function loadQuickActions() {
    try {
        const response = await fetch('/api/quick-actions');
        const actions = await response.json();
        
        const container = document.getElementById('quickActions');
        container.innerHTML = actions.map(action => `
            <div class="quick-action" onclick="sendQuickMessage('${action.text}')">
                <span class="icon">${action.icon}</span>
                <span>${action.text.split(' ')[0]}</span>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Failed to load quick actions:', error);
    }
}

// Clear chat function
function clearChat() {
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.innerHTML = `
        <div class="message bot-message">
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="message-text">
                    Hello! I'm your Campus Helper Bot. I can help you with:
                    <br><br>
                    📍 Campus navigation<br>
                    📅 Class schedules<br>
                    🍽️ Dining information<br>
                    🎉 Campus events<br>
                    🚨 Emergency contacts<br>
                    <br>
                    What would you like to know?
                </div>
                <div class="message-time">Just now</div>
            </div>
        </div>
    `;
}

// Toggle settings modal
function toggleSettings() {
    const modal = document.getElementById('settingsModal');
    modal.style.display = modal.style.display === 'none' ? 'flex' : 'none';
}

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Load saved settings
function loadSettings() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('darkMode').checked = true;
    }
}

// Initialize settings on load
document.addEventListener('DOMContentLoaded', loadSettings);

const chatBox = document.getElementById('chatBox');
const chatInput = document.getElementById('chatInput');

function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        addMessage('user', message);
        chatInput.value = '';
        getBotResponse(message);
    }
}

function addMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${sender}`;

    const logo = document.createElement('img');
    logo.src = 'https://t3.ftcdn.net/jpg/01/86/34/08/360_F_186340800_qlgVLkKLVy19r6SEL7RnniP1Yz6dmq8T.jpg'; // Replace with the actual path to your logo
    logo.className = 'chat-logo';

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.textContent = message;

    if (sender === 'user') {
        messageElement.appendChild(bubble);
        messageElement.appendChild(logo);
    } else {
        messageElement.appendChild(logo);
        messageElement.appendChild(bubble);
    }

    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Initial chatbot message
window.onload = function() {
    addMessage('bot', 'How can I help you today?');
};

function getBotResponse(message) {
    // Simulate an AI response
    setTimeout(() => {

        // Here you would implement the call to your language learning model
        // For example, you could use an API call to a service like OpenAI's GPT-3
        // const botMessage = callToLanguageModelAPI(message);
        
        const botMessage = `You said: ${message}`; // Placeholder response
        addMessage('bot', botMessage);
    }, 1000);
}

// Toggle QR Code Modal
function toggleQRModal() {
    const qrModal = document.getElementById('qrModal');
    qrModal.style.display = qrModal.style.display === 'block' ? 'none' : 'block';
}

// Close QR Modal when clicking outside of it
window.onclick = function(event) {
    const qrModal = document.getElementById('qrModal');
    if (event.target === qrModal) {
        qrModal.style.display = 'none';
    }
}

// Handle Mobile Login Form Submission
document.getElementById('loginFormMobile').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById('usernameMobile').value;

    // Accept any username for login
    if (username) {
        console.log(username + ' has logged in successfully');
        currentUser = username;
        localStorage.setItem('currentUser', username); // Save username to localStorage
        updateUser(username);
        toggleLoginDropdownMobile(); // Close dropdown after login
    } else {
        alert('Please enter a username');
    }
});

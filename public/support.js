// ================================
// Support Chat and Configuration Logic (support.js)
// --------------------------------
// This file manages the support chat functionality. It is responsible for:
// - Sending user messages and fetching bot responses
// - Rendering chat bubbles and applying visual styles
// - Handling configuration sliders (temperature and language selection)
// - Managing QR modal toggling and notifications for support interactions
// ================================
const coffeeBotFlagKey = process.env.LD_COFFEE_BOT_FLAG || "coffee-bot";

const chatBox = document.getElementById('chatBox');
const chatInput = document.getElementById('chatInput');

// Access slider values for configuration
const temperatureSlider = document.getElementById('temperatureSlider');
const tokensSlider = document.getElementById('tokensSlider');

// Function: sendMessage
// Send a message from the user and then fetch a bot response.
function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        addMessage('user', message);
        chatInput.value = '';
        getBotResponse(message);
    }
}

document.querySelector('.nav-bar h1').style.display = 'block';

// Helper: applyGreenColorScheme
// Applies the green color scheme to various UI elements.
function applyGreenColorScheme() {
    const logo = document.querySelector('.nav-bar h1');
    const greenElements = document.querySelectorAll('.login-btn, .add-to-cart-btn, .cart-btn, #cartCountMobile, #cartCountDesktop');
    if (logo) {
        logo.style.fontFamily = 'Pacifico, cursive';
        logo.style.color = '#006241'; // Green color
        logo.style.display = 'block';
    }
    greenElements.forEach(element => {
        element.style.backgroundColor = '#006241'; // Green background
        element.style.color = '#fff'; // Ensure text is white
        logo.style.font = "24px Pacifico, cursive";
        logo.style.display = 'block';
    });
}

client.on('ready', () => {
    coffeeBotResponse = client.variation(coffeeBotFlagKeyß, context, false);
    console.log(coffeeBotResponse)
});

// Function: addMessage
// Purpose: Add a chat bubble to the chatBox from the user or bot.
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

// Initialize support chat on window load.
window.onload = function() {
    addMessage('bot', 'How can I help you today?');
    applyGreenColorScheme();
};

// Async function: getBotResponse
// Fetches the chatbot response from the server.
async function getBotResponse(message) {
    try {
        const response = await fetch('/api/chatbot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();
        addMessage('bot', data.response);
    } catch (error) {
        console.error('Error:', error);
        addMessage('bot', 'Sorry, I am having trouble understanding you right now.');
    }
}

// Toggle QR Modal visibility.
function toggleQRModal() {
    const qrModal = document.getElementById('qrModal');
    qrModal.style.display = qrModal.style.display === 'block' ? 'none' : 'block';
}

// Toggle Login Dropdown Mobile
function toggleLoginDropdownMobile() {
    if (!currentUser) {
        signIn();
    } else {
        logout();
    }
    const dropdownMobile = document.getElementById("loginDropdownMobile");
    dropdownMobile.style.display = dropdownMobile.style.display === "block" ? "none" : "block";
}

// Close QR Modal when clicking outside of it
window.onclick = function(event) {
    const qrModal = document.getElementById('qrModal');
    if (event.target === qrModal) {
        qrModal.style.display = 'none';
    }
}

// Config Button: Attach event handler for sending configuration settings.
document.getElementById('selectConfig').addEventListener('click', async () => {
    const temperature = document.getElementById('temperatureValue').textContent.toLowerCase();
    const tokens = document.getElementById('tokensValue').textContent.toLowerCase();
    alert('Selected configuration: ' + temperature + ' temperature and ' + tokens);

    try {
        // Make the API call to your server-side endpoint
        const response = await fetch('/api/chatbot-context', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ temperature, tokens }) // Send temperature and tokens in the request body
        });

        if (!response.ok) {
            throw new Error('Failed to toggle feature flag');
        }

        const data = await response.json();
        console.log(`Success: ${data.message}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        document.getElementById('statusMessage').textContent = `Error: ${error.message}`;
    }
});

// Additional helper functions for token and temperature updates.
function updateTokensValue(value) {
    const tokensText = value == 1 ? 'English' : 'Spanish';
    document.getElementById('tokensValue').textContent = tokensText;
}

function toggleNav() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('show');
}

function closeLoginDropdownMobile() {
    const dropdownMobile = document.getElementById('loginDropdownMobile');
    dropdownMobile.style.display = 'none';
}

function updateTemperatureValue(value) {
    const temperatureText = value == 1 ? 'Low' : value == 2 ? 'High' : '';
    document.getElementById('temperatureValue').textContent = temperatureText;
}

function selectConfig() {
    const temperature = document.getElementById('temperatureValue').textContent;
    const tokens = document.getElementById('tokensValue').textContent;
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelector('.hamburger').addEventListener('click', toggleNav);
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', toggleNav);
    });
    document.querySelectorAll('.nav-item a').forEach(link => {
        link.addEventListener('click', toggleNav);
    });
    document.querySelectorAll('.nav-item .toggle-switch input').forEach(input => {
        input.addEventListener('click', toggleNav);
    });
});

/* Global assignments */
window.sendMessage = sendMessage;
window.applyGreenColorScheme = applyGreenColorScheme;
window.addMessage = addMessage;
window.getBotResponse = getBotResponse;
window.toggleQRModal = toggleQRModal;
window.toggleLoginDropdownMobile = toggleLoginDropdownMobile;
window.updateTokensValue = updateTokensValue;
window.toggleNav = toggleNav;
window.closeLoginDropdownMobile = closeLoginDropdownMobile;
window.updateTemperatureValue = updateTemperatureValue;
window.selectConfig = selectConfig;
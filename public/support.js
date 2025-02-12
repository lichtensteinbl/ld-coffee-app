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

async function handleVariationOne() {
    console.log('Variation One button clicked');
    try {
        const response = await fetch('/api/sad-context', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(data.message);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function handleVariationTwo() {
    console.log('Variation Two button clicked');
    try {
        const response = await fetch('/api/happy-context', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(data.message);
    } catch (error) {
        console.error('Error:', error);
    }
}

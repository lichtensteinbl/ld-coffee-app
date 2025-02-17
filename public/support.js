const chatBox = document.getElementById('chatBox');
const chatInput = document.getElementById('chatInput');


// Access slider values
const temperatureSlider = document.getElementById('temperatureSlider');
const tokensSlider = document.getElementById('tokensSlider');

function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        addMessage('user', message);
        chatInput.value = '';
        getBotResponse(message);
    }
}

function applyGreenColorScheme() {
    const logo = document.querySelector('.nav-bar h1');
    const greenElements = document.querySelectorAll('.login-btn, .add-to-cart-btn, .cart-btn  cartButtonMobile, .cart-btn #cartCountMobile, .cart-btn #cartCountDesktop');
    //const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  
  
  
    if (logo) {
      logo.style.fontFamily = 'Pacifico, cursive';
      logo.style.color = '#006241'; // Green color
      logo.style.display = display = 'block';
      //addToCartButtons.style.color = '#0062410';
  
    }
  
    greenElements.forEach(element => {
      element.style.backgroundColor = '#006241'; // Red background
      element.style.color = '#fff'; // Ensure text is white
      logo.style.font = "24px Pacifico, cursive";
      logo.style.display = display = 'block';
    });
  }
  


client.on('ready', () => {
   
    coffeeBotResponse = client.variation('coffee-bot', context, false);
    console.log(coffeeBotResponse)
    () 
});

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
    applyGreenColorScheme()
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

// Toggle Login Dropdown Mobile
function toggleLoginDropdownMobile() {
    if (!currentUser) {
        signIn();
    } else {
        logout();
    }
    const dropdownMobile = document.getElementById("loginDropdownMobile")
    dropdownMobile.style.display = dropdownMobile.style.display === "block" ? "none" : "block"
}

// Close QR Modal when clicking outside of it
window.onclick = function(event) {
    const qrModal = document.getElementById('qrModal');
    if (event.target === qrModal) {
        qrModal.style.display = 'none';
    }
}

document.getElementById('selectConfig').addEventListener('click', async () => {
    const temperature = document.getElementById('temperatureValue').textContent.toLowerCase();
    const tokens = document.getElementById('tokensValue').textContent.toLowerCase();
    alert('Config Set')

    try {
        // Make the API call to your server-side endpoint
        const response = await fetch('/api/happy-context', {
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








const context = {
    kind: 'user',
    key: 'context-key-123abc',
    tier: "non-member"
};

const client = LDClient.initialize('64fb46764b5857122177a598', context);

let holidayDrinks = '';
let cartCount = 0;

function showHolidayDrinks() {
    console.log('showing drinks');
    const holidayText = document.getElementById('holiday-text');
    const holidayProducts = document.getElementById('holiday-products');
    
    if (!holidayDrinks) {
        holidayText.style.display = 'none';   
        holidayProducts.style.display = 'none';  
    } else {
        holidayText.style.display = 'block';
        holidayProducts.style.display = 'flex';  // Use 'flex' to maintain horizontal layout
    }
}

function getProducts() {
    fetch('/api/products')
        .then(response => response.json())
        .then(products => {
            const warmContainer = document.getElementById('warm-products');
            const coldContainer = document.getElementById('cold-products');
            const foodContainer = document.getElementById('food-products');
            const holidayContainer = document.getElementById('holiday-products');
            console.log(products);

            products.forEach(product => {
                const productElement = document.createElement('div');
                productElement.className = 'product';
                productElement.innerHTML = `
                    <h3>${product.name}</h3>
                    <p>$${product.price.toFixed(2)}</p>
                    <img src="${product.img}" alt="${product.name}">
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
                `;

                if (product.temp === 'hot') {
                    warmContainer.appendChild(productElement);
                }
                if (product.temp === 'cold') {
                    coldContainer.appendChild(productElement);
                }
                if (product.temp === 'holiday') {
                    holidayContainer.appendChild(productElement);
                }
                if (product.temp === 'food') {
                    foodContainer.appendChild(productElement);
                }
            });

            // Call the function to make images circular
            makeImagesCircular();
        });
}

function makeImagesCircular() {
    // Select all product images
    const productImages = document.querySelectorAll('.product img');

    // Loop through each image and apply circular styles
    productImages.forEach(img => {
        // Apply styles to make the image circular
        img.style.width = '150px'; // Set a fixed width
        img.style.height = '150px'; // Set a fixed height
        img.style.borderRadius = '50%'; // Make the image circular
        img.style.objectFit = 'cover'; // Ensure the image covers the circle without distortion
        img.style.display = 'block'; // Ensure the image is a block element
        img.style.margin = '0 auto'; // Center the image horizontally
    });
}

// Toggle Navigation Menu
function toggleNav() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('show');
}

// Toggle Login Dropdown
function toggleLoginDropdown() {
    const dropdown = document.getElementById('loginDropdown');
    dropdown.classList.toggle('show');
}

// Close Dropdown When Clicking Outside
window.onclick = function (event) {
    const dropdown = document.getElementById('loginDropdown');
    if (!event.target.matches('.login-btn') && !event.target.matches('.profile-btn') && !event.target.closest('.login-dropdown')) {
        dropdown.classList.remove('show');
    }
};

// Handle Form Submission
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById('username').value;

    // Accept any username for login
    if (username) {
        console.log(username + ' has logged in successfully');
        currentUser = username;
        updateUser(username);
        console.log(context);
        updateLoginUI();
        toggleLoginDropdown(); // Close dropdown after login
    } else {
        alert('Please enter a username');
    }
});

let currentUser = null;

function updateUser(username) {
    context.tier = 'member';
    context.name = username;
    client.identify(context, function () {
        console.log("New context's flags available");
        console.log(client.tier);
    });
}

// Logout Function
function logout() {
    currentUser = null;
    context.tier = 'non-member';
    delete context.name;
    client.identify(context, function () {
        console.log("Context reset to non-member");
    });
    updateLoginUI();
    console.log('user has logged out');
}

// Update Login/Logout UI
function updateLoginUI() {
    const loginButtonMobile = document.getElementById('loginButtonMobile');
    const loginButtonDesktop = document.getElementById('loginButtonDesktop');
    const loginDropdown = document.getElementById('loginDropdown');
    if (currentUser) {
        loginButtonMobile.innerHTML = `<i class="fas fa-user"></i> ${currentUser}`;
        loginButtonDesktop.innerHTML = `<i class="fas fa-user"></i> ${currentUser}`;
        loginDropdown.innerHTML = `
            <button onclick="logout()">Logout</button>
        `;
    } else {
        loginButtonMobile.innerHTML = `<i class="fas fa-user"></i> Sign In`;
        loginButtonDesktop.innerHTML = `<i class="fas fa-user"></i> Sign In`;
        loginDropdown.innerHTML = `
            <h3>Sign In</h3>
            <form id="loginForm">
                <div class="form-group">
                    <label for="username">Username:</label>
                    <input type="text" id="username" name="username" required>
                </div>
                <button type="submit">Sign In</button>
            </form>
        `;
    }
}

// Add to Cart Function
function addToCart(productId) {
    cartCount++;
    updateCartCount();
    console.log(`Product ${productId} added to cart. Total items: ${cartCount}`);
}

// Update Cart Count
function updateCartCount() {
    const cartCountMobile = document.getElementById('cartCountMobile');
    const cartCountDesktop = document.getElementById('cartCountDesktop');
    if (cartCountMobile) cartCountMobile.textContent = cartCount;
    if (cartCountDesktop) cartCountDesktop.textContent = cartCount;
}

client.on('ready', () => {
    holidayDrinks = client.variation('release-holiday-drinks', context, false);
    console.log('client is ready');
    console.log(holidayDrinks);
    getProducts();
    showHolidayDrinks();
});

client.on('change', () => {
    holidayDrinks = client.variation('release-holiday-drinks', context, false);
    console.log(holidayDrinks);
    console.log('flag has changed');
    showHolidayDrinks();
});
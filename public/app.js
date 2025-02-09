const context = {
    kind: 'user',
    key: 'userabc',
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
        holidayProducts.style.display = 'flex';  
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

            products.forEach(product => {
                const productElement = document.createElement('div');
                productElement.className = 'product';
                productElement.innerHTML = `
                    <h3>${product.name}</h3>
                    <p>$${product.price.toFixed(2)}</p>
                    <img src="${product.img}" alt="${product.name}">
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add To Order</button>
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
            if (circleLogos !== 'Rectangle'){
                makeImagesCircular();
            } 
        });
}

function makeImagesCircular() {
    // Select all product images
    const productImages = document.querySelectorAll('.product img');

    // Loop through each image and apply circular styles
    productImages.forEach(img => {
        // Apply styles to make the image circular
        img.style.width = '250px'; // Set a fixed width
        img.style.height = '250px'; // Set a fixed height
        img.style.borderRadius = '50%'; // Make the image circular
        img.style.objectFit = 'cover'; // Ensure the image covers the circle without distortion
        img.style.display = 'block'; // Ensure the image is a block element
        img.style.margin = '0 auto'; // Center the image horizontally
    });
}

function makeImagesRectangle() {
    // Select all product images
    const productImages = document.querySelectorAll('.product img');

    // Loop through each image and remove circular styles
    productImages.forEach(img => {
        // Remove styles to revert the image back to rectangle
        img.style.width = ''; // Remove fixed width
        img.style.height = ''; // Remove fixed height
        img.style.borderRadius = ''; // Remove circular border radius
        img.style.objectFit = ''; // Remove object fit
        img.style.display = ''; // Remove block display
        img.style.margin = ''; // Remove horizontal centering
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
    context.name = 'userabc';
    client.identify(context, function () {
        console.log("Context reset to non-member");
        console.log(context)
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
    fetch('/api/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: productId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Item added to cart') {
            cart = data.cart;
            updateCartCount();
            updateCartUI();
            console.log(`Product ${productId} added to cart. Total items: ${cart.length}`);
        } else {
            console.error('Failed to add item to cart');
        }
    })
    .catch(error => console.error('Error:', error));
}

// Toggle Cart Dropdown
function toggleCartDropdown() {
    const cartDropdown = document.getElementById('cartDropdown');
    cartDropdown.classList.toggle('show');
}

// Update Cart UI
function updateCartUI() {
    const cartItemsContainer = document.getElementById('cartItems');
    const totalPriceElement = document.getElementById('totalPrice');
    cartItemsContainer.innerHTML = '';
    let totalPrice = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div>
                <span>${item.name}</span>
                <p>$${item.price.toFixed(2)}</p>
            </div>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItemsContainer.appendChild(cartItemElement);
        totalPrice += item.price;
    });

    totalPriceElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
}

// Remove from Cart Function
function removeFromCart(productId) {
    fetch(`/api/cart/${productId}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            cart = data.cart;
            updateCartUI();
            updateCartCount();
        });
}

// Checkout Function
function checkout() {
    fetch('/api/checkout', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            cart = [];
            updateCartUI();
            updateCartCount();
        });
}

// Update Cart Count
function updateCartCount() {
    const cartCountMobile = document.getElementById('cartCountMobile');
    const cartCountDesktop = document.getElementById('cartCountDesktop');
    const cartCount = cart.length;
    if (cartCountMobile) cartCountMobile.textContent = cartCount;
    if (cartCountDesktop) cartCountDesktop.textContent = cartCount;
    updateCartUI();
}

// Fetch Cart from Server
function fetchCart() {
    fetch('/api/cart')
        .then(response => response.json())
        .then(data => {
            cart = data.cart;
            updateCartCount();
            updateCartUI();
        })
        .catch(error => console.error('Error:', error));
}

client.on('ready', () => {
    holidayDrinks = client.variation('release-holiday-drinks', context, false);
    membershipRewards = client.variation('membership-rewards', context, false);
    circleLogos = client.variation('circular-logos', context, false);
    console.log('circle logos is ' + circleLogos);
    console.log('client is ready');
    console.log(holidayDrinks);
    getProducts();
    showHolidayDrinks();
    checkmember();
    fetchCart(); // Fetch cart when client is ready
});

client.on('change', () => {
    holidayDrinks = client.variation('release-holiday-drinks', context, false);
    membershipRewards = client.variation('membership-rewards', context, false);
    circleLogos = client.variation('circular-logos', context, false);
    console.log(holidayDrinks);
    console.log('flag has changed');
    if (circleLogos === 'Treatment 1') {
        makeImagesCircular();
    } else {
        makeImagesRectangle();
    }
    showHolidayDrinks();
    checkmember();
});


function checkmember() {
    const rewardsBanner = document.getElementById('rewardsBanner');
    if (membershipRewards) {
        rewardsBanner.style.display = 'block';
        rewardsBanner.innerHTML = `
            Congrats ${context.name}! You have 800 LaunchBucks! 🚀
            <button onclick="redeemRewards()">Redeem</button>
        `;
        console.log('youre a member');
    } else {
        rewardsBanner.style.display = 'none';
    }
}

function redeemRewards() {
    alert('Rewards redeemed!');
    // Add any additional logic for redeeming rewards here
}

// Add event listener to the cart button
document.getElementById('cartButtonDesktop').addEventListener('click', toggleCartDropdown);

/*/ Add event listener to the "Add to Cart" button
document.getElementById('id="cartButtonDesktop').addEventListener('click', () => {
    // Track the event in LaunchDarkly
    ldClient.track('add-to-cart-clicked', { key: context.key }, 1);

    // Optional: Log to console for debugging
    console.log('Add to Cart button clicked', context.key);
});*/




let context = {
    type: 'user',
    key: 'abcd',
    tier: 'non-member'
};

let circleFlag; // Define circleFlag at the top

function generateRandomKey() {
    let randomKey = '';
    const characters = 'ABCDI';
    for (let i = 0; i < characters.length; i++) {
        randomKey += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    context.key = randomKey;
    console.log(context.key)
}

generateRandomKey();



const client = LDClient.initialize('64fb46764b5857122177a598', context);

let holidayDrinks = '';
let cartCount = 0;
let cart = [];
let badAPI;

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

const brokenURL = 'https://globalassets.starbucks.com/djpg?impolicy=1by1_wide_topcrop_630';

function createImageErrors() {
    if (badAPI && context.key.length > 6) {
        const coldContainer = document.getElementById('cold-products');
        const images = coldContainer.getElementsByTagName('img');
        for (let img of images) {
            console.log('why is this working?');
            img.src = brokenURL;
        }
    }
}

function sendErrors() {
    for (let i = 0; i < 20; i++) {
        console.log('im sending errors');
        client.track('test-key', context);
        if (badAPI) {
            break;
        }
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
                //if (product.temp === 'cold' && badAPI && context.key.length > 6) {
                    //sendErrors();
                  //  product.img = brokenURL;
                //}
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
                    product.img = 'asdfas.com';
                   // console.log('product img = ' + product.img);
                    holidayContainer.appendChild(productElement);
                }
                if (product.temp === 'food') {
                    foodContainer.appendChild(productElement);
                }
            });
            imageShape();

        });

}



//used for experimentation to measure conversation rate
function makeImagesCircular() {
    const productImages = document.querySelectorAll('.product img');

    productImages.forEach(img => {
        img.style.width = '250px';
        img.style.height = '250px';
        img.style.borderRadius = '50%';
        img.style.objectFit = 'cover';
        img.style.display = 'block';
        img.style.margin = '0 auto';
    });
}

//used for experimentation to measure conversation rate
function makeImagesRectangle() {
    const productImages = document.querySelectorAll('.product img');

    productImages.forEach(img => {
        img.style.width = '';
        img.style.height = '';
        img.style.borderRadius = '';
        img.style.objectFit = '';
        img.style.display = '';
        img.style.margin = '';
    });
}

//Toggle Navigation Menu
function toggleNav() {
    const navLinks = document.getElementById('navLinks');
    const rewardsBanner = document.getElementById('rewardsBanner');
    navLinks.classList.toggle('show');
    if (window.innerWidth <= 768) {
        rewardsBanner.style.display = navLinks.classList.contains('show') ? 'none' : 'block';
    }
}

// Toggle Login Dropdown
function toggleLoginDropdown() {
    const dropdown = document.getElementById('loginDropdown');
    dropdown.classList.toggle('show');
}

// Toggle Mobile Login Dropdown
function toggleLoginDropdownMobile() {
    const dropdownMobile = document.getElementById('loginDropdownMobile');
    dropdownMobile.style.display = dropdownMobile.style.display === 'block' ? 'none' : 'block';
}

// Toggle QR Code Modal
function toggleQRModal() {
    const qrModal = document.getElementById('qrModal');
    qrModal.style.display = qrModal.style.display === 'block' ? 'none' : 'block';
}

// Close QR Modal when clicking outside of it
window.onclick = function (event) {
    const qrModal = document.getElementById('qrModal');
    const dropdown = document.getElementById('loginDropdown');
    if (event.target === qrModal) {
        qrModal.style.display = 'none';
    }
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
        localStorage.setItem('currentUser', username); // Save username to localStorage
        checkmember()
        updateUser(username);
        if (username.length > 5) {
            createImageErrors();
        }

        console.log(context);
        updateLoginUI();
        toggleLoginDropdown(); // Close dropdown after login
    } else {
        alert('Please enter a username');
    }
});

// Handle Mobile Form Submission
document.getElementById('loginFormMobile').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById('usernameMobile').value;

    // Accept any username for login
    if (username) {
        console.log(username + ' has logged in successfully');
        currentUser = username;
        localStorage.setItem('currentUser', username); // Save username to localStorage

        updateUser(username);
        if (username.length > 5) {
            createImageErrors();
        }

        console.log(context);
        updateLoginUI();
        toggleLoginDropdownMobile(); // Close dropdown after login
    } else {
        alert('Please enter a username');
    }
});

// Check if user is already logged in on page load
window.onload = function () {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = savedUser;
        updateUser(savedUser);
        updateLoginUI();
    }

    fetch('/api/reset-cart')
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            cart = [];
            updateCartCount();
        })
        .catch(error => console.error('Error:', error));
};

let currentUser = null;

function updateUser(username) {
    context.tier = 'member';
    context.key = username;
    client.identify(context, function () {
        console.log("New context's flags available");
        console.log(client.tier);
        getProducts();
    });
}

// Logout Function
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser'); // Remove username from localStorage
    context.tier = 'non-member';
    context.key = 'asdfa';
    client.identify(context, function () {
        console.log("Context reset to non-member");
        console.log(context);
    });
    window.location.href = 'https://coffee-shop-bl-149d4d87ac05.herokuapp.com/';
    updateLoginUI();
    console.log('user has logged out');
}

// Update Login/Logout UI
function updateLoginUI() {
    const loginButtonMobile = document.getElementById('loginButtonMobile');
    const loginButtonDesktop = document.getElementById('loginButtonDesktop');
    const loginDropdown = document.getElementById('loginDropdown');
    const loginDropdownMobile = document.getElementById('loginDropdownMobile');
    if (currentUser) {
        loginButtonMobile.innerHTML = `<i class="fas fa-user"></i> ${currentUser}`;
        loginButtonDesktop.innerHTML = `<i class="fas fa-user"></i> ${currentUser}`;
        loginDropdown.innerHTML = `
            <button onclick="logout()">Logout</button>
        `;
        loginDropdownMobile.innerHTML = `
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
        loginDropdownMobile.innerHTML = `
            <h3>Sign In</h3>
            <form id="loginFormMobile">
                <div class="form-group">
                    <label for="usernameMobile">Username:</label>
                    <input type="text" id="usernameMobile" name="username" required>
                </div>
                <button type="submit">Sign In</button>
            </form>
        `;
    }
}

// Add to Cart Function
function addToCart(productId) {
    //client.track('add_to_cart', context);
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
            } else {
                console.error('Failed to add item to cart');
            }
        })
        .catch(error => console.error('Error:', error));
}


function imageShape(){
    if(circleFlag == 'Circle'){
        console.log('function says ' + circleFlag)
        makeImagesCircular();
}else {
    makeImagesRectangle();
}
}

// Update Cart Count
function updateCartCount() {
    const cartCountMobile = document.getElementById('cartCountMobile');
    const cartCountDesktop = document.getElementById('cartCountDesktop');
    const cartCount = cart.length;
    if (cartCountMobile) cartCountMobile.textContent = cartCount;
    if (cartCountDesktop) cartCountDesktop.textContent = cartCount;
}

// Fetch Cart from Server
/*function fetchCart() {
    fetch('/api/cart')
        .then(response => response.json())
        .then(data => {
            cart = data.cart;
            updateCartCount();
            updateCartUI();
        })
        .catch(error => console.error('Error:', error));
}*/

// Reset Cart on Page Reload
window.onload = function () {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = savedUser;
        updateUser(savedUser);
        updateLoginUI();
    }

    fetch('/api/reset-cart')
        .then(response => response.json())
        .then(data => {
            cart = [];
            updateCartCount();
        })
        .catch(error => console.error('Error:', error));
};

client.on('ready', () => {
    holidayDrinks = client.variation('release-holiday-drinks', context, false);
    membershipRewards = client.variation('membership-rewards', context, false);
    console.log('member rewards = ' + membershipRewards)
    circleFlag = client.variation('circular-logos', context, false);
    console.log('circle = ' + circleFlag);
    badAPI = client.variation('release-new-product-api', context, false);
    console.log('badAPI is ' + badAPI);

    console.log('client is ready');

    console.log(holidayDrinks);
    

    getProducts();
    showHolidayDrinks();
    checkmember();
    createImageErrors();
    
    //fetchCart(); 
});

client.on('change', () => {
    holidayDrinks = client.variation('release-holiday-drinks', context, false);
    membershipRewards = client.variation('membership-rewards', context, false);
    circleFlag = client.variation('circular-logos', context, false);
    badAPI = client.variation('release-new-product-api', context, false);
    console.log('membership rewards is ' + membershipRewards)
    console.log('badAPI is ' + badAPI);
    console.log('holiday drinks is ' + holidayDrinks);
    console.log('flag has changed');

    getProducts();
    showHolidayDrinks();
    checkmember();
    imageShape();

});

function checkmember() {
    const rewardsBanner = document.getElementById('rewardsBanner');
    if (membershipRewards) {
        rewardsBanner.style.display = 'none';
        rewardsBanner.innerHTML = `
            Congrats ${context.key}! You have 800 LaunchBucks! 🚀
            <button onclick="redeemRewards()">Redeem</button>
        `;
        console.log('youre a member');
    } else {
        rewardsBanner.style.display = 'none';
    }
}

function redeemRewards() {
    alert('Rewards redeemed!');
}

let context = {
    type: 'user',
    key: 'abcd',
    tier: 'non-member'
};



let circleFlag; // Define circleFlag at the top

function showRewardsBanner (){
    document.getElementById('rewards-sections').style.display = 'block';
}
function generateRandomKey() {
    let randomKey = '';
    const characters = 'ABCDI';
    for (let i = 0; i < characters.length; i++) {
        randomKey += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    context.key = randomKey;
    console.log(context.key);
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

function showHolidayAnimation() {
    console.log('showing drinks with animation');
    const holidayText = document.getElementById('holiday-text');
    const holidayProducts = document.getElementById('holiday-products');

    if (!holidayDrinks) {
        holidayText.style.display = 'none';
        holidayProducts.style.display = 'none';
    } else {
        holidayText.style.display = 'block';
        holidayProducts.style.display = 'flex';
        // Add fade-in animation
        holidayText.classList.add('fade-in');
        holidayProducts.classList.add('fade-in');
        setTimeout(() => {
            holidayText.classList.remove('fade-in');
            holidayProducts.classList.remove('fade-in');
        }, 1000); // Duration of the animation
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

function getProducts(products) {
    //<p>$${product.price.toFixed(2)}</p>

    const warmContainer = document.getElementById('warm-products');
    const coldContainer = document.getElementById('cold-products');
    const foodContainer = document.getElementById('food-products');
    const holidayContainer = document.getElementById('holiday-products');

    products.forEach(product => {
        if (product.temp === 'cold' && badAPI && context.key.length > 6) {
            sendErrors();
            product.img = brokenURL;
        }
        const productElement = document.createElement('div');
        productElement.className = 'product';
        productElement.innerHTML = `
            <h3>${product.name}</h3>
            <img src="${product.img}" alt="${product.name}">
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add To Order</button>
        `;
        makeImagesCircular();
        if (product.temp === 'hot') {
            warmContainer.appendChild(productElement);
        }
        if (product.temp === 'cold') {
            coldContainer.appendChild(productElement);
        }
        if (product.temp === 'holiday') {
            product.img = 'asdfas.com';
            holidayContainer.appendChild(productElement);
        }
        if (product.temp === 'food') {
            foodContainer.appendChild(productElement);
        }
    });
    imageShape();
}

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

function toggleNav() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('show');
}

function toggleLoginDropdown() {
    const dropdown = document.getElementById('loginDropdown');
    dropdown.classList.toggle('show');
}

function toggleLoginDropdownMobile() {
    const dropdownMobile = document.getElementById('loginDropdownMobile');
    dropdownMobile.style.display = dropdownMobile.style.display === 'block' ? 'none' : 'block';
}

function toggleQRModal() {
    const qrModal = document.getElementById('qrModal');
    qrModal.style.display = qrModal.style.display === 'block' ? 'none' : 'block';
}

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
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission

        const username = document.getElementById('username').value;

        // Accept any username for login
        if (username) {
            console.log(username + ' has logged in successfully');
            currentUser = username;
            localStorage.setItem('currentUser', username); // Save username to localStorage
            //checkmember();
            updateUser(username);
            if (username.length > 5) {
                createImageErrors();
            }
            console.log(context);
            updateLoginUI();

            if(membershipRewards){
                showRewardsBanner();
            }

            

            toggleLoginDropdown(); // Close dropdown after login
        } else {
            alert('Please enter a username');
        }
    });
}

// Handle Mobile Form Submission
const loginFormMobile = document.getElementById('loginFormMobile');
if (loginFormMobile) {
    loginFormMobile.addEventListener('submit', function (event) {
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
}

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
        console.log(context.tier);
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
    window.location.href = 'https://coffee-shop-bl-149d4d87ac05.herokuapp.com';
    updateLoginUI();
    console.log('user has logged out');
document.getElementById('rewards-section').style.display = 'none'
document.getElementById('rewards-section').style.display = 'none'
document.getElementById('rewards-section').style.display = 'none'
 
    //checkmember();
}

// Update Login/Logout UI
function updateLoginUI() {

    const loginButtonMobile = document.getElementById('loginButtonMobile');
    const loginButtonDesktop = document.getElementById('loginButtonDesktop');
    const  Dropdown = document.getElementById('loginDropdown');
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
            } else {
                console.error('Failed to add item to cart');
            }
        })
        .catch(error => console.error('Error:', error));
}

let holidayAlreadyOn = false;

function imageShape() {
    if (circleFlag == 'Circle') {
        console.log('function says ' + circleFlag);
        makeImagesCircular();
    } else {
        makeImagesRectangle();
    }
}

function updateCartCount() {
    const cartCountMobile = document.getElementById('cartCountMobile');
    const cartCountDesktop = document.getElementById('cartCountDesktop');
    const cartCount = cart.length;
    if (cartCountMobile) cartCountMobile.textContent = cartCount;
    if (cartCountDesktop) cartCountDesktop.textContent = cartCount;
}

client.on('ready', () => {
    
    holidayDrinks = client.variation('release-holiday-drinks', context, false);
    membershipRewards = client.variation('membership-rewards', context, false);
    console.log('member rewards = ' + membershipRewards);
    circleFlag = client.variation('circular-logos', context, false);
   console.log('circle = ' + circleFlag);
        badAPI = client.variation('release-new-product-api', context, false);
    console.log('badAPI is ' + badAPI);

    console.log('client is ready');

    console.log(holidayDrinks);
    if (holidayDrinks) {
        holidayAlreadyOn = true;
    }

    getProducts(menu);
    showHolidayDrinks();
    checkmember();
    createImageErrors();
    });


client.on('change', () => {
    holidayDrinks = client.variation('release-holiday-drinks', context, false);
    membershipRewards = client.variation('membership-rewards', context, false);
    circleFlag = client.variation('circular-logos', context, false);
    badAPI = client.variation('release-new-product-api', context, false);
    console.log('membership rewards is ' + membershipRewards);
    console.log('badAPI is ' + badAPI);
    console.log('holiday drinks is ' + holidayDrinks);
    console.log('flag has changed');
    if (!holidayDrinks) {
        holidayAlreadyOn = false;
    }

    getProducts(menu);
    console.log('holidayAlreadyOn is ' + holidayAlreadyOn);
    if (holidayAlreadyOn) {
        showHolidayDrinks();
    } else {
        showHolidayAnimation();
    }

    checkmember();
    imageShape();
});

function checkmember() {
    // Membership check logic
}

const menu = [
    { id: 10, temp: 'holiday', name: 'Chestnut Praline Latte', price: 3.50, img: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190716_ChestnutPralineCreme.jpg?impolicy=1by1_wide_topcrop_630' },
    { id: 11, temp: 'holiday', name: 'Peppermint Mocha', price: 2.50, img: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20230612_4613_PeppermintMochaFrappuccino-onGreen-MOP_1800.jpg?impolicy=1by1_wide_topcrop_630' },
    { id: 12, temp: 'holiday', name: 'Caramel Brulee Latte', price: 3.00, img: "https://globalassets.starbucks.com/digitalassets/products/bev/CaramelBruleeFrappuccino.jpg?impolicy=1by1_wide_topcrop_630" },
    { id: 13, temp: 'holiday', name: 'Gingerbread Chai', price: 2.00, img: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20230612_7785_IcedPeppermintMocha-onGreen-MOP_1800.jpg?impolicy=1by1_wide_topcrop_630' },
    { id: 1, temp: 'hot', name: 'Espresso', price: 2.50, img: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190617_Espresso_Single.jpg?impolicy=1by1_wide_topcrop_630' },
    { id: 2, temp: 'hot', name: 'Cappuccino', price: 3.00, img: "https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190617_Cappuccino.jpg?impolicy=1by1_wide_topcrop_630" },
    { id: 3, temp: 'hot', name: 'Latte', price: 3.50, img: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190617_CaffeLatte.jpg?impolicy=1by1_wide_topcrop_630' },
    { id: 4, temp: 'hot', name: 'Americano', price: 2.00, img: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190617_CaffeAmericano.jpg?impolicy=1by1_wide_topcrop_630' },
    { id: 5, temp: 'cold', name: 'Iced Coffee', price: 2.50, img: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190422_IcedVanillaLatte.jpg?impolicy=1by1_wide_topcrop_630' },
    { id: 6, temp: 'cold', name: 'Matcha Latte', price: 3.00, img: "https://globalassets.starbucks.com/digitalassets/products/bev/SBX20181127_IcedMatchaGreenTeaLatte.jpg?impolicy=1by1_wide_topcrop_630" },
    { id: 8, temp: 'cold', name: 'Berry Refresher', price: 2.00, img: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20221206_MangoDragonfruitRefreshers.jpg?impolicy=1by1_wide_topcrop_630' },
    { id: 9, temp: 'cold', name: 'Iced Tea', price: 2.00, img: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190531_IcedBlackTea.jpg?impolicy=1by1_wide_topcrop_630' },
    { id: 14, temp: 'food', name: 'Bacon, Sausage & Egg Wrap', price: 3.50, img: 'https://globalassets.starbucks.com/digitalassets/products/food/SBX20191018_BaconSausageCageFreeEggWrap.jpg?impolicy=1by1_medium_630' },
    { id: 15, temp: 'food', name: 'Butter Croissant ', price: 2.50, img: 'https://globalassets.starbucks.com/digitalassets/products/food/SBX20210915_Croissant-onGreen.jpg?impolicy=1by1_medium_630' },
    { id: 16, temp: 'food', name: 'Blueberry Scone', price: 3.00, img: "https://globalassets.starbucks.com/digitalassets/products/food/SBX20181219_BlueberryScone.jpg?impolicy=1by1_medium_630" },
    { id: 17, temp: 'food', name: 'Coffee Cake', price: 3.00, img: "https://globalassets.starbucks.com/digitalassets/products/food/SBX20180511_ClassicCoffeeCake.jpg?impolicy=1by1_medium_630" },
];




//turn on experimentation flag

document.getElementById('experimentFlag').addEventListener('click', async () => {


    try {
        // Make the API call to your server-side endpoint
        const response = await fetch('/api/toggle-experimentation-flag', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                projectKey: 'brian-l-demo-project',
                featureFlagKey: 'circular-logos',
                value: true, // Use the toggled value
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to toggle feature flag');
        }

        console.log('this is the new flag val =' + newFlagVal)

        const data = await response.json();
        console.log(`Success: ${data.message}`);
        imageShape(); // Update the image shape based on the new flag value
    } catch (error) {
        console.log(`Error: ${error.message}`);
        document.getElementById('statusMessage').textContent = `Error: ${error.message}`;
    }
});


document.getElementById('experimentFlagOff').addEventListener('click', async () => {

    try {
        // Make the API call to your server-side endpoint
        const response = await fetch('/api/toggle-experimentation-flag', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                projectKey: 'brian-l-demo-project',
                featureFlagKey: 'circular-logos',
                value: false, // Use the toggled value
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to toggle feature flag');
        }

        console.log('this is the new flag val =' + newFlagVal)

        const data = await response.json();
        console.log(`Success: ${data.message}`);
        imageShape(); // Update the image shape based on the new flag value
    } catch (error) {
        console.log(`Error: ${error.message}`);
        document.getElementById('statusMessage').textContent = `Error: ${error.message}`;
    }
});




document.getElementById('bad-api-flag').addEventListener('click', async () => {
    const newFlagVal = !badAPI


    try {
        // Make the API call to your server-side endpoint
        const response = await fetch('/api/toggle-bad-api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                projectKey: 'brian-l-demo-project',
                featureFlagKey: 'release-new-product-api',
                value: newFlagVal, // Use the toggled value
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to toggle feature flag');
        }

        
        if(newFlagVal){
            alert('API Flag Is On')
        }
        else {alert('API Flag Is Off')}

        console.log('this is the new flag val =' + newFlagVal)

        const data = await response.json();
        console.log(`Success: ${data.message}`);
        imageShape(); // Update the image shape based on the new flag value
    } catch (error) {
        console.log(`Error: ${error.message}`);
        document.getElementById('statusMessage').textContent = `Error: ${error.message}`;
    }
});

function addEventListenersToDots() {
    // Remove all the dot event listener logic
}

function updateTokensValue(checked) {
    const tokensText = checked ? 'Spanish' : 'English';
    document.getElementById('tokensValue').textContent = tokensText;
}



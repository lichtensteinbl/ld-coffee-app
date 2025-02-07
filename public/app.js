
document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/products')
        .then(response => response.json())
        .then(products => {

            const warmContainer = document.getElementById('warm-products');
            const coldContainer = document.getElementById('cold-products');
            const holidayContainer = document.getElementById('holiday-products');
            const foodContainer = document.getElementById('food-products');
            console.log(products)
            products.forEach(product => {
           
                const productElement = document.createElement('div');
                
                productElement.className = 'product';
                productElement.innerHTML = `
                
                    <h3>${product.name}</h3>
                    <p>$${product.price.toFixed(2)}</p>
                    <h4><img src=${product.img} alt="Coffee Cup" class="round-image" </h3>
                    <h5><button onclick="addToCart(${product.id})">Add to Cart</button><h4>
                `;
                if(product.temp === 'hot'){
                warmContainer.appendChild(productElement);
                }
                else if (product.temp === 'cold'){
                coldContainer.appendChild(productElement);
                }
                else if (product.temp === 'holiday'){
                holidayContainer.appendChild(productElement);  
                }
                else if (product.temp === 'food'){
                    foodContainer.appendChild(productElement);  
                    }
            }); 
        });

});


const context = {
    kind: 'user',
    key: 'context-key-123abc',
    tier: "non-member"

  };

  const client = LDClient.initialize('64fb46764b5857122177a598', context);

  console.log(context)

const rewardsFlag = client.variation('membership-rewards', false);
console.log('hey' + rewardsFlag)

//if button is clicked, context user = member



// app.js
// Toggle Login Dropdown
function toggleLoginDropdown() {
    const dropdown = document.getElementById('loginDropdown');
    dropdown.classList.toggle('show');
}

// Close Dropdown When Clicking Outside
window.onclick = function (event) {
    const dropdown = document.getElementById('loginDropdown');
    if (!event.target.matches('.login-btn') && !event.target.closest('.login-dropdown')) {
        dropdown.classList.remove('show');
    }
};

// Handle Form Submission
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Perform login validation (example)
    if (username === 'user' && password === 'password') {
        alert('Login successful!');
        toggleLoginDropdown(); // Close dropdown after login
    } else {
        alert('Invalid username or password');
    }
});

let currentUser = null;

// Toggle Login Dropdown
function toggleLoginDropdown() {
    const dropdown = document.getElementById('loginDropdown');
    dropdown.classList.toggle('show');
}


function updateUser(username){
    context.tier = 'member';
    context.name = username;
    client.identify(context, function () {
        console.log("New context's flags available");
        console.log(client.tier);
    });
    
}

// Handle Login Form Submission
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById('username').value;
    if (username) {
        console.log(username + ' has logged in successfully')
        updateUser(username)
        console.log(context)
        updateLoginUI();
        toggleLoginDropdown(); // Close dropdown after login
    }
   

});

// Logout Function
function logout() {
    currentUser = null;
    updateLoginUI();

    console.log('user has logged out')
    console.log(newContext)
    
}

// Update Login/Logout UI
function updateLoginUI() {
    const loginButton = document.getElementById('loginButton');
    if (currentUser) {
        loginButton.innerHTML = `<i class="fas fa-user"></i> ${currentUser} (Logout)`;
        loginButton.onclick = logout;
        loginButton.classList.remove('login-btn');
        loginButton.classList.add('logout-btn');
    } else {
        loginButton.innerHTML = `<i class="fas fa-user"></i> Login`;
        loginButton.onclick = toggleLoginDropdown;
        loginButton.classList.remove('logout-btn');
        loginButton.classList.add('login-btn');
    }
}
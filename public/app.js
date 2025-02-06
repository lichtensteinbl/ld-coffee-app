
document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/products')
        .then(response => response.json())
        .then(products => {

            const warmContainer = document.getElementById('warm-products');
            const coldContainer = document.getElementById('cold-products');
            const holidayContainer = document.getElementById('holiday-products');
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
                else {
                holidayContainer.appendChild(productElement);  
                }
            }); 
        });

    updateCart();
});


const context = {
    kind: 'user',
    key: 'context-key-123abc',
    language: 'spanish'

  };

  const client = LDClient.initialize('64fb46764b5857122177a598', context);

//string flag

  client.on('ready', () => {
    console.log('ready')
    // initialization succeeded, flag values are now available
    const flagValue = client.variationDetail('home-page-banner', false);
    console.log(flagValue)
    console.log (flagValue.reason)

//numeric flag
    const price = client.variation('price-for-coffee', false);
    console.log('price is ' + price);

  });


function addToCart(productId) {
    fetch('/api/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            updateCart();
        } else {
            alert('Failed to add product to cart');
        }
    });
}

//if button is clicked, context user = member


function updateCart() {
    fetch('/api/cart')
        .then(response => response.json())
        .then(cart => {
            const cartContainer = document.getElementById('cart');
            cartContainer.innerHTML = '<h2>Cart</h2>';
            if (cart.length === 0) {
                cartContainer.innerHTML += '<p>Your cart is empty.</p>';
            } else {
                cart.forEach(item => {
                    const cartItem = document.createElement('div');
                    cartItem.className = 'product';
                    cartItem.innerHTML = `
                        <h3>${item.name}</h3>
                        <p>$${item.price.toFixed(2)}</p>
                    `;
                    cartContainer.appendChild(cartItem);
                });
            }
        });
}

console.log(cart);

document.getElementById('find-store').addEventListener("click", ()=>{
    console.log('you have logged in')
    document.getElementById('welcome').innerHTML = 'You have 8000 rewards points available'
})


document.getElementById('clear-cart').addEventListener("click", ()=>{
    cart.innerHTML = '';
})



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
import { initialize } from 'launchdarkly-js-client-sdk';

const clientSideKey = "67bab894bffb5f0c01b78239"
const APIFlagKey = "release-new-api";
const membershipFlagKey = "release-member-rewards";
const experimentFlagKey = "release-branding-change";
const bannerFlagKey = "release-banner"
const projectKey = "coffee-app";


const context = {
  kind: "user",
  key: "placeholder",
  tier: "non-member",
}

let currentUser = null
let heroBanner;
let branding; 
const storedImg = []
let holidayDrinks;
let badAPI; 
let membershipRewards;

function videoSeek() {
  let currentPos = jwplayer().getPosition();
  if (currentPos > 25) {
    jwplayer().seek(1)
  }
}

document.querySelector('.nav-bar h1').addEventListener("click", function () {
  window.location.reload();
})

document.addEventListener("DOMContentLoaded", function () {
  const elements = document.querySelectorAll('.login-btn, .nav-bar h1, .add-to-cart-btn, .cart-btn:not(#cartButtonMobile), .cart-btn #cartCountMobile, .cart-btn #cartCountDesktop');
  elements.forEach(element => {
    document.querySelector('.nav-bar h1').display = 'none';
  });

  const element = document.querySelector('.hamburger');
  if (element) {
    element.addEventListener('click', toggleNav);
  }
  // Repeat such guards for other selectors used below.
  const hamburger = document.querySelector('.hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', toggleNav);
  }
  // Guard other element selections:
  //const someElement = document.querySelector('.some-other-selector');
  //if (someElement) {
    // Attach events...
  //}
  const experimentSwitch = document.getElementById("experiment-switch");
  if (experimentSwitch) {
    experimentSwitch.checked = (branding === "Red");
  }
});


function showRewardsBanner() {
  if (membershipRewards === "true") {
    document.getElementById("rewards-sections").style.display = "block"
  } else {
    document.getElementById("rewards-sections").style.display = "none"
  }
}

function generateRandomKey() {
   context.key =  Math.floor(Math.random() * (1000 - 100 + 1))
}

generateRandomKey()
console.log(context);

const client = initialize(clientSideKey, context);
window.client = client; // Expose client globally


const brokenURL = "https://globalassets.starbucks.com/djpg?impolicy=1by1_wide_topcrop_630"

function createImageErrors() {
  if (badAPI) {
    const holidayContainer = document.getElementById("holiday-products")
    const images = holidayContainer.getElementsByTagName("img")
    let counter = 0;
    for (const img of images) {
      storedImg.push(img.src)
      img.src = brokenURL
    }
    setTimeout(() => {
      for (const img of images) {
        img.src = storedImg[counter]
        counter++;
      }
      callBadApi();
    }, 10000)
  

  }
  
}

function getProducts(products) {
  //<p>$${product.price.toFixed(2)}</p>

  const warmContainer = document.getElementById("warm-products")
  const coldContainer = document.getElementById("cold-products")
  const foodContainer = document.getElementById("food-products")
  const holidayContainer = document.getElementById("holiday-products")

  products.forEach((product) => {
    if(branding === "Red") {
      product.img = product.img2;
    } else {
      product.img = product.img}
      
    const productElement = document.createElement("div")
    productElement.className = "product"
    productElement.innerHTML = `
            <h3>${product.name}</h3>
            <div class="img-wrapper">
                <img src="${product.img}" alt="${product.name}">
            </div>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add To Order</button>
        `

    if (product.temp === "hot") {
      warmContainer.appendChild(productElement)
    }
    if (product.temp === "cold") {
      coldContainer.appendChild(productElement)

    }
    if (product.temp === "holiday") {
      holidayContainer.appendChild(productElement)
    }
    if (product.temp === "food") {
      foodContainer.appendChild(productElement)
    }

    if (branding == "Red") {
      applyColorScheme(redScheme);
    }
    else {
      applyColorScheme(greenScheme);
      makeImagesCircular()
    }
  })
}

function makeImagesCircular() {
  const productImages = document.querySelectorAll(".product img")
  productImages.forEach((img) => {
    img.style.width = "250px"
    img.style.height = "250px"
    img.style.borderRadius = "0%"
    img.style.objectFit = "cover"; /* Ensure the image covers the area */
    img.style.objectPosition = "center"; /* Zoom in by focusing on the center */
    img.style.overflow = "hidden";
    img.style.display = "block"
    img.style.margin = "0 auto"
  })
}


function toggleNav(event) {
  if (event) {
    event.stopPropagation(); // Only stop propagation if the event exists
  }
  const navLinks = document.getElementById("navLinks")
  navLinks.classList.toggle("show")
}
window.toggleNav = toggleNav;

function toggleLoginDropdown() {
  if (!currentUser) {
    signIn();
  } else {
    logout();
  }
}

function toggleLoginDropdownMobile() {
  if (!currentUser) {
    signIn();
  } else {
    logout();
  }
  const dropdownMobile = document.getElementById("loginDropdownMobile");
  dropdownMobile.style.display = dropdownMobile.style.display === "block" ? "none" : "block";
}
window.toggleLoginDropdownMobile = toggleLoginDropdownMobile; // Expose function globally

function toggleQRModal() {
  const qrModal = document.getElementById("qrModal")
  qrModal.style.display = qrModal.style.display === "block" ? "none" : "block"
}
window.toggleQRModal = toggleQRModal; // Expose function globally

window.onclick = (event) => {
  const qrModal = document.getElementById("qrModal")
  const dropdown = document.getElementById("loginDropdown")
  const dropdownMobile = document.getElementById("loginDropdownMobile") // Get the mobile dropdown

  if (event.target === qrModal) {
    qrModal.style.display = "none"
  }
  if (
    !event.target.matches(".login-btn") &&
    !event.target.matches(".profile-btn") &&
    !event.target.closest(".login-dropdown")
  ) {
    dropdown.style.display = "none" // Hide desktop dropdown
  }
  if (dropdownMobile && !event.target.matches(".login-btn") && !event.target.closest(".login-dropdown")) {
    dropdownMobile.style.display = "none" // Hide mobile dropdown
  }
}
// Handle Form Submission


const loginForm = document.getElementById("loginForm")
if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault() // Prevent form submission

    const username = document.getElementById("username").value

    // Accept any username for login
    if (username) {
      currentUser = username
      localStorage.setItem("currentUser", username) // Save username to localStorage
      //checkmember();
      updateUser(username)
      updateLoginUI()

      if (membershipRewards === "true") {
        showRewardsBanner()
      }

      toggleLoginDropdown() // Close dropdown after login
    } else {
      alert("Please enter a username")
    }
  })
}

// Handle Mobile Form Submission
const loginFormMobile = document.getElementById("loginFormMobile")
if (loginFormMobile) {
  loginFormMobile.addEventListener("submit", (event) => {
    event.preventDefault() // Prevent form submission

    const username = document.getElementById("usernameMobile").value

    // Accept any username for login
    if (username) {
      console.log(username + " has logged in successfully")
      currentUser = username
      localStorage.setItem("currentUser", username) // Save username to localStorage

      updateUser(username)
      if (username.length > 5) {
        //createImageErrors();
      }

      updateLoginUI()
      toggleLoginDropdownMobile() // Close dropdown after login
    } else {
      alert("Please enter a username")
    }
  })
}

// Check if user is already logged in on page load
window.onload = () => {
  const savedUser = localStorage.getItem("currentUser")
  if (savedUser) {
    currentUser = savedUser
    updateUser(savedUser)
    updateLoginUI()
  }
}



function updateUser(username) {
  context.tier = "member"
  context.key = username
  client.identify(context, () => {
    console.log("New context's flags available")
    console.log(context.tier)
    getProducts()
  })
}


// New signIn function
function signIn() {
  if (!currentUser) {
    const defaultUsername = "defaultUser"; // You can set any default username here
    currentUser = defaultUsername;
    localStorage.setItem("currentUser", defaultUsername); // Save username to localStorage
    updateUser(defaultUsername);
    updateLoginUI();
    showNotification("Logged in successfully!");
    if (membershipRewards === "true") {
      showRewardsBanner();
    }
  } else {
    logout(); // If already signed in, sign out
    if (membershipRewards === "true") {
      showRewardsBanner();
    }
  }
  window.location.reload();
}

// Logout Function
function logout() {
  currentUser = null;
  localStorage.removeItem("currentUser"); // Remove username from localStorage
  context.tier = "member";
  context.key = "asdfa";
  client.identify(context, () => {
    console.log("Context reset to non-member");
  });
  window.location.reload();
  updateLoginUI();
  console.log("user has logged out");
  showNotification("Logged out successfully!");
  // Change "rewards-section" to "rewards-sections"
  const rewardsElem = document.getElementById("rewards-sections");
  if (rewardsElem) rewardsElem.style.display = "none";
}

function updateLoginUI() {
  const loginButtonMobile = document.getElementById("loginButtonMobile");
  const loginButtonDesktop = document.getElementById("loginButtonDesktop");
  const Dropdown = document.getElementById("loginDropdown");
  const loginDropdownMobile = document.getElementById("loginDropdownMobile");

  if (currentUser) {
    loginButtonMobile.innerHTML = `Log Out`;
    loginButtonDesktop.innerHTML = `Log Out`;
    Dropdown.innerHTML = `<button onclick="logout()">Log Out</button>`;
    loginDropdownMobile.innerHTML = ``;

    // Ensure the user icon is visible
    const userIcon = document.querySelector('.fas.fa-user, .fas.fa-user-alt');
    if (userIcon) {
      userIcon.style.display = "block";
    }
  } else {
    loginButtonMobile.innerHTML = `Log In`;
    loginButtonDesktop.innerHTML = `Log In`;
    Dropdown.innerHTML = `<button onclick="signIn()">Log In</button>`;
    loginDropdownMobile.innerHTML = ``;

    // Hide the user icon
    const userIcon = document.querySelector('.fas.fa-user, .fas.fa-user-alt');
    if (userIcon) {
      userIcon.style.display = "none";
    }
  }
}



function toggler() {

  if (membershipRewards === "off") {
    document.getElementById("rewards-switch").checked = false;
  } else {
    document.getElementById("rewards-switch").checked = true;
  }

  document.getElementById("banner-switch").checked = heroBanner;
  document.getElementById("api-switch").checked = badAPI


  let expState;

  if (branding !== "Red") {
    expState = false;
  } else { expState = true; }
  document.getElementById("experiment-switch").checked = expState;

}





function applyTheme() {
  if (branding == "Red") {
    applyColorScheme(redScheme);

  }
  else {
    applyColorScheme(greenScheme);

  }
  getProducts(menu); 
}



client.on("ready", () => {
  membershipRewards = client.variation("release-member-rewards", context, false)

  if (typeof jwplayer === 'function' && document.querySelector('#someJWPlayerContainer')) {
    jwplayer().on('ready', () => {
      const jwpSeek = setInterval(videoSeek, 100);
    });
  } else {
    console.warn("jwplayer is not available on this page.");
  }

  if (context.tier == "member") {
    document.querySelector('.fas.fa-user-alt').style.display = "block";
  }
  heroBanner = client.variation("release-banner", context, false)
  branding = client.variation("release-branding-change", context, false)
  console.log("branding = " + branding)
  console.log("member rewards = " + membershipRewards)
    console.log("badAPI is " + badAPI)



  toggler()
  turnOnHero();

  if (membershipRewards === "true") {
    document.querySelector(".dashboard-content").style.display = "block";
  } else {
    document.querySelector(".dashboard-content").style.display = "none";
  }

  console.log("client is ready")


  applyTheme()
  checkmember()
  createImageErrors()

})


client.on("change", () => {
  heroBanner = client.variation("release-banner", context, false)
  membershipRewards = client.variation("release-member-rewards", context, false)
  console.log('membership rewards is ' + membershipRewards);
  branding = client.variation("release-branding-change", context, false)
  badAPI = client.variation("release-new-api", context, false)
  toggler()
  turnOnHero();


  if (membershipRewards === "true") {
    document.querySelector(".dashboard-content").style.display = "block";
  } else {
    document.querySelector(".dashboard-content").style.display = "none";
  }

  console.log("membership rewards is " + membershipRewards)
  console.log("badAPI is " + badAPI)

  checkmember()
  createImageErrors()
})

function checkmember() {
  // Membership check logic
}

const menu = [
  {
    id: 10,
    temp: "holiday",
    name: "Chestnut Latte",
    img: "https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190716_ChestnutPralineCreme.jpg?impolicy=1by1_wide_topcrop_630",
    img2: "https://i.ibb.co/gZh5NhsD/SBX20190716-Chestnut-Praline-Creme-removebg-preview.png"
  },
  {
    temp: "holiday",
    name: "Peppermint Mocha",
    img: "https://globalassets.starbucks.com/digitalassets/products/bev/SBX20230612_4613_PeppermintMochaFrappuccino-onGreen-MOP_1800.jpg?impolicy=1by1_wide_topcrop_630",
    img2: "https://i.ibb.co/TqrnX893/SBX20230612-7785-Iced-Peppermint-Mocha-on-Green-MOP-1800-removebg-preview.png"
  },
  {
    temp: "holiday",
    name: "Caramel Brulee Latte",
    img: "https://globalassets.starbucks.com/digitalassets/products/bev/CaramelBruleeFrappuccino.jpg?impolicy=1by1_wide_topcrop_630",
    img2: "https://i.ibb.co/QvBSLtV3/Caramel-Brulee-Frappuccino-removebg-preview.png"
  },
  {
    temp: "holiday",
    name: "Gingerbread Chai",
    img: "https://globalassets.starbucks.com/digitalassets/products/bev/SBX20230612_7785_IcedPeppermintMocha-onGreen-MOP_1800.jpg?impolicy=1by1_wide_topcrop_630",
    img2: "https://i.ibb.co/TqrnX893/SBX20230612-7785-Iced-Peppermint-Mocha-on-Green-MOP-1800-removebg-preview.png"
  },
  {
    temp: "hot",
    name: "Espresso",
    img: "https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190617_Espresso_Single.jpg?impolicy=1by1_wide_topcrop_630",
    img2: "https://i.ibb.co/mnSFqVB/SBX20190617-Espresso-Single-removebg-preview.png"
  },
  {
    temp: "hot",
    name: "Cappuccino",
    img: "https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190617_Cappuccino.jpg?impolicy=1by1_wide_topcrop_630",
    img2: "https://i.ibb.co/H0Gf3V1/SBX20190617-Cappuccino-removebg-preview.png"
  },
  {
    temp: "hot",
    name: "Latte",
    img: "https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190617_CaffeLatte.jpg?impolicy=1by1_wide_topcrop_630",
    img2: "https://i.ibb.co/Kxx5DJzq/SBX20190617-Caffe-Latte-removebg-preview.png"
  },
  {
    temp: "hot",
    name: "Americano",
    img: "https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190617_CaffeAmericano.jpg?impolicy=1by1_wide_topcrop_630",
    img2: "https://i.ibb.co/m7x4zyN/SBX20190617-Caffe-Americano-removebg-preview.png"
  },
  {
    temp: "cold",
    name: "Iced Coffee",
    img: "https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190422_IcedVanillaLatte.jpg?impolicy=1by1_wide_topcrop_630",
    img2: "https://i.ibb.co/CspB2tPk/SBX20190422-Iced-Vanilla-Latte-removebg-preview.png"
  },
  {
    temp: "cold",
    name: "Matcha Latte",
    img: "https://globalassets.starbucks.com/digitalassets/products/bev/SBX20181127_IcedMatchaGreenTeaLatte.jpg?impolicy=1by1_wide_topcrop_630",
    img2: "https://i.ibb.co/xqTvBqjG/SBX20181127-Iced-Matcha-Green-Tea-Latte-removebg-preview.png"
  },
  {
    temp: "cold",
    name: "Berry Refresher",
    img: "https://globalassets.starbucks.com/digitalassets/products/bev/SBX20221206_MangoDragonfruitRefreshers.jpg?impolicy=1by1_wide_topcrop_630",
    img2: "https://i.ibb.co/cc01hWCk/SBX20221206-Mango-Dragonfruit-Refreshers-removebg-preview.png"
  },
  {

    temp: "cold",
    name: "Iced Tea",
    price: 2.0,
    img: "https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190531_IcedBlackTea.jpg?impolicy=1by1_wide_topcrop_630",
    img2: "https://i.ibb.co/wF6N7svX/SBX20190531-Iced-Black-Tea-removebg-preview.png"
  }
];



//turn on experimentation flag


function updateTokensValue(checked) {
  const tokensText = checked ? "Spanish" : "English"
  document.getElementById("tokensValue").textContent = tokensText
}


function closeNavOnClickOutside(event) {
  const navLinks = document.getElementById("navLinks")
  const hamburger = document.querySelector(".hamburger")

  if (navLinks.classList.contains("show") && !navLinks.contains(event.target) && !hamburger.contains(event.target)) {
    navLinks.classList.remove("show")
  }
}

document.addEventListener("click", closeNavOnClickOutside)


function turnOnHero() {
  if (heroBanner) {
    document.getElementById('rewards-sections').style.display = 'block';
    jwplayer().play();
  }
  else {
    document.getElementById('rewards-sections').style.display = 'none';
    jwplayer().pause();
  }
}

const redScheme = {
  font: '34px Pacifico, cursive',
  color: '#FF0000',
  pointsColor: 'black',
}

const greenScheme = {
  font: "24px Pacifico, cursive",
  color: '#006241',
  pointsColor: "#006241"
}


function applyColorScheme(colorScheme) {
  const logo = document.querySelector('.nav-bar h1');
  const elements = document.querySelectorAll('.login-btn, .add-to-cart-btn, .cart-btn:not(#cartButtonMobile), .cart-btn #cartCountMobile,.cart-btn #cartCountDesktop');

  Object.assign(logo.style, {
    color: colorScheme.color,
    display: 'block',
    fontFamily: 'Pacifico, cursive'
  });

  document.querySelector(".points").style.color = colorScheme.pointsColor;

  elements.forEach(element => {
    element.style.backgroundColor = colorScheme.color; // Red background
    logo.style.font = colorScheme.font;
    logo.style.display = 'block';
  });
}


function showNotification(message) {
  const notification = document.getElementById('notification');
  const notificationMessage = document.getElementById('notificationMessage');
  notificationMessage.textContent = message;
  notification.classList.add('show');
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000); // Hide after 3 seconds
}


async function toggleFeatureFlag(apiEndpoint, projectKey, featureFlagKey, newValue) {
  try {
    console.log(`Toggling feature flag: ${featureFlagKey} to ${newValue}`);
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectKey: 'coffee-app',
        featureFlagKey: featureFlagKey,
        value: newValue
      }),
    });
    if (!response.ok) throw new Error("Failed to toggle feature flag");
    const data = await response.json();
    console.log(`Success: ${data.message}`);
    return data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    const statusMessage = document.getElementById("statusMessage");
    if (statusMessage) statusMessage.textContent = `Error: ${error.message}`;
  }
}
/*

document.getElementById("rewards-flag").addEventListener("click", async () => {
  const newFlagVal = !(membershipRewards === "true");
  await toggleFeatureFlag("/api/toggle-bad-api", projectKey, 'release-new-api', newFlagVal);
});*/

document.getElementById("rewards-flag").addEventListener("click", async () => {
  let newFlagVal = true;
  if(branding === "Red") {
    newFlagVal = false;
  }
  await toggleFeatureFlag("/api/toggle-experimentation-flag", projectKey, "release-branding-change", newFlagVal);
});

document.getElementById("experimentFlag").addEventListener("click", async () => {
  let newFlagVal = true;
  if(branding === "Red") {
    newFlagVal = false;
  }
  await toggleFeatureFlag("/api/toggle-experimentation-flag", projectKey, "release-branding-change", newFlagVal);
});


document.getElementById("bad-api-flag").addEventListener("click", async () => {
  const newFlagVal = !badAPI
  await toggleFeatureFlag("/api/toggle-bad-api", projectKey, "release-new-api", newFlagVal);
  
});



document.getElementById("banner-flag").addEventListener("click", async () => {
  const newFlagVal = !heroBanner;
  await toggleFeatureFlag("/api/toggle-feature-flag", projectKey, "release-banner", newFlagVal);
});

// Add/update addToCart function to update cart state in localStorage
function addToCart(itemId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('cartCount', cart.length);
    updateCartCount();
    // Optionally, display a notification or update UI further
}
window.addToCart = addToCart; // Expose function globally

// Function to update the shopping cart counter
function updateCartCount() {
    const count = parseInt(localStorage.getItem('cartCount')) || 0;
    const cartCountElements = document.querySelectorAll("#cartCountMobile, #cartCountDesktop");
    cartCountElements.forEach(el => {
        if (count > 0) {
            el.textContent = count;
            el.style.display = 'inline';
        } else {
            el.style.display = 'none';
        }
    });
}

// Call updateCartCount on page load to restore counter state
window.addEventListener('load', updateCartCount);

// Updated function to show a dropdown with only the Clear Cart button
function toggleCartDropdown() {
  let dropdown = document.getElementById("cartDropdown");
  // Only display the clear cart button
  let html = `<div style="font-family: 'Montserrat', sans-serif; color: #333; text-align: center;">`;
  html += `<button style="margin-top: 10px; background-color: #006241; color: #F5F5F5; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 14px;" onclick="clearCart()">Clear Cart</button>`;
  html += "</div>";
  
  if (!dropdown) {
    dropdown = document.createElement("div");
    dropdown.id = "cartDropdown";
    Object.assign(dropdown.style, {
      position: "fixed",
      top: "80px",
      right: "10px",
      background: "#F5F5F5",
      border: "1px solid #ccc",
      padding: "15px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      borderRadius: "8px",
      zIndex: "1100",
      minWidth: "200px"
    });
    dropdown.innerHTML = html;
    document.body.appendChild(dropdown);
  } else {
    dropdown.innerHTML = html;
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  }
}

// Function to clear the cart
function clearCart() {
  localStorage.removeItem('cart');
  localStorage.setItem('cartCount', 0);
  updateCartCount();
  let dropdown = document.getElementById("cartDropdown");
  if (dropdown) {
    dropdown.style.display = "none";
  }
}

/*
function callBadApi(){
document.getElementById("bad-api-flag").addEventListener("click", async () => {
  const newFlagVal = !badAPI
  await toggleFeatureFlag("/api/toggle-bad-api", projectKey, "release-new-api", value);
  
});
}*/


function callBadApi(value) {
  const newFlagVal = !badAPI
  try {
    // Make the API call to your server-side endpoint
    const response = fetch("/api/toggle-experimentation-flag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectKey: "coffee-app",
        featureFlagKey: "release-new-api",
        value: value, // Use the toggled value
      }),
    })

    return response
  } catch (error) {
    console.log(`Error: ${error.message}`)
    document.getElementById("statusMessage").textContent = `Error: ${error.message}`
  }
}

// Expose functions globally
window.toggleNav = toggleNav;
window.toggleLoginDropdown = toggleLoginDropdown;
window.toggleLoginDropdownMobile = toggleLoginDropdownMobile;
window.toggleQRModal = toggleQRModal;
window.addToCart = addToCart;
window.updateCartCount = updateCartCount;
window.toggleCartDropdown = toggleCartDropdown;
window.clearCart = clearCart;
window.signIn = signIn;
window.logout = logout;
window.updateUser = updateUser;
window.updateLoginUI = updateLoginUI;
window.toggler = toggler;
window.applyTheme = applyTheme;
window.createImageErrors = createImageErrors;
window.getProducts = getProducts;
window.makeImagesCircular = makeImagesCircular;
window.videoSeek = videoSeek;

const experimentSwitch = document.getElementById("experiment-switch");
if (experimentSwitch) {
  experimentSwitch.checked = branding === "Red";
}
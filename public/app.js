const context = {
  kind: "user",
  key: "abcd",
  tier: "non-member",
}



function videoSeek() {
  let currentPos = jwplayer().getPosition();
  if (currentPos > 25) {
    jwplayer().seek(1)
  } 
}





document.addEventListener("DOMContentLoaded", function () {
  
  const logo = document.querySelector('.nav-bar h1');
  const greenElements = document.querySelectorAll('.login-btn, .add-to-cart-btn, .cart-btn:not(#cartButtonMobile), .cart-btn #cartCountMobile, .cart-btn #cartCountDesktop');

  if (logo) {
    logo.style.fontFamily = 'Impact, sans-serif';
    logo.style.color = '#FF0000'; // Red color
  }

  greenElements.forEach(element => {
    element.style.backgroundColor = '#FF0000'; // Red background
    element.style.color = '#fff'; // Ensure text is white
    logo.style.font = "36px Impact, sans-serif";
    logo.style.display = display = 'none';
  });

});


const storedImg = []
let circleFlag // Define circleFlag at the top

function showRewardsBanner() {
  document.getElementById("rewards-sections").style.display = "block"
}
function generateRandomKey() {
  let randomKey = ""
  const characters = "ABCDI"
  for (let i = 0; i < characters.length; i++) {
    randomKey += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  context.key = randomKey
  //console.log(context.key)
}

//generateRandomKey()
console.log(context);

const client = LDClient.initialize("64fb46764b5857122177a598", context)
let holidayDrinks = ""
const cartCount = 0
let cart = []
let badAPI

function showHolidayDrinks() {
  turnOnHero();
}

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
        counter ++;
      }
      callBadApi()
    }, 6000)
  }
}

function getProducts(products) {
  //<p>$${product.price.toFixed(2)}</p>

  const warmContainer = document.getElementById("warm-products")
  const coldContainer = document.getElementById("cold-products")
  const foodContainer = document.getElementById("food-products")
  const holidayContainer = document.getElementById("holiday-products")

  products.forEach((product) => {

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
      product.img = "asdfas.com";
      holidayContainer.appendChild(productElement)
    }
    if (product.temp === "food") {
      foodContainer.appendChild(productElement)
    }

    if (circleFlag == "Circle") {
      applyRedColorScheme();
    }
    else { applyGreenColorScheme(); 
      makeImagesCircular()

    }


  })
  //imageShape();
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

function makeImagesRectangle() {
  const productImages = document.querySelectorAll(".product img")
  productImages.forEach((img) => {
    img.style.width = ""
    img.style.height = ""
    img.style.borderRadius = ""
    img.style.objectFit = ""
    img.style.display = ""
    img.style.margin = ""
  })
}

function toggleNav(event) {
  event.stopPropagation() // Prevent the click event from bubbling up
  const navLinks = document.getElementById("navLinks")
  navLinks.classList.toggle("show")
}

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

function toggleQRModal() {
  const qrModal = document.getElementById("qrModal")
  qrModal.style.display = qrModal.style.display === "block" ? "none" : "block"
}

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
      console.log(username + " has logged in successfully")
      currentUser = username
      localStorage.setItem("currentUser", username) // Save username to localStorage
      //checkmember();
      updateUser(username)
      //if (username.length > 5) {
      //  createImageErrors();
      //}
      console.log(context)
      updateLoginUI()

      if (membershipRewards) {
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

  fetch("/api/reset-cart")
    .then((response) => response.json())
    .then((data) => {
      cart = []
      updateCartCount()
    })
    .catch((error) => console.error("Error:", error))
}

let currentUser = null

function updateUser(username) {
  context.tier = "member"
  context.key = username
  client.identify(context, () => {
    console.log("New context's flags available")
    console.log(context.tier)
    getProducts()
  })
}

// Logout Function
function logout() {
    currentUser = null;
    localStorage.removeItem("currentUser"); // Remove username from localStorage
    context.tier = "member";
    context.key = "asdfa";
    client.identify(context, () => {
        console.log("Context reset to non-member");
        console.log(context);
    });
    window.location.reload();
    updateLoginUI();
    console.log("user has logged out");
    showNotification("Logged out successfully!");
    document.getElementById("rewards-section").style.display = "none";
    document.getElementById("rewards-section").style.display = "none";
    document.getElementById("rewards-section").style.display = "none";
}

function updateLoginUI() {
  const loginButtonMobile = document.getElementById("loginButtonMobile")
  const loginButtonDesktop = document.getElementById("loginButtonDesktop")
  const Dropdown = document.getElementById("loginDropdown")
  const loginDropdownMobile = document.getElementById("loginDropdownMobile")

  if (currentUser) {
    loginButtonMobile.innerHTML = `Log Out`
    loginButtonDesktop.innerHTML = `Log Out`
    loginDropdown.innerHTML = `
            <button onclick="logout()">Log Out</button>
        `
    loginDropdownMobile.innerHTML = `` //remove the log out button
  } else {
    loginButtonMobile.innerHTML = `Log In`
    loginButtonDesktop.innerHTML = `Log In`
    loginDropdown.innerHTML = `
            <button onclick="signIn()">Log In</button>
        `
    loginDropdownMobile.innerHTML = `` //remove the log in button
  }
}

// New signIn function
function signIn() {
    if (!currentUser) {
        const defaultUsername = "defaultUser"; // You can set any default username here
        console.log(defaultUsername + " has logged in successfully");
        currentUser = defaultUsername;
        localStorage.setItem("currentUser", defaultUsername); // Save username to localStorage
        updateUser(defaultUsername);
        console.log(context);
        updateLoginUI();
        showNotification("Logged in successfully!");
        if (membershipRewards) {
            showRewardsBanner();
        }
    } else {
        logout(); // If already signed in, sign out
    }
    window.location.reload();
}

function toggler() {
  document.getElementById("holiday-switch").checked = holidayDrinks
  document.getElementById("api-switch").checked = badAPI
  document.getElementById("rewards-switch").checked = membershipRewards;
  
  let expState;

  if(circleFlag === "false") {
    expState = false;
  } else {expState = true;}
  document.getElementById("experiment-switch").checked = expState;
  
}

function addToCart(productId) {
  fetch("/api/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: productId }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Item added to cart") {
        cart = data.cart
        updateCartCount()
      } else {
        console.error("Failed to add item to cart")
      }
    })
    .catch((error) => console.error("Error:", error))
}

let holidayAlreadyOn = false
let heroBanner;

function applyTheme() {
  if (circleFlag == "Circle") {
    applyRedColorScheme()
    getProducts(secondMenu)
  }
  else {
    applyGreenColorScheme();
    getProducts(menu)


  }
}

function updateCartCount() {
  const cartCountMobile = document.getElementById("cartCountMobile")
  const cartCountDesktop = document.getElementById("cartCountDesktop")
  const cartCount = cart.length
  if (cartCountMobile) cartCountMobile.textContent = cartCount
  if (cartCountDesktop) cartCountDesktop.textContent = cartCount
}

client.on("ready", () => {
  membershipRewards = client.variation("release-membership", context, false)
  console.log("member rewards = " + membershipRewards)

  
  
  jwplayer().on('ready', () => {
    const jwpSeek = setInterval(videoSeek, 100);
  })
  if(membershipRewards){
  document.querySelector('.fas.fa-user-alt').style.display = "block";
  }

  holidayDrinks = client.variation("release-holiday-drinks", context, false)
  circleFlag = client.variation("circular-logos", context, false)
  console.log("circle = " + circleFlag)
  badAPI = client.variation("release-new-product-api", context, false)
  console.log("badAPI is " + badAPI)

  toggler()
  turnOnHero();

  if(membershipRewards){
    document.querySelector(".dashboard-content").style.display = "block";
  } else{
    document.querySelector(".dashboard-content").style.display = "none";
  }

  console.log("client is ready")

  console.log(holidayDrinks)
  if (holidayDrinks) {
    holidayAlreadyOn = true
  }
  applyTheme()

  showHolidayDrinks()
  checkmember()
  createImageErrors()

})

client.on("change", () => {
  heroBanner = client.variation("release-hero-banner", context, false)
  holidayDrinks = client.variation("release-holiday-drinks", context, false)
  membershipRewards = client.variation("release-membership", context, false)
  circleFlag = client.variation("circular-logos", context, false)
  badAPI = client.variation("release-new-product-api", context, false)
  toggler()
  turnOnHero();
  if(membershipRewards){
    document.querySelector('.fas.fa-user-alt').style.display = "block";
    }

  if (badAPI) {
  }

  if(membershipRewards){
    document.querySelector(".dashboard-content").style.display = "block";
  } else{
    document.querySelector(".dashboard-content").style.display = "none";
  }

  console.log("membership rewards is " + membershipRewards)
  console.log("badAPI is " + badAPI)
  console.log("holiday drinks is " + holidayDrinks)


  //getProducts(secondMenu)
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
    price: 3.5,
    img: "https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190716_ChestnutPralineCreme.jpg?impolicy=1by1_wide_topcrop_630",
  },
  {
    id: 11,
    temp: "holiday",
    name: "Peppermint Mocha",
    price: 2.5,
    img: "https://globalassets.starbucks.com/digitalassets/products/bev/SBX20230612_4613_PeppermintMochaFrappuccino-onGreen-MOP_1800.jpg?impolicy=1by1_wide_topcrop_630",
  },
  {
    id: 12,
    temp: "holiday",
    name: "Caramel Brulee Latte",
    price: 3.0,
    img: "https://globalassets.starbucks.com/digitalassets/products/bev/CaramelBruleeFrappuccino.jpg?impolicy=1by1_wide_topcrop_630",
  },
  {
    id: 13,
    temp: "holiday",
    name: "Gingerbread Chai",
    price: 2.0,
    img: "https://globalassets.starbucks.com/digitalassets/products/bev/SBX20230612_7785_IcedPeppermintMocha-onGreen-MOP_1800.jpg?impolicy=1by1_wide_topcrop_630",
  },
  {
    id: 1,
    temp: "hot",
    name: "Espresso",
    price: 2.5,
    img: "https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190617_Espresso_Single.jpg?impolicy=1by1_wide_topcrop_630",
  },
  {
    id: 2,
    temp: "hot",
    name: "Cappuccino",
    price: 3.0,
    img: "https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190617_Cappuccino.jpg?impolicy=1by1_wide_topcrop_630",
  },
  {
    id: 3,
    temp: "hot",
    name: "Latte",
    price: 3.5,
    img: "https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190617_CaffeLatte.jpg?impolicy=1by1_wide_topcrop_630",
  },
  {
    id: 4,
    temp: "hot",
    name: "Americano",
    price: 2.0,
    img: "https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190617_CaffeAmericano.jpg?impolicy=1by1_wide_topcrop_630",
  },
  {
    id: 5,
    temp: "cold",
    name: "Iced Coffee",
    price: 2.5,
    img: "https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190422_IcedVanillaLatte.jpg?impolicy=1by1_wide_topcrop_630",
  },
  {
    id: 6,
    temp: "cold",
    name: "Matcha Latte",
    price: 3.0,
    img: "https://globalassets.starbucks.com/digitalassets/products/bev/SBX20181127_IcedMatchaGreenTeaLatte.jpg?impolicy=1by1_wide_topcrop_630",
  },
  {
    id: 8,
    temp: "cold",
    name: "Berry Refresher",
    price: 2.0,
    img: "https://globalassets.starbucks.com/digitalassets/products/bev/SBX20221206_MangoDragonfruitRefreshers.jpg?impolicy=1by1_wide_topcrop_630",
  },
  {
    id: 9,
    temp: "cold",
    name: "Iced Tea",
    price: 2.0,
    img: "https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190531_IcedBlackTea.jpg?impolicy=1by1_wide_topcrop_630",
  },

]



//turn on experimentation flag



document.getElementById("rewards-flag").addEventListener("click", async () => {
  let newFlagVal = !membershipRewards
  try {
    // Make the API call to your server-side endpoint
    const response = await fetch("/api/toggle-membership-flag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectKey: "brian-l-demo-project",
        featureFlagKey: "release-membership",
        value: newFlagVal, // Use the toggled value
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to toggle feature flag")
    }

    console.log("this is the new flag val =" + newFlagVal)

    const data = await response.json()
    console.log(`Success: ${data.message}`)
    imageShape() // Update the image shape based on the new flag value
  } catch (error) {
    console.log(`Error: ${error.message}`)
    document.getElementById("statusMessage").textContent = `Error: ${error.message}`
  }
})

document.getElementById("experimentFlag").addEventListener("click", async () => {
  let newFlagVal;
  if(circleFlag === "false"){
    newFlagVal = true;
  } else {
    newFlagVal = false;
  }
  try {
    // Make the API call to your server-side endpoint
    const response = await fetch("/api/toggle-experimentation-flag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectKey: "brian-l-demo-project",
        featureFlagKey: "circular-logos",
        value: newFlagVal, // Use the toggled value
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to toggle feature flag")
    }

    console.log("this is the new flag val =" + newFlagVal)

    const data = await response.json()
    console.log(`Success: ${data.message}`)
    imageShape() // Update the image shape based on the new flag value
  } catch (error) {
    console.log(`Error: ${error.message}`)
    document.getElementById("statusMessage").textContent = `Error: ${error.message}`
  }
})




document.getElementById("bad-api-flag").addEventListener("click", async () => {
  const newFlagVal = !badAPI

  try {
    // Make the API call to your server-side endpoint
    const response = await fetch("/api/toggle-bad-api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectKey: "brian-l-demo-project",
        featureFlagKey: "release-new-product-api",
        value: newFlagVal, // Use the toggled value
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to toggle feature flag")
    }

    if (newFlagVal) {
      //('API Flag Is On')
    }
    //s else {alert('API Flag Is Off')}

    console.log("this is the new flag val =" + newFlagVal)

    const data = await response.json()
    console.log(`Success: ${data.message}`)
    imageShape() // Update the image shape based on the new flag value
  } catch (error) {
    console.log(`Error: ${error.message}`)
    document.getElementById("statusMessage").textContent = `Error: ${error.message}`
  }
})

function addEventListenersToDots() {
  // Remove all the dot event listener logic
}

function updateTokensValue(checked) {
  const tokensText = checked ? "Spanish" : "English"
  document.getElementById("tokensValue").textContent = tokensText
}

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
        projectKey: "brian-l-demo-project",
        featureFlagKey: "release-new-product-api",
        value: value, // Use the toggled value
      }),
    })

    return response
  } catch (error) {
    console.log(`Error: ${error.message}`)
    document.getElementById("statusMessage").textContent = `Error: ${error.message}`
  }
}



// Add this function at the end of the file
function closeNavOnClickOutside(event) {
  const navLinks = document.getElementById("navLinks")
  const hamburger = document.querySelector(".hamburger")

  if (navLinks.classList.contains("show") && !navLinks.contains(event.target) && !hamburger.contains(event.target)) {
    navLinks.classList.remove("show")
  }
}

// Add this event listener at the end of the file
document.addEventListener("click", closeNavOnClickOutside)



function turnOnHero() {
  if (holidayDrinks) {
    document.getElementById('rewards-sections').style.display = 'block';
    jwplayer().play();
  }
  else {
    document.getElementById('rewards-sections').style.display = 'none';
    document.getElementById('rewards-sections').style.display = 'none';
    jwplayer().pause();
  }
}


function applyRedColorScheme() {
  const logo = document.querySelector('.nav-bar h1');
  const redElements = document.querySelectorAll('.login-btn, .add-to-cart-btn, .cart-btn:not(#cartButtonMobile), .cart-btn #cartCountMobile,.cart-btn #cartCountDesktop');
  //const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

  if (logo) {
    logo.style.fontFamily = 'Pacifico, cursive';
    logo.style.color = '#FF0000'; // Red color
    logo.style.display = display = 'block';
    //addToCartButtons.style.color = '#FF0000';
  }

  document.querySelector(".points").style.color = 'black';

  redElements.forEach(element => {
    element.style.backgroundColor = '#FF0000'; // Red background
    element.style.color = '#fff'; // Ensure text is white
    logo.style.font = "36px Pacifico, cursive', sans-serif";
    logo.style.display = display = 'block';
  });
}




function applyGreenColorScheme() {
  const logo = document.querySelector('.nav-bar h1');
  const greenElements = document.querySelectorAll('.login-btn, .add-to-cart-btn, .cart-btn:not(#cartButtonMobile), .cart-btn #cartCountMobile, .cart-btn #cartCountDesktop');



  if (logo) {
    logo.style.fontFamily = 'Pacifico, cursive';
    logo.style.color = '#006241'; // Green color
    logo.style.display = display = 'block';
    //addToCartButtons.style.color = '#0062410';

  }
  document.querySelector(".points").style.color = '#006241';

  greenElements.forEach(element => {
    element.style.backgroundColor = '#006241'; // Red background
    element.style.color = '#fff'; // Ensure text is white
    logo.style.font = "24px Pacifico, cursive";
    logo.style.display = display = 'block';
  });
}








const secondMenu = [
  {
    id: 10,
    temp: "holiday",
    name: "Chestnut Latte",
    price: 3.5,
    img: "https://i.ibb.co/gZh5NhsD/SBX20190716-Chestnut-Praline-Creme-removebg-preview.png",
  },
  {
    id: 11,
    temp: "holiday",
    name: "Peppermint Mocha",
    price: 2.5,
    img: "https://i.ibb.co/TqrnX893/SBX20230612-7785-Iced-Peppermint-Mocha-on-Green-MOP-1800-removebg-preview.png",
  },
  {
    id: 12,
    temp: "holiday",
    name: "Caramel Brulee Latte",
    price: 3.0,
    img: "https://i.ibb.co/QvBSLtV3/Caramel-Brulee-Frappuccino-removebg-preview.png",
  },
  {
    id: 13,
    temp: "holiday",
    name: "Gingerbread Chai",
    price: 2.0,
    img: "https://i.ibb.co/TqrnX893/SBX20230612-7785-Iced-Peppermint-Mocha-on-Green-MOP-1800-removebg-preview.png",
  },
  {
    id: 1,
    temp: "hot",
    name: "Espresso",
    price: 2.5,
    img: "https://i.ibb.co/mnSFqVB/SBX20190617-Espresso-Single-removebg-preview.png",
  },
  {
    id: 2,
    temp: "hot",
    name: "Cappuccino",
    price: 3.0,
    img: "https://i.ibb.co/H0Gf3V1/SBX20190617-Cappuccino-removebg-preview.png",
  },
  {
    id: 3,
    temp: "hot",
    name: "Latte",
    price: 3.5,
    img: "https://i.ibb.co/Kxx5DJzq/SBX20190617-Caffe-Latte-removebg-preview.png",
  },
  {
    id: 4,
    temp: "hot",
    name: "Americano",
    price: 2.0,
    img: "https://i.ibb.co/m7x4zyN/SBX20190617-Caffe-Americano-removebg-preview.png",
  },
  {
    id: 5,
    temp: "cold",
    name: "Iced Coffee",
    price: 2.5,
    img: "https://i.ibb.co/CspB2tPk/SBX20190422-Iced-Vanilla-Latte-removebg-preview.png",
  },
  {
    id: 6,
    temp: "cold",
    name: "Matcha Latte",
    price: 3.0,
    img: "https://i.ibb.co/xqTvBqjG/SBX20181127-Iced-Matcha-Green-Tea-Latte-removebg-preview.png",
  },
  {
    id: 8,
    temp: "cold",
    name: "Berry Refresher",
    price: 2.0,
    img: "https://i.ibb.co/cc01hWCk/SBX20221206-Mango-Dragonfruit-Refreshers-removebg-preview.png",
  },
  {
    id: 9,
    temp: "cold",
    name: "Iced Tea",
    price: 2.0,
    img: "https://i.ibb.co/wF6N7svX/SBX20190531-Iced-Black-Tea-removebg-preview.png",
  },
  
]

function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    notificationMessage.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000); // Hide after 3 seconds
}

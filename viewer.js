// ================================
// Viewer-Specific Logic (viewer.js)
// --------------------------------
// This file manages a separate login and cart functionality exclusively for viewer pages.
// Viewer state (stored under keys like "viewerCurrentUser" and "viewerCart") is isolated
// so that a viewer can be logged in while the main app remains logged out.
// ================================

// Viewer-specific state: Stores current viewer login status using localStorage.
let viewerCurrentUser = localStorage.getItem('viewerCurrentUser') || null;

// Function: updateViewerLoginUI
// Purpose: Updates the viewer login button and dropdown text based on login state.
function updateViewerLoginUI() {
  const btnMobile = document.getElementById('viewerLoginButtonMobile');
  const dropdown = document.getElementById('viewerLoginDropdownMobile');
  if (viewerCurrentUser) {
    // When viewer is logged in, show 'Log Out' option.
    btnMobile.textContent = 'Log Out';
    dropdown.innerHTML = `<button onclick="viewerLogout()">Log Out</button>`;
  } else {
    // When not logged in, show 'Log In' option.
    btnMobile.textContent = 'Log In';
    dropdown.innerHTML = `<button onclick="viewerSignIn()">Log In</button>`;
  }
}

// Function: viewerSignIn
// Purpose: Sign in the viewer with a default username and update UI.
function viewerSignIn() {
  viewerCurrentUser = "viewerUser";
  localStorage.setItem('viewerCurrentUser', viewerCurrentUser);
  updateViewerLoginUI();
  showViewerNotification("Viewer logged in successfully!");
}
// Function: viewerLogout
// Purpose: Log out the viewer and update UI.
function viewerLogout() {
  viewerCurrentUser = null;
  localStorage.removeItem('viewerCurrentUser');
  updateViewerLoginUI();
  showViewerNotification("Viewer logged out successfully!");
}

// Function: toggleViewerLoginDropdownMobile
// Purpose: Opens or closes the viewer’s login dropdown on mobile devices.
function toggleViewerLoginDropdownMobile() {
  const dropdown = document.getElementById('viewerLoginDropdownMobile');
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}
window.toggleViewerLoginDropdownMobile = toggleViewerLoginDropdownMobile;

// ================================
// Viewer Cart Logic - Uses separate keys so that viewer cart is independent.
// ================================
function viewerAddToCart(itemId) {
  let cart = JSON.parse(localStorage.getItem('viewerCart')) || [];
  cart.push(itemId);
  localStorage.setItem('viewerCart', JSON.stringify(cart));
  localStorage.setItem('viewerCartCount', cart.length);
  updateViewerCartCount();
}
function updateViewerCartCount() {
  const count = parseInt(localStorage.getItem('viewerCartCount')) || 0;
  const spans = document.querySelectorAll("#viewerCartCountMobile");
  spans.forEach(el => {
    if (count > 0) {
      el.textContent = count;
      el.style.display = 'inline';
    } else {
      el.style.display = 'none';
    }
  });
}
function toggleViewerCartDropdown() {
  // Show a simple dropdown with a clear cart button.
  let dropdown = document.getElementById("viewerCartDropdown");
  const html = `<div style="text-align:center;">
      <button onclick="viewerClearCart()">Clear Cart</button>
    </div>`;
  if (!dropdown) {
    dropdown = document.createElement("div");
    dropdown.id = "viewerCartDropdown";
    Object.assign(dropdown.style, {
      position: "fixed",
      top: "80px",
      right: "10px",
      background: "#F5F5F5",
      padding: "10px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
    });
    dropdown.innerHTML = html;
    document.body.appendChild(dropdown);
  } else {
    dropdown.innerHTML = html;
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  }
}
function viewerClearCart() {
  localStorage.removeItem('viewerCart');
  localStorage.setItem('viewerCartCount', 0);
  updateViewerCartCount();
  const dropdown = document.getElementById("viewerCartDropdown");
  if (dropdown) dropdown.style.display = "none";
}
window.viewerAddToCart = viewerAddToCart;
window.toggleViewerCartDropdown = toggleViewerCartDropdown;
window.viewerClearCart = viewerClearCart;

// ================================
// Notification: Display alerts for viewer actions.
// ================================
function showViewerNotification(message) {
  // For now, we use alert; later you might implement a custom UI notification.
  alert(message);
}
window.showViewerNotification = showViewerNotification;

// ================================
// Initialization: Set up the viewer UI on DOM load.
// ================================
document.addEventListener("DOMContentLoaded", () => {
  updateViewerLoginUI();
  updateViewerCartCount();
  // ...other viewer-specific initialization if needed...
});

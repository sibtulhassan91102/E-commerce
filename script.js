/* ================================================================
   AURORA LUXE — script.js
   All interactive functionality for the Aurora Luxe website.
   Sections:
     1.  Data – Products, Flash Sale Items, Reviews
     2.  Cart State Management
     3.  Navbar – Scroll Behavior & Mobile Menu
     4.  Modal System – Open, Close, Switch
     5.  Product Cards – Render Best Sellers
     6.  Flash Sale – Render Cards & Countdown Timer
     7.  Category Section – Filter Handler
     8.  Reviews Section – Render Cards
     9.  Cart Operations – Add, Remove, Update Qty
    10.  Checkout Flow
    11.  Order Placement
    12.  Search Handler
    13.  Toast Notifications
    14.  Scroll-to-Top Button
    15.  Scroll Animations (IntersectionObserver)
    16.  Wishlist Toggle
    17.  Initialization (DOMContentLoaded)
================================================================ */

'use strict';

/* ================================================================
   1. DATA — Products, Flash Sale Items, Reviews
================================================================ */

/**
 * Best sellers product catalog.
 * Each product has id, name, price, originalPrice, discount (%),
 * rating, reviews count, and image path.
 */
const PRODUCTS = [
  {
    id: 1,
    name: 'Aurora Gold Chronograph',
    price: 219.00,
    originalPrice: 289.00,
    discount: 24,
    rating: 4.9,
    reviews: 120,
    image: 'best_seller.png',
    sku: 'AL-W-1001',
    color: 'Gold',
  },
  {
    id: 2,
    name: 'Stealth Pro Earbuds',
    price: 189.00,
    originalPrice: null,
    discount: null,
    rating: 4.8,
    reviews: 95,
    image: 'best_seller.png',
    sku: 'AL-E-2001',
    color: 'Matte Black',
  },
  {
    id: 3,
    name: 'Sartorial Leather Messenger',
    price: 250.00,
    originalPrice: 300.00,
    discount: 16,
    rating: 5.0,
    reviews: 68,
    image: 'best_seller.png',
    sku: 'AL-B-3001',
    color: 'Brown',
  },
  {
    id: 4,
    name: 'Signature Scent Collection',
    price: 179.00,
    originalPrice: 229.00,
    discount: 21,
    rating: 4.7,
    reviews: 105,
    image: 'best_seller.png',
    sku: 'AL-F-4001',
    color: 'Mixed',
  },
];

/**
 * Flash sale product data.
 * Extends base product data with a flashDiscount percentage.
 */
const FLASH_PRODUCTS = [
  {
    id: 1,
    name: 'Aurora Gold Chronograph',
    price: 109.50,
    originalPrice: 219.00,
    flashDiscount: 50,
    rating: 4.9,
    reviews: 120,
    image: 'limited_sale.png',
    sku: 'AL-W-1001',
  },
  {
    id: 2,
    name: 'Stealth Pro Earbuds',
    price: 189.00,
    originalPrice: 229.00,
    flashDiscount: 40,
    rating: 4.8,
    reviews: 95,
    image: 'limited_sale.png',
    sku: 'AL-E-2001',
  },
  {
    id: 3,
    name: 'Sartorial Leather Messenger',
    price: 250.00,
    originalPrice: 300.00,
    flashDiscount: 30,
    rating: 5.0,
    reviews: 68,
    image: 'limited_sale.png',
    sku: 'AL-B-3001',
  },
  {
    id: 4,
    name: 'Signature Scent Collection',
    price: 179.00,
    originalPrice: 229.00,
    flashDiscount: 45,
    rating: 4.7,
    reviews: 105,
    image: 'limited_sale.png',
    sku: 'AL-F-4001',
  },
];

/**
 * Client review data.
 * Each entry includes reviewer name, city, star rating, review text,
 * and avatar image path.
 */
const REVIEWS = [
  {
    name: 'Elena R.',
    city: 'New York',
    rating: 5,
    text: 'Absolute perfection. My Aurora Gold Chronograph is a masterpiece. The quality is unmatched.',
    avatar: 'review.png',
  },
  {
    name: 'David L.',
    city: 'London',
    rating: 5,
    text: 'The sound quality from the Stealth Pro Earbuds is incredible. Best purchase I\'ve made all year.',
    avatar: 'review.png',
  },
  {
    name: 'Priya K.',
    city: 'Berlin',
    rating: 5,
    text: 'This Sartorial Leather Messenger bag is my new daily essential. The leather is stunning and incredibly well-made.',
    avatar: 'review.png',
  },
  {
    name: 'Michael J.',
    city: 'Paris',
    rating: 5,
    text: 'The Signature Scent Collection is sophisticated and elegant. Truly a premium experience.',
    avatar: 'review.png',
  },
];

/* ================================================================
   2. CART STATE MANAGEMENT
================================================================ */

/**
 * In-memory cart array.
 * Each item: { id, name, price, image, sku, color, qty }
 * Persisted to localStorage so cart survives page refresh.
 */
let cart = loadCartFromStorage();

/**
 * Loads cart data from localStorage.
 * Returns empty array if nothing is stored or parsing fails.
 * @returns {Array} cart items array
 */
function loadCartFromStorage() {
  try {
    const stored = localStorage.getItem('auroraluxe_cart');
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Failed to load cart from storage:', e);
    return [];
  }
}

/**
 * Saves current cart state to localStorage.
 * Called after every cart mutation (add/remove/update).
 */
function saveCartToStorage() {
  try {
    localStorage.setItem('auroraluxe_cart', JSON.stringify(cart));
  } catch (e) {
    console.error('Failed to save cart to storage:', e);
  }
}

/**
 * Updates the cart item count badge shown in the navbar.
 * Sums all quantities across cart items.
 */
function updateCartBadge() {
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById('cartCount');
  if (badge) badge.textContent = total;
}

/* ================================================================
   3. NAVBAR — Scroll Behavior & Mobile Menu
================================================================ */

/**
 * Handles navbar appearance changes on window scroll.
 * Adds 'scrolled' class when user scrolls past 80px for
 * a more opaque background effect.
 * Also shows/hides the scroll-to-top button.
 */
function handleNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scrollTop');

  if (window.scrollY > 80) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Show scroll-to-top button after 400px of scrolling
  if (scrollTopBtn) {
    scrollTopBtn.style.display = window.scrollY > 400 ? 'flex' : 'none';
  }
}

/**
 * Toggles the mobile navigation menu open/closed.
 * Applies 'mobile-open' class to nav-links element.
 */
function toggleMobileMenu() {
  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');

  if (navLinks) navLinks.classList.toggle('mobile-open');
  if (hamburger) hamburger.classList.toggle('open');
}

/**
 * Smoothly scrolls the viewport to a given section ID.
 * Accounts for the fixed navbar height (80px offset).
 * @param {string} sectionId - The ID of the target section element
 */
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  const navbarHeight = document.getElementById('navbar').offsetHeight;
  const offsetTop = section.getBoundingClientRect().top + window.scrollY - navbarHeight - 10;

  window.scrollTo({ top: offsetTop, behavior: 'smooth' });

  // Close mobile menu if open after navigation
  const navLinks = document.getElementById('navLinks');
  if (navLinks) navLinks.classList.remove('mobile-open');
}

/**
 * Scrolls the page back to the very top (home).
 */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ================================================================
   4. MODAL SYSTEM — Open, Close, Switch
================================================================ */

/**
 * Opens a modal by its ID.
 * Also shows the background overlay.
 * Prevents body scrolling while modal is open.
 * @param {string} modalId - ID of the modal element to open
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  const overlay = document.getElementById('overlay');

  if (!modal) return;

  // Close any other open modals first
  document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));

  modal.classList.add('active');
  if (overlay) overlay.style.display = 'block';
  document.body.style.overflow = 'hidden'; // Prevent background scroll

  // If opening cart, refresh the cart display
  if (modalId === 'cartModal') renderCartModal();
  if (modalId === 'checkoutModal') renderCheckoutModal();
}

/**
 * Closes a specific modal by ID.
 * Hides overlay only if no other modals remain open.
 * @param {string} modalId - ID of the modal element to close
 */
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  const overlay = document.getElementById('overlay');

  if (!modal) return;

  modal.classList.remove('active');

  // Re-enable body scroll if no modals are open
  const anyOpen = document.querySelector('.modal.active');
  if (!anyOpen) {
    if (overlay) overlay.style.display = 'none';
    document.body.style.overflow = '';
  }
}

/**
 * Closes all open modals at once.
 * Called when the overlay background is clicked.
 */
function closeAllModals() {
  document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
  const overlay = document.getElementById('overlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}

/**
 * Switches from one modal to another smoothly.
 * E.g. switching from Login modal to Signup modal.
 * @param {string} fromId - ID of the modal to close
 * @param {string} toId   - ID of the modal to open
 */
function switchModal(fromId, toId) {
  closeModal(fromId);
  // Small timeout for a smooth visual transition
  setTimeout(() => openModal(toId), 150);
}

/* ================================================================
   5. PRODUCT CARDS — Render Best Sellers
================================================================ */

/**
 * Generates the HTML string for a single product card.
 * Includes image, discount badge, wishlist button, name,
 * price (with/without original), star rating, and add-to-cart button.
 * @param {Object} product - Product data object from PRODUCTS array
 * @returns {string} HTML string for the product card
 */
function createProductCardHTML(product) {
  // Build discount badge HTML (only if discount exists)
  const discountBadge = product.discount
    ? `<div class="discount-badge">${product.discount}%<br/>OFF</div>`
    : '';

  // Build original price HTML (only if it exists)
  const originalPrice = product.originalPrice
    ? `<span class="price-original">$${product.originalPrice.toFixed(2)}</span>`
    : '';

  // Build star icons based on rating (full stars only for simplicity)
  const stars = generateStarHTML(product.rating);

  return `
    <div class="product-card animate-on-scroll" data-id="${product.id}">
      <div class="product-img-wrap">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        ${discountBadge}
        <button
          class="wishlist-btn"
          id="wish-${product.id}"
          onclick="toggleWishlist(${product.id}, event)"
          title="Add to wishlist"
          aria-label="Toggle wishlist for ${product.name}"
        >
          <i class="fas fa-heart"></i>
        </button>
      </div>
      <div class="product-info">
        <p class="product-name">${product.name}</p>
        <div class="product-price">
          <span class="price-current">$${product.price.toFixed(2)}</span>
          ${originalPrice}
        </div>
        <div class="product-rating">
          ${stars}
          <span>(${product.reviews} reviews)</span>
        </div>
        <button
          class="add-to-cart-btn"
          id="btn-${product.id}"
          onclick="addToCart('${product.name}', ${product.price}, '${product.image}', '${product.sku}', '${product.color}', ${product.id})"
        >
          ADD TO CART
        </button>
      </div>
    </div>
  `;
}

/**
 * Renders all best seller product cards into the grid container.
 * Clears existing content and injects fresh HTML.
 */
function renderBestSellers() {
  const grid = document.getElementById('bestSellersGrid');
  if (!grid) return;

  grid.innerHTML = PRODUCTS.map(createProductCardHTML).join('');

  // Re-trigger scroll animations after render
  observeAnimations();
}

/* ================================================================
   6. FLASH SALE — Render Cards & Countdown Timer
================================================================ */

/**
 * Generates the HTML for a single flash sale product card.
 * Similar to regular product card but with a flash banner tag
 * and green-themed styling.
 * @param {Object} product - Flash product data object
 * @returns {string} HTML string for the flash card
 */
function createFlashCardHTML(product) {
  const stars = generateStarHTML(product.rating);

  return `
    <div class="flash-card animate-on-scroll">
      <div class="flash-card-tag">
        FLASH SALE
        <span>OFFER VALID FOR:</span>
      </div>
      <div class="flash-card-img-wrap">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        <div class="flash-discount">
          ${product.flashDiscount}%<br/>OFF
        </div>
      </div>
      <p class="product-name">${product.name}</p>
      <div class="product-price">
        <span class="price-current">$${product.price.toFixed(2)}</span>
        <span class="price-original">$${product.originalPrice.toFixed(2)}</span>
      </div>
      <div class="product-rating">
        ${stars}
        <span>(${product.reviews} reviews)</span>
      </div>
      <button
        class="add-to-cart-btn"
        onclick="addToCart('${product.name}', ${product.price}, '${product.image}', '${product.sku}', 'Default', ${product.id + 10})"
      >
        ADD TO CART
      </button>
    </div>
  `;
}

/**
 * Renders flash sale product cards into the flash grid container.
 */
function renderFlashProducts() {
  const grid = document.getElementById('flashProductsGrid');
  if (!grid) return;

  grid.innerHTML = FLASH_PRODUCTS.map(createFlashCardHTML).join('');
  observeAnimations();
}

/**
 * Countdown timer state.
 * Initialized to 4 hours, 15 minutes, 33 seconds.
 * Stored as total seconds for easy decrement.
 */
let countdownSeconds = (4 * 3600) + (15 * 60) + 33;

/**
 * Starts the flash sale countdown timer.
 * Decrements every second and updates the DOM elements.
 * Stops and shows "ENDED" when it reaches zero.
 */
function startCountdown() {
  // Update the display immediately before interval fires
  updateCountdownDisplay();

  const interval = setInterval(() => {
    if (countdownSeconds <= 0) {
      clearInterval(interval);
      // Show "sale ended" state when timer hits zero
      document.getElementById('timerHrs').textContent  = '00';
      document.getElementById('timerMins').textContent = '00';
      document.getElementById('timerSecs').textContent = '00';
      return;
    }

    countdownSeconds--;
    updateCountdownDisplay();
  }, 1000);
}

/**
 * Updates the timer DOM elements (hours, minutes, seconds)
 * based on the current countdownSeconds value.
 * Pads single-digit numbers with a leading zero.
 */
function updateCountdownDisplay() {
  const hrs  = Math.floor(countdownSeconds / 3600);
  const mins = Math.floor((countdownSeconds % 3600) / 60);
  const secs = countdownSeconds % 60;

  // Helper: pad to 2 digits
  const pad = n => String(n).padStart(2, '0');

  const hEl = document.getElementById('timerHrs');
  const mEl = document.getElementById('timerMins');
  const sEl = document.getElementById('timerSecs');

  if (hEl) hEl.textContent = pad(hrs);
  if (mEl) mEl.textContent = pad(mins);
  if (sEl) sEl.textContent = pad(secs);
}

/**
 * Placeholder scroll handler for the flash sale arrow buttons.
 * On mobile/overflow layouts this would scroll the grid.
 * Currently just shows a toast since grid is CSS-responsive.
 * @param {number} direction - -1 for left, +1 for right
 */
function scrollFlash(direction) {
  const grid = document.getElementById('flashProductsGrid');
  if (!grid) return;

  // Scroll the flash products container horizontally on small screens
  grid.scrollBy({ left: direction * 260, behavior: 'smooth' });
}

/* ================================================================
   7. CATEGORY SECTION — Filter Handler
================================================================ */

/**
 * Handles category card clicks.
 * Highlights the selected category card and shows a toast
 * indicating which category was selected.
 * In a full implementation this would filter the products grid.
 * @param {string} categoryName - Name of the selected category
 */
function filterCategory(categoryName) {
  // Remove active state from all category cards
  document.querySelectorAll('.cat-card').forEach(card => {
    card.classList.remove('active-cat');
  });

  // Add active state to the clicked card
  // Find the card whose label text matches the category name
  document.querySelectorAll('.cat-card').forEach(card => {
    const label = card.querySelector('.cat-label');
    if (label && label.textContent.trim().toLowerCase() === categoryName.toLowerCase()) {
      card.classList.add('active-cat');
    }
  });

  // Show feedback toast
  showToast(`Browsing: ${categoryName}`);

  // Scroll to best sellers section to show filtered products
  setTimeout(() => scrollToSection('bestsellers'), 600);
}

/* ================================================================
   8. REVIEWS SECTION — Render Cards
================================================================ */

/**
 * Generates HTML for a single review card.
 * Includes reviewer avatar, name, city, star rating,
 * review body text, and signed-by line.
 * @param {Object} review - Review data object from REVIEWS array
 * @returns {string} HTML string for the review card
 */
function createReviewCardHTML(review) {
  const stars = generateStarHTML(review.rating);

  return `
    <div class="review-card animate-on-scroll">
      <div class="reviewer-info">
        <img
          src="${review.avatar}"
          alt="${review.name}"
          class="reviewer-avatar"
          loading="lazy"
        />
        <div>
          <p class="reviewer-name">${review.name}</p>
          <p class="reviewer-location">${review.city}</p>
        </div>
      </div>
      <div class="review-stars">${stars}</div>
      <p class="review-text">${review.text}</p>
      <p class="review-sig">Signed by: ${review.name}, ${review.city}</p>
    </div>
  `;
}

/**
 * Renders all review cards into the reviews grid container.
 */
function renderReviews() {
  const grid = document.querySelector('.reviews-grid');
  if (!grid) return;

  grid.innerHTML = REVIEWS.map(createReviewCardHTML).join('');
  observeAnimations();
}

/* ================================================================
   9. CART OPERATIONS — Add, Remove, Update Qty
================================================================ */

/**
 * Adds a product to the shopping cart.
 * If the item already exists in the cart, increments its quantity.
 * Shows an "ADDED!" flash on the button and a toast notification.
 *
 * @param {string} name    - Product display name
 * @param {number} price   - Product price (number)
 * @param {string} image   - Product image path
 * @param {string} sku     - Product SKU code
 * @param {string} color   - Product color/variant
 * @param {number|string} id - Unique product ID
 */
function addToCart(name, price, image = 'best_seller.png', sku = 'AL-001', color = 'Default', id = Date.now()) {
  // Check if item already in cart
  const existing = cart.find(item => item.id === id);

  if (existing) {
    // Increment quantity if already present
    existing.qty++;
  } else {
    // Add new item to cart array
    cart.push({ id, name, price, image, sku, color, qty: 1 });
  }

  saveCartToStorage();
  updateCartBadge();
  showToast(`✓ ${name} added to cart`);

  // Flash "ADDED!" text on the button that was clicked
  const btn = document.getElementById(`btn-${id}`);
  if (btn) {
    showAddedFlash(btn);
  }
}

/**
 * Shows a temporary "ADDED!" overlay flash on a button element.
 * Animates and self-removes after 1.5 seconds.
 * @param {HTMLElement} btn - The button element to flash on
 */
function showAddedFlash(btn) {
  // Prevent duplicate flashes
  if (btn.querySelector('.added-flash')) return;

  const flash = document.createElement('div');
  flash.className = 'added-flash';
  flash.textContent = 'ADDED!';
  btn.style.position = 'relative';
  btn.appendChild(flash);

  // Remove after animation completes (1.5s)
  setTimeout(() => {
    if (flash.parentNode) flash.parentNode.removeChild(flash);
  }, 1500);
}

/**
 * Removes an item from the cart by its ID.
 * Re-renders the cart modal after removal.
 * @param {number|string} itemId - The cart item ID to remove
 */
function removeFromCart(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  saveCartToStorage();
  updateCartBadge();
  renderCartModal();
  showToast('Item removed from cart');
}

/**
 * Updates the quantity of a cart item.
 * Removes the item if quantity drops to 0 or below.
 * @param {number|string} itemId - Cart item ID to update
 * @param {number} delta         - Amount to change quantity by (+1 or -1)
 */
function updateQty(itemId, delta) {
  const item = cart.find(i => i.id === itemId);
  if (!item) return;

  item.qty += delta;

  if (item.qty <= 0) {
    // Remove item if quantity reaches zero
    removeFromCart(itemId);
    return;
  }

  saveCartToStorage();
  updateCartBadge();
  renderCartModal();        // Refresh cart UI
}

/**
 * Calculates the subtotal of all cart items.
 * @returns {number} Total price before tax and shipping
 */
function getCartSubtotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

/**
 * Renders the cart modal with current cart items and order summary.
 * If cart is empty, shows an empty state message.
 */
function renderCartModal() {
  const listEl       = document.getElementById('cartItemsList');
  const countEl      = document.getElementById('cartItemCount');
  const subtotalEl   = document.getElementById('summarySubtotal');
  const taxEl        = document.getElementById('summaryTax');

  if (!listEl) return;

  // Update item count in modal title
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  if (countEl) countEl.textContent = totalItems;

  // Calculate financials
  const subtotal = getCartSubtotal();
  const tax      = subtotal * 0.06;

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (taxEl)      taxEl.textContent      = `$${tax.toFixed(2)}`;

  // Render empty state or item list
  if (cart.length === 0) {
    listEl.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    return;
  }

  listEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" />
      <div class="cart-item-info">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-sku">SKU: ${item.sku} | Color: ${item.color}</p>
        <div class="qty-controls">
          <button class="qty-btn" onclick="updateQty(${item.id}, -1)">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${item.id}, +1)">+</button>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${item.id})">
          <i class="fas fa-trash-alt"></i> Remove
        </button>
      </div>
      <span class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</span>
    </div>
  `).join('');
}

/**
 * Handles coupon code application.
 * In a real implementation this would validate against a backend.
 * For demo purposes, shows a toast message.
 */
function applyCoupon() {
  const code = document.getElementById('couponInput')?.value.trim();
  if (!code) {
    showToast('Please enter a coupon code');
    return;
  }

  // Demo: accept "LUXE10" for a 10% discount message
  if (code.toUpperCase() === 'LUXE10') {
    showToast('✓ Coupon applied! 10% discount');
  } else {
    showToast('Invalid coupon code');
  }
}

/* ================================================================
   10. CHECKOUT FLOW
================================================================ */

/**
 * Proceeds from the cart modal to the checkout modal.
 * Validates that the cart is not empty before proceeding.
 */
function proceedToCheckout() {
  if (cart.length === 0) {
    showToast('Your cart is empty!');
    return;
  }

  // Close cart and open checkout
  closeModal('cartModal');
  setTimeout(() => openModal('checkoutModal'), 200);
}

/**
 * Renders the checkout modal's order summary panel
 * with current cart items and calculated totals.
 */
function renderCheckoutModal() {
  const itemsEl    = document.getElementById('checkoutItems');
  const subtotalEl = document.getElementById('coSubtotal');
  const taxEl      = document.getElementById('coTax');
  const totalEl    = document.getElementById('coTotal');

  const subtotal = getCartSubtotal();
  const shipping = 15.00;
  const tax      = subtotal * 0.06;
  const total    = subtotal + shipping + tax;

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (taxEl)      taxEl.textContent      = `$${tax.toFixed(2)}`;
  if (totalEl)    totalEl.textContent    = `$${total.toFixed(2)}`;

  // Render mini item list in checkout summary
  if (itemsEl) {
    itemsEl.innerHTML = cart.map(item => `
      <div class="checkout-item">
        <div class="checkout-item-left">
          <span class="checkout-item-name">${item.name}</span>
          <span class="checkout-item-sku">SKU: ${item.sku} | Color: ${item.color}</span>
        </div>
        <span class="checkout-item-price">$${(item.price * item.qty).toFixed(2)}</span>
      </div>
    `).join('');
  }
}

/* ================================================================
   11. ORDER PLACEMENT
================================================================ */

/**
 * Handles the "Place Order" button click.
 * In production this would send order data to the backend API.
 * For demo: clears cart, closes modal, and shows success toast.
 */
function placeOrder() {
  // Demo: simulate successful order placement
  cart = [];
  saveCartToStorage();
  updateCartBadge();
  closeAllModals();

  showToast('🎉 Order placed successfully! Thank you for shopping with Aurora Luxe.');
}

/* ================================================================
   12. AUTHENTICATION HANDLERS (Demo)
================================================================ */

/**
 * Handles the login form submission.
 * Demo implementation — shows a success toast and closes modal.
 * In production, this would POST credentials to an auth endpoint.
 */
function handleLogin() {
  // In production: validate fields, call auth API, store token
  closeModal('loginModal');
  showToast('✓ Welcome back to Aurora Luxe!');
}

/**
 * Handles the sign-up form submission.
 * Demo implementation — shows a success toast and closes modal.
 * In production, this would POST registration data to an API.
 */
function handleSignup() {
  // In production: validate fields, call registration API
  closeModal('signupModal');
  showToast('✓ Account created! Welcome to Aurora Luxe.');
}

/* ================================================================
   13. SEARCH HANDLER
================================================================ */

/**
 * Handles the search bar submission.
 * Reads the search input value and shows a toast with the query.
 * In production, this would navigate to a search results page.
 */
function handleSearch() {
  const query = document.getElementById('searchInput')?.value.trim();
  if (!query) return;

  showToast(`Searching for: "${query}"`);

  // In production: window.location.href = `/search?q=${encodeURIComponent(query)}`;
}

/**
 * Listens for Enter key press in the search input field
 * and triggers handleSearch() on Enter.
 * @param {KeyboardEvent} event - The keydown event
 */
function handleSearchKeydown(event) {
  if (event.key === 'Enter') handleSearch();
}

/* ================================================================
   14. TOAST NOTIFICATIONS
================================================================ */

/** Stores the timeout ID for auto-hiding the toast */
let toastTimeout = null;

/**
 * Displays a brief toast notification at the bottom of the screen.
 * Auto-hides after 3 seconds. Clears any previous toast timeout.
 * @param {string} message - The message to display in the toast
 */
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  // Clear any pending hide timeout
  if (toastTimeout) clearTimeout(toastTimeout);

  toast.textContent = message;
  toast.style.display = 'block';

  // Hide the toast after 3 seconds
  toastTimeout = setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}

/* ================================================================
   15. SCROLL ANIMATIONS (IntersectionObserver)
================================================================ */

/**
 * Sets up IntersectionObserver to animate elements as they scroll
 * into the viewport. Elements with class 'animate-on-scroll' will
 * have 'visible' class added when they enter the viewport.
 * This triggers the CSS fade-up animation defined in style.css.
 */
function observeAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after animation to save resources
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,      // Trigger when 12% of element is visible
      rootMargin: '0px 0px -40px 0px', // Slightly before fully in view
    }
  );

  // Observe all elements with the animation class
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

/* ================================================================
   16. WISHLIST TOGGLE
================================================================ */

/**
 * In-memory wishlist set storing product IDs.
 * Persisted in localStorage.
 */
let wishlist = loadWishlistFromStorage();

/**
 * Loads wishlist from localStorage.
 * @returns {Set} Set of wishlisted product IDs
 */
function loadWishlistFromStorage() {
  try {
    const stored = localStorage.getItem('auroraluxe_wishlist');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch (e) {
    return new Set();
  }
}

/**
 * Saves current wishlist to localStorage.
 */
function saveWishlistToStorage() {
  try {
    localStorage.setItem('auroraluxe_wishlist', JSON.stringify([...wishlist]));
  } catch (e) {
    console.error('Failed to save wishlist:', e);
  }
}

/**
 * Toggles a product's wishlist status.
 * Updates the heart button appearance and shows a toast.
 * @param {number} productId   - ID of the product to toggle
 * @param {Event}  event       - Click event (to prevent card click)
 */
function toggleWishlist(productId, event) {
  // Prevent the click from bubbling up to the product card
  if (event) event.stopPropagation();

  const btn = document.getElementById(`wish-${productId}`);

  if (wishlist.has(productId)) {
    // Remove from wishlist
    wishlist.delete(productId);
    if (btn) btn.classList.remove('active');
    showToast('Removed from wishlist');
  } else {
    // Add to wishlist
    wishlist.add(productId);
    if (btn) btn.classList.add('active');
    showToast('✓ Added to wishlist');
  }

  saveWishlistToStorage();
}

/**
 * Restores wishlist button states on page load
 * based on stored wishlist data.
 */
function restoreWishlistStates() {
  wishlist.forEach(id => {
    const btn = document.getElementById(`wish-${id}`);
    if (btn) btn.classList.add('active');
  });
}

/* ================================================================
   17. UTILITY HELPERS
================================================================ */

/**
 * Generates HTML star icons (★) for a given rating.
 * Renders filled stars for full rating, empty stars for the rest.
 * Maximum 5 stars.
 * @param {number} rating - Numeric rating (e.g. 4.8)
 * @returns {string} HTML string of star icons
 */
function generateStarHTML(rating) {
  const fullStars  = Math.floor(rating);
  const emptyStars = 5 - fullStars;

  let html = '';

  // Add filled (gold) stars
  for (let i = 0; i < fullStars; i++) {
    html += '<i class="fas fa-star"></i>';
  }

  // Add empty stars
  for (let i = 0; i < emptyStars; i++) {
    html += '<i class="far fa-star"></i>';
  }

  // Append numeric rating value
  html += ` <span style="color:var(--gray-mid)">${rating}</span>`;

  return html;
}

/* ================================================================
   18. INITIALIZATION — DOMContentLoaded
================================================================ */

/**
 * Main initialization function.
 * Called when the DOM is fully parsed and ready.
 * Sets up all event listeners, renders dynamic content,
 * starts timers, and initializes observers.
 */
document.addEventListener('DOMContentLoaded', () => {

  /* —— Render all dynamic sections —— */
  renderBestSellers();     // Inject product cards into best sellers grid
  renderFlashProducts();   // Inject flash sale product cards
  renderReviews();         // Inject client review cards

  /* —— Start the flash sale countdown timer —— */
  startCountdown();

  /* —— Update cart badge from stored cart data —— */
  updateCartBadge();

  /* —— Restore wishlist button states —— */
  restoreWishlistStates();

  /* —— Scroll event listeners —— */
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  /* —— Search: listen for Enter key on search input —— */
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keydown', handleSearchKeydown);
  }

  /* —— Keyboard accessibility: close modals on Escape key —— */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  /* —— Close mobile nav when clicking outside of it —— */
  document.addEventListener('click', (e) => {
    const navLinks   = document.getElementById('navLinks');
    const hamburger  = document.getElementById('hamburger');

    if (
      navLinks &&
      navLinks.classList.contains('mobile-open') &&
      !navLinks.contains(e.target) &&
      e.target !== hamburger &&
      !hamburger.contains(e.target)
    ) {
      navLinks.classList.remove('mobile-open');
    }
  });

  /* —— Initialize scroll animations for static elements —— */
  observeAnimations();

  /* —— Nav link smooth scroll for anchor hrefs —— */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const navbarH = document.getElementById('navbar').offsetHeight;
          const top = target.getBoundingClientRect().top + window.scrollY - navbarH - 10;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  console.log('%c✨ Aurora Luxe loaded successfully', 'color:#c9a84c;font-weight:bold;font-size:14px;');
});

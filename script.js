// Product Data
const products = [
    {
        id: 1,
        title: "Wireless Bluetooth Headphones",
        price: 59.99,
        image: "https://via.placeholder.com/300x300?text=Headphones",
        rating: 4,
        category: "Electronics"
    },
    {
        id: 2,
        title: "Smart Watch with Fitness Tracker",
        price: 89.99,
        image: "https://via.placeholder.com/300x300?text=Smart+Watch",
        rating: 5,
        category: "Electronics"
    },
    {
        id: 3,
        title: "Organic Cotton T-Shirt",
        price: 19.99,
        image: "https://via.placeholder.com/300x300?text=T-Shirt",
        rating: 4,
        category: "Fashion"
    },
    {
        id: 4,
        title: "Stainless Steel Water Bottle",
        price: 24.99,
        image: "https://via.placeholder.com/300x300?text=Water+Bottle",
        rating: 5,
        category: "Home"
    },
    {
        id: 5,
        title: "Bestseller Novel - Paperback Edition",
        price: 12.99,
        image: "https://via.placeholder.com/300x300?text=Book",
        rating: 4,
        category: "Books"
    },
    {
        id: 6,
        title: "Wireless Charging Pad",
        price: 29.99,
        image: "https://via.placeholder.com/300x300?text=Charging+Pad",
        rating: 3,
        category: "Electronics"
    },
    {
        id: 7,
        title: "Ceramic Coffee Mug Set",
        price: 18.99,
        image: "https://via.placeholder.com/300x300?text=Coffee+Mugs",
        rating: 4,
        category: "Home"
    },
    {
        id: 8,
        title: "Running Shoes",
        price: 79.99,
        image: "https://via.placeholder.com/300x300?text=Running+Shoes",
        rating: 5,
        category: "Fashion"
    }
];

// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartIcon = document.getElementById('cart-icon');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const closeCart = document.getElementById('close-cart');
const cartItems = document.getElementById('cart-items');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartCount = document.querySelector('.cart-count');

// Cart State
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the app
function init() {
    renderProducts();
    updateCart();
    setupEventListeners();
}

// Render products to the page
function renderProducts() {
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <h3 class="product-title">${product.title}</h3>
            <div class="product-rating">
                ${renderRating(product.rating)}
            </div>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <button class="product-btn" data-id="${product.id}">Add to Cart</button>
        `;
        productGrid.appendChild(productCard);
    });
}

// Render star rating
function renderRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Setup event listeners
function setupEventListeners() {
    // Cart toggle
    cartIcon.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);
    
    // Add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('product-btn')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        }
        
        // Quantity changes
        if (e.target.classList.contains('quantity-btn')) {
            const itemId = parseInt(e.target.closest('.cart-item').getAttribute('data-id'));
            const isIncrease = e.target.classList.contains('increase');
            updateQuantity(itemId, isIncrease);
        }
        
        // Remove item
        if (e.target.classList.contains('remove-item')) {
            const itemId = parseInt(e.target.closest('.cart-item').getAttribute('data-id'));
            removeFromCart(itemId);
        }
    });
    
    // Search functionality
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// Toggle cart visibility
function toggleCart() {
    cartSidebar.classList.toggle('open');
    cartOverlay.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCart();
    showAddedToCart(product.title);
}

// Show "added to cart" notification
function showAddedToCart(productTitle) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>Added ${productTitle} to your cart</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Update quantity of cart item
function updateQuantity(productId, isIncrease) {
    const item = cart.find(item => item.id === productId);
    
    if (isIncrease) {
        item.quantity += 1;
    } else {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            removeFromCart(productId);
            return;
        }
    }
    
    updateCart();
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Update cart UI and localStorage
function updateCart() {
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartSubtotal.textContent = '$0.00';
        return;
    }
    
    cartItems.innerHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.setAttribute('data-id', item.id);
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="cart-item-img">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.title}</h4>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease">-</button>
                    <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                    <button class="quantity-btn increase">+</button>
                </div>
                <span class="remove-item">Remove</span>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    // Update subtotal
    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
}

// Search functionality
function performSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchTerm = searchInput.value.toLowerCase();
    const categorySelect = document.querySelector('.search-select');
    const category = categorySelect.value;
    
    let filteredProducts = products;
    
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product => 
            product.title.toLowerCase().includes(searchTerm)
        );
    }
    
    if (category !== 'All') {
        filteredProducts = filteredProducts.filter(product => 
            product.category === category
        );
    }
    
    renderFilteredProducts(filteredProducts);
}

// Render filtered products
function renderFilteredProducts(filteredProducts) {
    productGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = '<p class="no-results">No products found matching your search.</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <h3 class="product-title">${product.title}</h3>
            <div class="product-rating">
                ${renderRating(product.rating)}
            </div>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <button class="product-btn" data-id="${product.id}">Add to Cart</button>
        `;
        productGrid.appendChild(productCard);
    });
}

// Initialize the app
init();

// Hero slider (simple implementation)
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

// Auto-advance slides every 5 seconds
setInterval(nextSlide, 5000);
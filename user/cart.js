// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];  // Initialize cart from localStorage
updateCartCount();

function clearCart() {
    cart = [];
    localStorage.removeItem('cart');
    updateCartDisplay();
    updateCartCount();
}

// Clear cart immediately
// clearCart();

// Remove duplicates and keep only one instance with updated quantity
function removeDuplicates() {
    const uniqueItems = {};
    cart.forEach(item => {
        if (uniqueItems[item.id]) {
            uniqueItems[item.id].quantity += item.quantity;
        } else {
            uniqueItems[item.id] = { ...item };
        }
    });
    cart = Object.values(uniqueItems);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    updateCartCount();
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(product);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show confirmation message
    showMessage('Item added to cart!');
}

function buyNow(product) {
    // Add to cart first
    addToCart(product);
    
    // Show message and redirect to cart
    showMessage('Item added to cart! Redirecting to checkout...');
    setTimeout(() => {
        window.location.href = 'cart.html';
    }, 1500);
}

function showMessage(text) {
    const message = document.createElement('div');
    message.className = 'cart-message';
    message.textContent = text;
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 2000);
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

function updateCartDisplay() {
    const cartItems = document.querySelector('.cart-items');
    const subtotalElement = document.querySelector('.subtotal');
    const totalElement = document.querySelector('.total-amount');
    const shippingElement = document.querySelector('.shipping');

    if (!cartItems) return;

    cartItems.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        cartItems.innerHTML += `
            <div class="cart-item" data-id="${item.id}">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <div class="item-price">$${item.price.toFixed(2)}</div>
                    <div class="item-quantity">
                        <button class="quantity-btn minus" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-item" onclick="removeItem(${item.id})">Remove</button>
                </div>
            </div>
        `;
    });

    const shipping = subtotal > 0 ? 5.99 : 0;
    const total = subtotal + shipping;

    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    shippingElement.textContent = `$${shipping.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
}

function updateQuantity(itemId, change) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeItem(itemId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
            updateCartCount();
        }
    }
}

function removeItem(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    updateCartCount();
    
    // Show removal confirmation
    showMessage('Item removed from cart');
}

// Call removeDuplicates when the page loads
document.addEventListener('DOMContentLoaded', () => {
    removeDuplicates();
    updateCartDisplay();
    updateCartCount();
});

// Cart Page Functionality
document.addEventListener('DOMContentLoaded', () => {
    const cartItemsList = document.getElementById('cartItemsList');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const cartItemTemplate = document.getElementById('cartItemTemplate');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    // Get cart instance from script.js
    const cart = window.cart;

    function updateCartDisplay() {
        const items = cart.getItems();
        cartItemsList.innerHTML = '';
        
        if (items.length === 0) {
            emptyCartMessage.style.display = 'flex';
            cartItemsList.style.display = 'none';
            return;
        }

        emptyCartMessage.style.display = 'none';
        cartItemsList.style.display = 'block';

        items.forEach(item => {
            const cartItem = cartItemTemplate.content.cloneNode(true);
            
            // Set item details
            cartItem.querySelector('.item-name').textContent = item.name;
            cartItem.querySelector('.item-price').textContent = `$${item.price.toFixed(2)}`;
            cartItem.querySelector('.quantity-input').value = item.quantity;
            
            // Add event listeners
            const quantityInput = cartItem.querySelector('.quantity-input');
            const minusBtn = cartItem.querySelector('.minus');
            const plusBtn = cartItem.querySelector('.plus');
            const removeBtn = cartItem.querySelector('.remove-item');
            
            quantityInput.addEventListener('change', (e) => {
                const newQuantity = parseInt(e.target.value);
                if (newQuantity > 0) {
                    cart.updateQuantity(item.id, newQuantity);
                    updateCartTotals();
                }
            });

            minusBtn.addEventListener('click', () => {
                if (item.quantity > 1) {
                    cart.updateQuantity(item.id, item.quantity - 1);
                    updateCartDisplay();
                    updateCartTotals();
                }
            });

            plusBtn.addEventListener('click', () => {
                cart.updateQuantity(item.id, item.quantity + 1);
                updateCartDisplay();
                updateCartTotals();
            });

            removeBtn.addEventListener('click', () => {
                cart.removeItem(item.id);
                updateCartDisplay();
                updateCartTotals();
            });

            cartItemsList.appendChild(cartItem);
        });

        updateCartTotals();
    }

    function updateCartTotals() {
        const subtotal = cart.getTotal();
        const shipping = subtotal > 0 ? 5.00 : 0;
        const tax = subtotal * 0.10; // 10% tax
        const total = subtotal + shipping + tax;

        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        taxElement.textContent = `$${tax.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;

        // Enable/disable checkout button
        checkoutBtn.disabled = subtotal === 0;
    }

    // Initialize cart display
    updateCartDisplay();

    // Checkout button click handler
    checkoutBtn.addEventListener('click', () => {
        if (cart.getTotal() > 0) {
            alert('Proceeding to checkout... (This is a demo)');
            // Here you would typically redirect to a checkout page
            // window.location.href = '/checkout';
        }
    });
});

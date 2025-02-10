// Cart functionality
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartCount();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Add to cart button click
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart-btn')) {
                const button = e.target.closest('.add-to-cart-btn');
                const productId = button.dataset.productId;
                const productName = button.dataset.productName;
                const productPrice = parseFloat(button.dataset.productPrice);
                
                this.addItem({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    quantity: 1
                });
            }
        });

        // Update cart icon in navbar
        const cartLink = document.querySelector('.nav-icons a[href="/cart"]');
        if (cartLink && !cartLink.querySelector('.cart-count')) {
            const cartCount = document.createElement('span');
            cartCount.className = 'cart-count';
            cartCount.textContent = '0';
            cartLink.appendChild(cartCount);
        }
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push(product);
        }

        this.saveCart();
        this.updateCartCount();
        this.showNotification('Item added to cart!');
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                this.removeItem(productId);
            }
        }
        this.saveCart();
        this.updateCartCount();
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = this.getItemCount();
            cartCount.style.display = this.getItemCount() > 0 ? 'block' : 'none';
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    showNotification(message) {
        const notification = document.getElementById('cartNotification');
        notification.textContent = message;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
    }

    getItems() {
        return this.items;
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartCount();
    }
}

// Initialize cart when page loads
const cart = new ShoppingCart();

// Optional: Add to window object if you need to access it globally
window.cart = cart;

// Video functionality
document.addEventListener('DOMContentLoaded', function() {
    // Handle video click events
    const videos = document.querySelectorAll('.post-video');
    
    videos.forEach(video => {
        // Click to play/pause
        video.addEventListener('click', function() {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });

        // Add play/pause indicator
        const indicator = document.createElement('div');
        indicator.className = 'video-play-indicator';
        indicator.innerHTML = '<i class="fas fa-play"></i>';
        indicator.style.display = 'none';
        video.parentElement.appendChild(indicator);

        // Show/hide play indicator
        video.addEventListener('play', () => {
            indicator.style.display = 'none';
        });

        video.addEventListener('pause', () => {
            indicator.style.display = 'flex';
        });

        // Handle video visibility
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    // Play video when it becomes visible
                    if (entry.isIntersecting) {
                        video.play();
                    } else {
                        video.pause();
                    }
                });
            },
            { threshold: 0.5 }
        );

        observer.observe(video);
    });
});

// Video action buttons functionality
document.addEventListener('DOMContentLoaded', function() {
    // Handle like button
    document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent video play/pause
            button.classList.toggle('active');
            const countSpan = button.parentElement.querySelector('.action-count');
            let count = parseFloat(countSpan.textContent);
            if (button.classList.contains('active')) {
                countSpan.textContent = ((count + 0.1).toFixed(1)) + 'K';
            } else {
                countSpan.textContent = ((count - 0.1).toFixed(1)) + 'K';
            }
        });
    });

    // Handle bookmark button
    document.querySelectorAll('.bookmark-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent video play/pause
            button.classList.toggle('active');
            const countSpan = button.parentElement.querySelector('.action-count');
            let count = parseInt(countSpan.textContent);
            if (button.classList.contains('active')) {
                countSpan.textContent = count + 1;
            } else {
                countSpan.textContent = count - 1;
            }
        });
    });

    // Handle share button
    document.querySelectorAll('.share-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent video play/pause
            
            // Remove any existing share menus
            document.querySelectorAll('.share-menu').forEach(menu => menu.remove());
            
            // Create share menu
            const shareMenu = document.createElement('div');
            shareMenu.className = 'share-menu';
            shareMenu.innerHTML = `
                <div class="share-option" data-platform="facebook">
                    <i class="fab fa-facebook"></i> Facebook
                </div>
                <div class="share-option" data-platform="twitter">
                    <i class="fab fa-twitter"></i> Twitter
                </div>
                <div class="share-option" data-platform="whatsapp">
                    <i class="fab fa-whatsapp"></i> WhatsApp
                </div>
                <div class="share-option" data-platform="copy">
                    <i class="fas fa-link"></i> Copy Link
                </div>
            `;
            
            // Add the menu to the button's parent
            button.parentElement.appendChild(shareMenu);
            
            // Handle clicking outside the menu
            const closeMenu = (e) => {
                if (!shareMenu.contains(e.target) && !button.contains(e.target)) {
                    shareMenu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            };
            
            // Delay adding the click listener to prevent immediate closure
            setTimeout(() => {
                document.addEventListener('click', closeMenu);
            }, 0);
            
            // Handle share options
            shareMenu.querySelectorAll('.share-option').forEach(option => {
                option.addEventListener('click', function() {
                    const platform = this.dataset.platform;
                    const videoUrl = window.location.href;
                    
                    switch(platform) {
                        case 'facebook':
                            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoUrl)}`);
                            break;
                        case 'twitter':
                            window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(videoUrl)}`);
                            break;
                        case 'whatsapp':
                            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(videoUrl)}`);
                            break;
                        case 'copy':
                            navigator.clipboard.writeText(videoUrl).then(() => {
                                const countSpan = button.parentElement.querySelector('.action-count');
                                let count = parseInt(countSpan.textContent);
                                countSpan.textContent = count + 1;
                                alert('Link copied to clipboard!');
                            });
                            break;
                    }
                    shareMenu.remove();
                });
            });
        });
    });
});

// Logout functionality
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Show confirmation dialog
            const confirmLogout = confirm('Are you sure you want to logout?');
            
            if (confirmLogout) {
                // Clear any stored user data
                localStorage.removeItem('user');
                localStorage.removeItem('cart');
                localStorage.removeItem('token');
                
                // Redirect to login page
                window.location.href = '../login/login.html';
            }
        });
    }
});

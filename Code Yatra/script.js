document.addEventListener('DOMContentLoaded', () => {
    // Sample product data
    const products = [
        {
            id: 1,
            url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-modelling-a-leather-jacket-854-large.mp4',
            businessName: '@fashionstore',
            productName: 'Premium Leather Jacket',
            description: '🔥 High-quality genuine leather jacket, perfect for all seasons! #fashion #style',
            price: 299.99,
            likes: '45.2K',
            rating: 4.8,
            inStock: true,
            freeShipping: true
        },
        // Add more product objects as needed
    ];

    // Initialize video feed
    const videoFeed = document.querySelector('.video-feed');
    
    // Function to create video element
    function createVideoElement(productData) {
        const videoContainer = document.createElement('div');
        videoContainer.className = 'video-container';
        
        videoContainer.innerHTML = `
            <div class="video-player">
                <video src="${productData.url}" loop></video>
                <div class="product-overlay">
                    <div class="product-quick-view">
                        <h3>${productData.productName}</h3>
                        <p class="price">$${productData.price.toFixed(2)}</p>
                        <button class="quick-add-cart" data-product-id="${productData.id}">Add to Cart</button>
                    </div>
                </div>
                <div class="video-actions">
                    <div class="action-button">
                        <i class="fas fa-heart"></i>
                        <span>${productData.likes}</span>
                    </div>
                    <div class="action-button">
                        <i class="fas fa-shopping-bag"></i>
                        <span>Shop Now</span>
                    </div>
                    <div class="action-button">
                        <i class="fas fa-share"></i>
                        <span>Share</span>
                    </div>
                </div>
            </div>
            <div class="video-info">
                <div class="business-info">
                    <img src="https://via.placeholder.com/40" alt="Business" class="business-avatar">
                    <div class="business-details">
                        <div class="business-name">${productData.businessName}</div>
                        <div class="business-rating">
                            <i class="fas fa-star"></i>
                            <span>${productData.rating}</span>
                        </div>
                    </div>
                    <button class="follow-btn">Follow</button>
                </div>
                <div class="product-info">
                    <h3>${productData.productName}</h3>
                    <p class="product-description">${productData.description}</p>
                    <div class="product-meta">
                        <span class="stock-status">${productData.inStock ? 'In Stock' : 'Out of Stock'}</span>
                        ${productData.freeShipping ? '<span class="delivery-info">Free Shipping</span>' : ''}
                    </div>
                </div>
            </div>
        `;

        return videoContainer;
    }

    // Add products to feed
    products.forEach(product => {
        const videoElement = createVideoElement(product);
        videoFeed.appendChild(videoElement);
    });

    // Shopping Cart Management
    let cart = [];
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartItems = document.querySelector('.cart-items');
    const totalAmount = document.querySelector('.total-amount');

    // Toggle cart sidebar
    document.querySelector('.fa-shopping-cart').parentElement.addEventListener('click', () => {
        cartSidebar.classList.toggle('active');
    });

    document.querySelector('.close-cart').addEventListener('click', () => {
        cartSidebar.classList.remove('active');
    });

    // Add to cart functionality
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('quick-add-cart')) {
            const productId = parseInt(e.target.dataset.productId);
            const product = products.find(p => p.id === productId);
            
            if (product) {
                addToCart(product);
                updateCartUI();
                cartSidebar.classList.add('active');
            }
        }
    });

    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.productName,
                price: product.price,
                quantity: 1
            });
        }
    }

    function updateCartUI() {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <button class="remove-item" data-product-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalAmount.textContent = `$${total.toFixed(2)}`;
    }

    // Handle video playback
    const videoPlayers = document.querySelectorAll('video');
    videoPlayers.forEach(video => {
        video.addEventListener('click', () => {
            if (video.paused) {
                // Pause all other videos
                videoPlayers.forEach(v => v.pause());
                video.play();
            } else {
                video.pause();
            }
        });
    });

    // Handle like button interactions
    const likeButtons = document.querySelectorAll('.fa-heart');
    likeButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('active');
            if (button.classList.contains('active')) {
                button.style.color = '#fe2c55';
            } else {
                button.style.color = '#fff';
            }
        });
    });

    // Handle follow button interactions
    const followButtons = document.querySelectorAll('.follow-btn');
    followButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.textContent === 'Follow') {
                button.textContent = 'Following';
                button.style.backgroundColor = '#2f2f2f';
            } else {
                button.textContent = 'Follow';
                button.style.backgroundColor = '#fe2c55';
            }
        });
    });

    // Category filtering
    const categoryTags = document.querySelectorAll('.category-tag');
    categoryTags.forEach(tag => {
        tag.addEventListener('click', () => {
            // Remove active class from all tags
            categoryTags.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tag
            tag.classList.add('active');
            // Filter products (to be implemented with backend)
            console.log(`Filtering by category: ${tag.textContent}`);
        });
    });

    // Initialize checkout button
    document.querySelector('.checkout-btn').addEventListener('click', () => {
        if (cart.length > 0) {
            // Implement checkout process
            console.log('Proceeding to checkout with items:', cart);
        } else {
            alert('Your cart is empty!');
        }
    });

    // Mobile menu functionality
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    function toggleSidebar() {
        sidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    }

    menuToggle.addEventListener('click', toggleSidebar);
    sidebarOverlay.addEventListener('click', toggleSidebar);

    // Close sidebar on window resize if it's open
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && sidebar.classList.contains('active')) {
            toggleSidebar();
        }
    });
});

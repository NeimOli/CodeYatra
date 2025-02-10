// Sample data
const suggestedAccounts = [
    { username: 'fashion_store', followers: '500K', image: 'https://via.placeholder.com/50' },
    { username: 'tech_gadgets', followers: '300K', image: 'https://via.placeholder.com/50' },
    { username: 'beauty_shop', followers: '200K', image: 'https://via.placeholder.com/50' },
];

const comments = [
    { username: 'user1', comment: 'Great product! Love it 😍', likes: 45, timestamp: '2h ago' },
    { username: 'user2', comment: 'How much is this?', likes: 23, timestamp: '1h ago' },
    { username: 'user3', comment: 'Available in black?', likes: 12, timestamp: '30m ago' },
];

// Sample product data (in a real app, this would come from a database)
const products = [
    {
        id: 1,
        name: "Trendy T-Shirt",
        price: 29.99,
        image: "https://via.placeholder.com/300",
        likes: 100000,
        comments: 1200,
        shares: 500
    },
    // Add more products as needed
];

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadSuggestedAccounts();
    loadComments();
    initializeVideoControls();
    initializeCommentInput();
    initializeCategoryBar();
    initializeMobileInteractions();
    updateCartCount();
    displayProducts();
    setupVideoInteractions();

    // Add click handler for buy now/add to cart button
    const buyButton = document.querySelector('.buy-now');
    if (buyButton) {
        buyButton.addEventListener('click', () => {
            const currentVideo = document.querySelector('.video-container');
            const product = {
                id: Date.now(), // Using timestamp as temporary ID
                name: currentVideo.querySelector('h3').textContent,
                price: parseFloat(currentVideo.querySelector('p').textContent.replace('$', '')),
                image: currentVideo.querySelector('video').poster || 'https://via.placeholder.com/100'
            };
            addToCart(product);
        });
    }

    // Add cart icon click handler
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'cart.html';
        });
    }
});

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show confirmation message
    const message = document.createElement('div');
    message.className = 'add-to-cart-message';
    message.textContent = 'Added to cart!';
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 2000);
}

function buyNow(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += product.quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: product.quantity
        });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show confirmation message
    const message = document.createElement('div');
    message.className = 'add-to-cart-message';
    message.textContent = 'Added to cart!';
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 2000);
}

// Initialize mobile interactions
function initializeMobileInteractions() {
    const commentBtn = document.querySelector('.comment-btn');
    const commentsSection = document.querySelector('.comments-section');
    const profileIcon = document.querySelector('.profile-icon');
    const leftSidebar = document.querySelector('.left-sidebar');

    // Show/hide comments section
    commentBtn.addEventListener('click', () => {
        commentsSection.classList.toggle('active');
    });

    // Show/hide profile sidebar
    profileIcon.addEventListener('click', (e) => {
        e.preventDefault();
        leftSidebar.classList.toggle('active');
    });

    // Handle touch swipe
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeLength = touchEndX - touchStartX;

        if (Math.abs(swipeLength) > swipeThreshold) {
            if (swipeLength > 0) {
                // Swipe right - show left sidebar
                leftSidebar.classList.add('active');
            } else {
                // Swipe left - hide sidebars
                leftSidebar.classList.remove('active');
                commentsSection.classList.remove('active');
            }
        }
    }
}

// Initialize category bar
function initializeCategoryBar() {
    const categoryItems = document.querySelectorAll('.category-item');

    categoryItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            categoryItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            console.log('Selected category:', item.textContent);
        });
    });
}

// Load suggested accounts
function loadSuggestedAccounts() {
    const accountList = document.querySelector('.account-list');
    suggestedAccounts.forEach(account => {
        const accountElement = document.createElement('div');
        accountElement.className = 'suggested-account';
        accountElement.innerHTML = `
            <img src="${account.image}" alt="${account.username}">
            <div class="account-info">
                <h5>@${account.username}</h5>
                <span>${account.followers} followers</span>
            </div>
        `;
        accountList.appendChild(accountElement);
    });
}

// Load comments
function loadComments() {
    const commentsList = document.querySelector('.comments-list');
    comments.forEach(comment => {
        const commentElement = createCommentElement(comment);
        commentsList.appendChild(commentElement);
    });
}

// Create comment element
function createCommentElement(comment) {
    const div = document.createElement('div');
    div.className = 'comment';
    div.innerHTML = `
        <div class="comment-header">
            <strong>@${comment.username}</strong>
            <span>${comment.timestamp}</span>
        </div>
        <p>${comment.comment}</p>
        <div class="comment-actions">
            <button class="like-comment">
                <i class="fas fa-heart"></i>
                <span>${comment.likes}</span>
            </button>
            <button class="reply-comment">Reply</button>
        </div>
    `;
    return div;
}

// Like/Dislike functionality
let clickTimer = null;
let likeStates = {};  // Store like states for videos

function handleVideoClick(videoContainer) {
    if (clickTimer === null) {
        clickTimer = setTimeout(() => {
            // Single click action (dislike)
            handleDislike(videoContainer);
            clickTimer = null;
        }, 200);
    } else {
        clearTimeout(clickTimer);
        clickTimer = null;
        // Double click action (like)
        handleLike(videoContainer);
    }
}

function handleLike(videoContainer) {
    const videoId = videoContainer.dataset.videoId || 'default';
    const likeBtn = videoContainer.querySelector('.like-btn i');
    const likeCount = videoContainer.querySelector('.like-count');
    
    // Show like animation
    showLikeAnimation(videoContainer);
    
    if (!likeStates[videoId]) {
        likeStates[videoId] = { liked: false, disliked: false };
    }

    if (!likeStates[videoId].liked) {
        likeBtn.style.color = 'var(--primary-color)';
        let currentLikes = parseInt(likeCount.textContent) || 0;
        likeCount.textContent = currentLikes + 1;
        likeStates[videoId].liked = true;
        
        // Remove dislike if present
        if (likeStates[videoId].disliked) {
            const dislikeBtn = videoContainer.querySelector('.dislike-btn i');
            const dislikeCount = videoContainer.querySelector('.dislike-count');
            dislikeBtn.style.color = '#666';
            let currentDislikes = parseInt(dislikeCount.textContent) || 0;
            if (currentDislikes > 0) dislikeCount.textContent = currentDislikes - 1;
            likeStates[videoId].disliked = false;
        }
    }
}

function handleDislike(videoContainer) {
    const videoId = videoContainer.dataset.videoId || 'default';
    const dislikeBtn = videoContainer.querySelector('.dislike-btn i');
    const dislikeCount = videoContainer.querySelector('.dislike-count');
    
    if (!likeStates[videoId]) {
        likeStates[videoId] = { liked: false, disliked: false };
    }

    if (!likeStates[videoId].disliked) {
        dislikeBtn.style.color = 'var(--primary-color)';
        let currentDislikes = parseInt(dislikeCount.textContent) || 0;
        dislikeCount.textContent = currentDislikes + 1;
        likeStates[videoId].disliked = true;
        
        // Remove like if present
        if (likeStates[videoId].liked) {
            const likeBtn = videoContainer.querySelector('.like-btn i');
            const likeCount = videoContainer.querySelector('.like-count');
            likeBtn.style.color = '#666';
            let currentLikes = parseInt(likeCount.textContent) || 0;
            if (currentLikes > 0) likeCount.textContent = currentLikes - 1;
            likeStates[videoId].liked = false;
        }
    }
}

function showLikeAnimation(videoContainer) {
    const heart = document.createElement('div');
    heart.className = 'heart-animation';
    heart.innerHTML = '<i class="fas fa-heart"></i>';
    videoContainer.appendChild(heart);
    
    // Remove the heart after animation
    setTimeout(() => {
        heart.remove();
    }, 1000);
}

// Initialize video interactions
function initializeVideoControls() {
    const videoContainers = document.querySelectorAll('.video-container');
    
    videoContainers.forEach(container => {
        // Add video ID if not present
        if (!container.dataset.videoId) {
            container.dataset.videoId = 'video-' + Math.random().toString(36).substr(2, 9);
        }
        
        // Add click handlers
        container.addEventListener('click', (e) => {
            // Ignore clicks on buttons and controls
            if (!e.target.closest('.video-actions') && !e.target.closest('.video-info')) {
                handleVideoClick(container);
            }
        });

        // Add manual like/dislike button handlers
        const likeBtn = container.querySelector('.like-btn');
        const dislikeBtn = container.querySelector('.dislike-btn');
        
        likeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleLike(container);
        });
        
        dislikeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleDislike(container);
        });
    });
}

// Initialize comment input
function initializeCommentInput() {
    const commentInput = document.querySelector('.comment-input input');
    const submitButton = document.querySelector('.comment-input button');

    submitButton.addEventListener('click', () => {
        const commentText = commentInput.value.trim();
        if (commentText) {
            const newComment = {
                username: 'you',
                comment: commentText,
                likes: 0,
                timestamp: 'Just now'
            };
            const commentElement = createCommentElement(newComment);
            document.querySelector('.comments-list').prepend(commentElement);
            commentInput.value = '';
        }
    });

    commentInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitButton.click();
        }
    });
}

function displayProducts() {
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = products.map(product => `
        <div class="video-container">
            <video src="sample-video.mp4" loop></video>
            <div class="video-info">
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
            </div>
            <div class="video-actions">
                <button class="like-btn">
                    <i class="fas fa-heart"></i>
                    <span>${formatNumber(product.likes)}</span>
                </button>
                <button class="comment-btn">
                    <i class="fas fa-comment"></i>
                    <span>${formatNumber(product.comments)}</span>
                </button>
                <button class="share-btn">
                    <i class="fas fa-share"></i>
                    <span>${formatNumber(product.shares)}</span>
                </button>
                <button class="save-btn">
                    <i class="fas fa-bookmark"></i>
                </button>
            </div>
            <div class="product-actions">
                <button class="buy-now-btn" onclick="buyNow({
                    id: ${product.id},
                    name: '${product.name}',
                    price: ${product.price},
                    image: '${product.image}',
                    quantity: 1
                })">
                    Buy Now
                </button>
            </div>
        </div>
    `).join('');
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function setupVideoInteractions() {
    const videos = document.querySelectorAll('.video-container video');
    videos.forEach(video => {
        video.addEventListener('click', () => {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });
    });
}

// Add logout function
function logout() {
    // Clear all user data from localStorage
    localStorage.clear();
    // Redirect to login page
    window.location.href = "../login/login.html";
}

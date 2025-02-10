// Sample data for demonstration
const dashboardData = {
    stats: {
        sales: { value: 12345, change: 15 },
        orders: { value: 150, change: 8 },
        products: { value: 45, change: 0 },
        customers: { value: 1234, change: 12 }
    },
    recentOrders: [
        { id: '#12345', customer: 'Alice Johnson', product: 'Trendy T-Shirt', amount: 29.99, status: 'pending' },
        { id: '#12344', customer: 'Bob Smith', product: 'Classic Sneakers', amount: 79.99, status: 'completed' },
        { id: '#12343', customer: 'Carol White', product: 'Stylish Jeans', amount: 49.99, status: 'shipped' }
    ],
    topProducts: [
        { name: 'Trendy T-Shirt', price: 29.99, sales: 123, stock: 45 },
        { name: 'Classic Sneakers', price: 79.99, sales: 89, stock: 34 },
        { name: 'Stylish Jeans', price: 49.99, sales: 78, stock: 56 }
    ]
};

// Update stats with animation
function updateStats() {
    Object.entries(dashboardData.stats).forEach(([key, data]) => {
        const element = document.querySelector(`.stat-card .stat-icon.${key}`);
        if (element) {
            const valueElement = element.parentElement.querySelector('.stat-value');
            const changeElement = element.parentElement.querySelector('.stat-change');
            
            // Animate the value
            const value = data.value;
            let currentValue = 0;
            const duration = 1000; // 1 second
            const steps = 60;
            const increment = value / steps;
            const interval = duration / steps;
            
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= value) {
                    currentValue = value;
                    clearInterval(timer);
                }
                valueElement.textContent = key === 'sales' ? 
                    `$${Math.floor(currentValue).toLocaleString()}` : 
                    Math.floor(currentValue).toLocaleString();
            }, interval);

            // Update change percentage
            const changeValue = data.change;
            const changeClass = changeValue > 0 ? 'positive' : changeValue < 0 ? 'negative' : 'neutral';
            const changeIcon = changeValue > 0 ? 'up' : changeValue < 0 ? 'down' : 'minus';
            changeElement.innerHTML = `${changeValue}% <i class="fas fa-arrow-${changeIcon}"></i>`;
            changeElement.className = `stat-change ${changeClass}`;
        }
    });
}

// Handle order actions
function handleOrderAction(orderId) {
    alert(`Viewing details for order ${orderId}`);
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    // Initialize stats with animation
    updateStats();

    // Add event listeners for nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('.nav-item.active').classList.remove('active');
            item.classList.add('active');
        });
    });

    // Add event listeners for action buttons
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const orderId = btn.closest('tr').querySelector('td').textContent;
            handleOrderAction(orderId);
        });
    });

    // Add event listener for notifications
    const notifications = document.querySelector('.notifications');
    if (notifications) {
        notifications.addEventListener('click', () => {
            alert('Notifications panel coming soon!');
        });
    }

    // Add event listener for profile
    const profile = document.querySelector('.profile');
    if (profile) {
        profile.addEventListener('click', () => {
            alert('Profile settings coming soon!');
        });
    }
});

// Search functionality
const searchInput = document.querySelector('.search-bar input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        // Implement search functionality here
        console.log('Searching for:', searchTerm);
    });
}

// Video Upload Handling
const videoDropZone = document.getElementById('videoDropZone');
const videoInput = document.getElementById('videoInput');
const videoPreview = document.getElementById('videoPreview');
const previewPlayer = document.getElementById('previewPlayer');
const productForm = document.getElementById('productForm');
const productsGrid = document.querySelector('.products-grid');

let uploadedVideoURL = '';

// Drag and drop functionality
videoDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    videoDropZone.style.borderColor = '#ff4757';
});

videoDropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    videoDropZone.style.borderColor = '#ddd';
});

videoDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    videoDropZone.style.borderColor = '#ddd';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
        handleVideoFile(file);
    } else {
        alert('Please upload a valid video file');
    }
});

// File input handling
videoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
        handleVideoFile(file);
    } else {
        alert('Please upload a valid video file');
    }
});

function handleVideoFile(file) {
    uploadedVideoURL = URL.createObjectURL(file);
    previewPlayer.src = uploadedVideoURL;
    videoDropZone.style.display = 'none';
    videoPreview.style.display = 'block';
}

// Multi-select category handling
const categoryInput = document.getElementById('categoryInput');
const categoryOptions = document.getElementById('categoryOptions');
const selectedCategories = document.getElementById('selectedCategories');
let selectedCategoryValues = new Set();

// Show/hide category options
categoryInput.addEventListener('focus', () => {
    categoryOptions.classList.add('show');
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.category-dropdown')) {
        categoryOptions.classList.remove('show');
    }
});

// Filter categories based on input
categoryInput.addEventListener('input', (e) => {
    const searchText = e.target.value.toLowerCase();
    const options = categoryOptions.querySelectorAll('.category-option');
    
    options.forEach(option => {
        const text = option.textContent.toLowerCase();
        option.style.display = text.includes(searchText) ? 'block' : 'none';
    });
});

// Handle category selection
categoryOptions.addEventListener('click', (e) => {
    const option = e.target.closest('.category-option');
    if (!option) return;

    const value = option.dataset.value;
    const text = option.textContent;

    if (selectedCategoryValues.has(value)) {
        // Remove category if already selected
        selectedCategoryValues.delete(value);
        option.classList.remove('selected');
        removeTagElement(value);
    } else {
        // Add new category
        selectedCategoryValues.add(value);
        option.classList.add('selected');
        addTagElement(value, text);
    }

    categoryInput.value = '';
    categoryInput.focus();
});

function addTagElement(value, text) {
    const tag = document.createElement('div');
    tag.className = 'category-tag';
    tag.dataset.value = value;
    tag.innerHTML = `
        ${text}
        <span class="remove-tag">&times;</span>
    `;

    tag.querySelector('.remove-tag').addEventListener('click', () => {
        selectedCategoryValues.delete(value);
        tag.remove();
        const option = categoryOptions.querySelector(`[data-value="${value}"]`);
        if (option) {
            option.classList.remove('selected');
        }
    });

    selectedCategories.appendChild(tag);
}

function removeTagElement(value) {
    const tag = selectedCategories.querySelector(`.category-tag[data-value="${value}"]`);
    if (tag) {
        tag.remove();
    }
}

// Empty state handling
const emptyState = document.getElementById('emptyState');
const uploadSection = document.querySelector('.upload-section');

// Function to scroll to upload section
function scrollToUpload() {
    uploadSection.scrollIntoView({ behavior: 'smooth' });
}

// Show/hide empty state based on products
function updateEmptyState() {
    if (productsGrid.children.length === 0 || 
        (productsGrid.children.length === 1 && productsGrid.children[0].classList.contains('empty-state'))) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }
}

// Call on page load
updateEmptyState();

// Form submission
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!uploadedVideoURL) {
        alert('Please upload a video first');
        return;
    }

    const productName = document.getElementById('productName').value;
    const productPrice = document.getElementById('productPrice').value;
    const productDescription = document.getElementById('productDescription').value;
    const categories = Array.from(selectedCategoryValues);

    if (categories.length === 0) {
        alert('Please select at least one category');
        return;
    }

    // Create new product card
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    
    // Use video thumbnail as product image
    const videoThumbnail = document.createElement('video');
    videoThumbnail.src = uploadedVideoURL;
    videoThumbnail.style.width = '100%';
    videoThumbnail.style.height = '200px';
    videoThumbnail.style.objectFit = 'cover';
    videoThumbnail.poster = '';
    videoThumbnail.addEventListener('mouseover', () => {
        videoThumbnail.play();
    });
    videoThumbnail.addEventListener('mouseout', () => {
        videoThumbnail.pause();
        videoThumbnail.currentTime = 0;
    });

    const productInfo = document.createElement('div');
    productInfo.className = 'product-info';
    productInfo.innerHTML = `
        <h3>${productName}</h3>
        <p class="price">Rs ${productPrice}</p>
        <div class="product-stats">
            <span>Categories: ${categories.join(', ')}</span>
            <span>New</span>
        </div>
    `;

    productCard.appendChild(videoThumbnail);
    productCard.appendChild(productInfo);

    // Add the new product card at the beginning of the grid
    if (productsGrid.firstChild) {
        productsGrid.insertBefore(productCard, productsGrid.firstChild);
    } else {
        productsGrid.appendChild(productCard);
    }

    // Update empty state
    updateEmptyState();

    // Reset form and video upload
    resetForm();
    alert('Product uploaded successfully!');
});

function resetForm() {
    productForm.reset();
    videoPreview.style.display = 'none';
    videoDropZone.style.display = 'block';
    previewPlayer.src = '';
    uploadedVideoURL = '';
    
    // Clear selected categories
    selectedCategoryValues.clear();
    selectedCategories.innerHTML = '';
    const options = categoryOptions.querySelectorAll('.category-option');
    options.forEach(option => option.classList.remove('selected'));
}

// Add logout function
function logout() {
    // Clear all user data from localStorage
    localStorage.clear();
    // Redirect to login page
    window.location.href = "../login/login.html";
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('sellerRegistrationForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form values
        const fullname = document.getElementById('fullname').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const phone = document.getElementById('phone').value.trim();
        const businessName = document.getElementById('businessName').value.trim();
        const panNumber = document.getElementById('panNumber').value.trim();
        const businessAddress = document.getElementById('businessAddress').value.trim();
        const businessDescription = document.getElementById('businessDescription').value.trim();
        const terms = document.getElementById('terms').checked;
        
        // Validate form
        if (!validateForm(fullname, email, password, confirmPassword, phone, 
                         businessName, panNumber, businessAddress, businessDescription, terms)) {
            return;
        }
        
        try {
            // Create seller object
            const sellerData = {
                fullname,
                email,
                password,
                phone,
                business: {
                    name: businessName,
                    panNumber,
                    address: businessAddress,
                    description: businessDescription
                }
            };
            
            // Here you would typically make an API call to your backend
            // For now, we'll just log the data
            console.log('Seller Registration data:', sellerData);
            
            // Clear form
            form.reset();
            
            // Show success message
            alert('Registration successful! Your seller account is pending approval.');
            
            // Redirect to seller dashboard or login page
            // window.location.href = '/seller/dashboard';
            
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed. Please try again.');
        }
    });
});

function validateForm(fullname, email, password, confirmPassword, phone, 
                     businessName, panNumber, businessAddress, businessDescription, terms) {
    // Name validation
    if (fullname.length < 2) {
        alert('Please enter a valid name');
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return false;
    }
    
    // Password validation
    if (password.length < 8) {
        alert('Password must be at least 8 characters long');
        return false;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return false;
    }
    
    // Phone validation
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(phone)) {
        alert('Please enter a valid phone number');
        return false;
    }
    
    // Business name validation
    if (businessName.length < 2) {
        alert('Please enter a valid business name');
        return false;
    }
    
    // PAN number validation
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(panNumber)) {
        alert('Please enter a valid PAN number (Format: ABCDE1234F)');
        return false;
    }
    
    // Business address validation
    if (businessAddress.length < 10) {
        alert('Please enter a complete business address');
        return false;
    }
    
    // Business description validation
    if (businessDescription.length < 50) {
        alert('Please provide a detailed business description (minimum 50 characters)');
        return false;
    }
    
    // Terms validation
    if (!terms) {
        alert('Please accept the Terms and Conditions');
        return false;
    }
    
    return true;
}

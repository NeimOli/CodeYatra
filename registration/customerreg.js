document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form values
        const fullname = document.getElementById('fullname').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const phone = document.getElementById('phone').value.trim();
        
        // Validate form
        if (!validateForm(fullname, email, password, confirmPassword, phone)) {
            return;
        }
        
        try {
            // Create customer object
            const customerData = {
                fullname,
                email,
                password,
                phone
            };
            
            // Here you would typically make an API call to your backend
            // For now, we'll just log the data
            console.log('Registration data:', customerData);
            
            // Clear form
            form.reset();
            
            // Show success message
            alert('Registration successful!');
            
            // Redirect to login page
            // window.location.href = '/login';
            
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed. Please try again.');
        }
    });
});

function validateForm(fullname, email, password, confirmPassword, phone) {
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
    
    return true;
}

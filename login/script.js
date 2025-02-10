// Toggle between user and seller forms
function toggleForms() {
    const container = document.querySelector(".container");
    container.classList.toggle("sign-up-mode");
}

// User Login Function
async function userLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById("userEmail").value;
    const password = document.getElementById("userPassword").value;

    if (!email || !password) {
        alert("Please fill in all fields");
        return;
    }

    // Check for specific user credentials
    if (email === "unhandeledexception@gmail.com" && password === "codeyatra") {
        try {
            localStorage.setItem("userType", "user");
            localStorage.setItem("userEmail", email);
            localStorage.setItem("isLoggedIn", "true");
            
            // Show success message and redirect
            alert("Login successful! Redirecting to dashboard...");
            window.location.href = "../user/index.html";
        } catch (error) {
            console.error("Login error:", error);
            alert("An error occurred during login. Please try again.");
        }
    } else {
        alert("Invalid user credentials. Please try again.");
    }
}

// Seller Login Function
async function sellerLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById("sellerEmail").value;
    const password = document.getElementById("sellerPassword").value;

    if (!email || !password) {
        alert("Please fill in all fields");
        return;
    }

    // Check for specific seller credentials
    if (email === "Seller111@gmail.com" && password === "iamseller") {
        try {
            localStorage.setItem("userType", "seller");
            localStorage.setItem("sellerEmail", email);
            localStorage.setItem("isLoggedIn", "true");
            
            // Show success message and redirect
            alert("Login successful! Redirecting to dashboard...");
            window.location.href = "../seller/dashboard.html";
        } catch (error) {
            console.error("Login error:", error);
            alert("An error occurred during login. Please try again.");
        }
    } else {
        alert("Invalid seller credentials. Please try again.");
    }
}

// Logout Function
function logout() {
    // Clear all authentication data
    localStorage.removeItem("userType");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("sellerEmail");
    localStorage.removeItem("isLoggedIn");
    
    // Redirect to login page
    window.location.href = "../login/login.html";
}

// Clear login state when the login page loads
window.addEventListener("load", function() {
    // Clear any existing login data
    localStorage.removeItem("userType");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("sellerEmail");
    localStorage.removeItem("isLoggedIn");
    
    // Clear input fields
    const inputs = document.querySelectorAll("input[type='text'], input[type='password'], input[type='email']");
    inputs.forEach(input => {
        input.value = "";
    });
});

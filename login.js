// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js";

// Firebase configuration (use the same config as in register.js)
const firebaseConfig = {
    apiKey: "AIzaSyCDBEJWXqwh2HDHRWrH2B6TL0UBc87lNyw",
    authDomain: "cultivai-8db33.firebaseapp.com",
    projectId: "cultivai-8db33",
    storageBucket: "cultivai-8db33.appspot.com",
    messagingSenderId: "927881566024",
    appId: "1:927881566024:web:13c26c19e7db8f9a14c57d",
    measurementId: "G-SMV01CZZQ2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Login function
document.getElementById("loginBtn").addEventListener("click", function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");
    const successMessage = document.getElementById("success-message");

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("User logged in:", userCredential.user);
            window.location.href = "dashboard.html"; // Redirect to dashboard
        })
        .catch((error) => {
            console.error("Error:", error.message);
            errorMessage.style.display = "block";
            errorMessage.innerText = "Invalid email or password.";
            successMessage.style.display = "none";
        });
});

// Forgot password function
document.getElementById("forgotPasswordBtn").addEventListener("click", function () {
    const email = document.getElementById("email").value;
    const errorMessage = document.getElementById("error-message");
    const successMessage = document.getElementById("success-message");

    if (!email) {
        errorMessage.style.display = "block";
        errorMessage.innerText = "Please enter your email.";
        successMessage.style.display = "none";
        return;
    }

    sendPasswordResetEmail(auth, email)
        .then(() => {
            successMessage.style.display = "block";
            successMessage.innerText = "Password reset email sent! Check your inbox.";
            errorMessage.style.display = "none";
        })
        .catch((error) => {
            errorMessage.style.display = "block";
            errorMessage.innerText = "Error sending reset email. Make sure email is registered.";
            successMessage.style.display = "none";
        });
});

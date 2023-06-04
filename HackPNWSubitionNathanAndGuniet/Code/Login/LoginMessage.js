
// Initialize Firebase
firebase.initializeApp({
    apiKey: "AIzaSyBlL_vBOKkmzKaP1gyidy2o35EeZ1SC_qA",
    authDomain: "neon-research-365601.firebaseapp.com",
    databaseURL: "https://neon-research-365601-default-rtdb.firebaseio.com",
    projectId: "neon-research-365601",
    storageBucket: "neon-research-365601.appspot.com",
    messagingSenderId: "376695677013",
    appId: "1:376695677013:web:26abfcb0cc53e5cef374dc",
    measurementId: "G-1JTX2F79VG"
});

// Get the elements
const email = document.getElementById("email");
const password = document.getElementById("password");
const registerBtn = document.getElementById("register-btn");
const loginBtn = document.getElementById("login-btn");

registerBtn.addEventListener("click", register);
loginBtn.addEventListener("click", login);

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in, redirect them to the home page
        window.location.href = "../Home/Home.html";
    } else {
        // User is not signed in, show them the login page. Ill do this later. fam last words!
    }
});


// Register function
function register(event) {
    event.preventDefault();
    firebase.auth().createUserWithEmailAndPassword(email.value.trim(), password.value.trim())
        .then(response => {
            console.log("User registered successfully: ", response.user.email);
            // Clear the form
            email.value = "";
            password.value = "";
            window.location.href = "../Home/Home.html";

        })
        .catch(error => { 
            console.log("Error registering user: ", error.message);
            document.getElementById("Error-Message").textContent=error.message;
        });
}

// Login function
function login(event) {
    event.preventDefault();
    firebase.auth().signInWithEmailAndPassword(email.value.trim(), password.value.trim())
        .then(response => {
            console.log("User logged in successfully: ", response.user.email);
            // Clear the form
            email.value = "";
            password.value = "";
            window.location.href = "../Home/Home.html";
        })
        .catch(error => {
            console.log("Error logging in user: ", error.message);
            document.getElementById("Error-Message").textContent=error.message;
        });
}

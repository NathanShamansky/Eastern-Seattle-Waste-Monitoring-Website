document.getElementById("signup-btn").addEventListener("click", function() {
    // Remove the active class from the sign in button
    document.getElementById("signin-btn").classList.remove("active");
    // Add the active class to the sign up button
    document.getElementById("signup-btn").classList.add("active");
    // Remove the active class from the sign in form
    document.getElementById("sign-in-form").classList.remove("active");
    // Add the active class to the sign up form
    document.getElementById("sign-up-form").classList.add("active");

    document.getElementById("Note-at-bottum").classList.add("active");
});

document.getElementById("signin-btn").addEventListener("click", function() {
    // Remove the active class from the sign up button
    document.getElementById("signup-btn").classList.remove("active");
    // Add the active class to the sign in button
    document.getElementById("signin-btn").classList.add("active");
    // Remove the active class from the sign up form
    document.getElementById("sign-up-form").classList.remove("active");
    // Add the active class to the sign in form
    document.getElementById("sign-in-form").classList.add("active");

    document.getElementById("Note-at-bottum").classList.remove("active");
});
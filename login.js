const loginForm = document.getElementById("loginForm");
const error = document.getElementById("error");

loginForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    error.textContent = "";

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    try {

        // Read credentials from users.json
        const response = await fetch("users.json");

        if (!response.ok) {
            throw new Error("Unable to load users.");
        }

        const users = await response.json();

        // Check username & password
        const validUser = users.find(user =>
            user.username === username &&
            user.password === password
        );

        if (validUser) {
            // Save logged in user
            localStorage.setItem("loggedInUser", validUser.username);
            // Redirect
            window.location.href = "dashboard.html";
        } else {
            error.textContent = "Invalid Username or Password.";
        }

    } catch (err) {
        error.textContent = "Something went wrong.";
        console.error(err);
    }
});
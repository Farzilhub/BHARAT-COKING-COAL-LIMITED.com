async function login() {

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const message = document.getElementById("msg");

    try {
        const response = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        message.innerHTML = "Login Successful";
        window.location.href = "dashboard.html";
    } catch (error) {
        message.innerHTML = error.message || "Invalid Username or Password";
    }

}

// Show Registration Form
function showRegister() {
    document.querySelector(".login-box").style.display = "none";
    document.getElementById("registerBox").style.display = "block";
}

// Back to Login
function hideRegister() {
    document.querySelector(".login-box").style.display = "block";
    document.getElementById("registerBox").style.display = "none";
}

// Register User
function registerUser() {

    let username = document.getElementById("newUsername").value.trim();
    let password = document.getElementById("newPassword").value.trim();

    if(username === "" || password === ""){

        document.getElementById("registerMsg").innerHTML =
        "Please fill all fields.";

        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || {};

    if(users[username]){

        document.getElementById("registerMsg").innerHTML =
        "Username already exists.";

        return;
    }

    users[username] = password;

    localStorage.setItem("users", JSON.stringify(users));

    document.getElementById("registerMsg").innerHTML =
    "Account created successfully!";

    setTimeout(() => {

        hideRegister();

    },1000);
}

// Login
function login(){

    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();

    let users = JSON.parse(localStorage.getItem("users")) || {};

    if(users[username] && users[username] === password){

        document.getElementById("msg").style.color = "green";
        document.getElementById("msg").innerHTML =
        "Login Successful";

        // Redirect after login
        setTimeout(() => {

            window.location.href = "dashboard.html";

        },1000);

    }else{

        document.getElementById("msg").style.color = "red";
        document.getElementById("msg").innerHTML =
        "Invalid Username or Password";
    }
}

// Press Enter for Login
function handleEnter(event){

    if(event.key === "Enter"){
        login();
    }

}

// Press Enter for Registration
function handleRegisterEnter(event){

    if(event.key === "Enter"){
        registerUser();
    }

}

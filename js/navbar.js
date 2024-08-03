import { User } from "./Classes/User.js";

const user = new User();

function initializeNavbar() {
    const authButton = document.getElementById('authButton');

    if(user.isLoggedIn){
        authButton.textContent = 'Logout';
    } else {
        authButton.textContent = 'Login';
    }
}

document.getElementById('authButton').addEventListener('click', function() {
    if(user.isLoggedIn){
        logout();
    } else {
        login();
    }
});

function login() {
    window.location.href = 'login.html';
    console.log("login");
};

function logout() {
    console.log("Log out pressed");
    user.logout();
};

initializeNavbar();
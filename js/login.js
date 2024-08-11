import {User} from "./Classes/User.js";

const user = new User();
// get the right elements
const email_input = document.getElementById('email');
const password_input = document.getElementById('password');
const loginButton = document.getElementById('loginButton');
const resetButton = document.getElementById('resetPassword');
const resetEmail_input = document.getElementById('resetEmail');

// check if the login button is pressed
loginButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = email_input.value; // get the value from email input
    const password = password_input.value;  // get value from password input
    try {
        const loginStatus = await user.login(email,password); // attempt to login with the provided values
        if(!loginStatus) {
            email_input.value = '';
            password_input.value = '';
            return;
        }
        window.location.href = 'index.html'; // if login is succesfull open the home page
    } catch (error) {
       console.error(error);
    }
})

// eventlistener for resetting users password
resetButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = resetEmail_input.value;
    try {
        const data = await user.forgotPassword(email);
        alert(data.message);
        resetEmail_input.value = '';
    } catch (error) {
        console.error(error);
    }
})


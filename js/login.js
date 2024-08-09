import {User} from "./Classes/User.js";

const user = new User();
const email_input = document.getElementById('email');
const password_input = document.getElementById('password');
const loginButton = document.getElementById('loginButton');
const resetButton = document.getElementById('resetPassword');
const resetEmail_input = document.getElementById('resetEmail');

loginButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = email_input.value;
    const password = password_input.value;
    try {
        const loginStatus = await user.login(email,password);
        if(!loginStatus) {
            email_input.value = '';
            password_input.value = '';
            return;
        }
        window.location.href = 'index.html';
    } catch (error) {
       console.error(error);
    }
})

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


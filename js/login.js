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
        const result = await user.login(email,password);
        console.log(result + "this");
        window.location.href = 'index.html';
    } catch (error) {
        console.log(error);
    }
})

resetButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = resetEmail_input.value;
    try {
        const result = await user.forgotPassword(email);
    } catch (error) {
        console.error(error);
    }
})


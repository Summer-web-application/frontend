import {User} from "./Classes/User.js";

const user = new User();
const firstName_input = document.getElementById('firstName');
const lastName_input = document.getElementById('lastName');
const userName_input = document.getElementById('userName');
const email_input = document.getElementById('email');
const password_input = document.getElementById('password');
const confPassword_input = document.getElementById('confirmPassword');
const registerButton = document.getElementById('registerButton');

registerButton.addEventListener('click', async (e) => {
    e.preventDefault();

    // get the input values
    const firstName = firstName_input.value;
    const lastName = lastName_input.value;
    const userName = userName_input.value;
    const email = email_input.value;
    const password = password_input.value;
    const confPassword = confPassword_input.value;

    // check if passwords match
    if(password != confPassword){
        alert('Passwords do not match!');
        return;
    }
    try {
        // attempt to register the user
        const result = await user.register(firstName,lastName,userName,email,password);
        alert(`Account created successfully for email: ${result.email}`)
        window.location.href = "login.html";
    } catch (error){
        console.error("register error: ", error.message);
    }
})


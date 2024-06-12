import { BACKEND_URL } from "../js/config.js";
const firstName_input = document.getElementById('firstName');
const lastName_input = document.getElementById('lastName');
const userName_input = document.getElementById('userName');
const email_input = document.getElementById('email');
const password_input = document.getElementById('password');
const confPassword_input = document.getElementById('confirmPassword');
const registerButton = document.getElementById('registerButton');

registerButton.addEventListener('click', async (e) => {
    e.preventDefault();

    const firstName = firstName_input.value;
    const lastName = lastName_input.value;
    const userName = userName_input.value;
    const email = email_input.value;
    const password = password_input.value;
    const confPassword = confPassword_input.value;

    if(password != confPassword){
        console.log("Passwords don't match!");
       return;
    }
    try {
        const result = await registerUser(firstName,lastName,userName,email,password);
        console.log("responce received: ", result);
    } catch (error){
        console.error("register error", error);
    }
})

async function registerUser(firstName, lastName, userName, email, password) {
    
    const data = JSON.stringify({first_name: firstName, last_name:lastName, username:userName, email:email, password:password});

    try {
        const res = await fetch(BACKEND_URL + '/register',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: data
        });

        const contentType = res.headers.get('content-type'); 
        if(!res.ok) {
            throw new Error('res failed');
        }
        if (contentType && contentType.includes('application/json')) {
            const resultJson = await res.json();
            return resultJson;
        } else {
            const resultText = await res.text();
            return resultText;
        }
    } catch (error) {
        console.error('Error reg:', error);
        throw error;
    }
}
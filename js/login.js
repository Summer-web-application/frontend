import { BACKEND_URL } from "../js/config.js";
const email_input = document.getElementById('email');
const password_input = document.getElementById('password');
const loginButton = document.getElementById('loginButton');

loginButton.addEventListener('click', async (e) => {
    e.preventDefault();

    const email = email_input.value;
    const password = password_input.value;

    try {
        const result = await login(email,password);
        console.log(result);
    } catch (error) {

    }
})

async function login(email, password) {
    const data = JSON.stringify({email: email, password:password});

    try {
        const res = await fetch(BACKEND_URL + '/login', {
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


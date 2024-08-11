import { BACKEND_URL } from "../config.js";

class User {
    static instanceCounter = 0;

    // store user data
    #user_id = undefined
    #email = undefined
    #token = undefined
    #username = undefined
    #first_name = undefined
    #last_name = undefined

    constructor() {
        // check if data is stored in sessionStorage 
        const userFromStorage = sessionStorage.getItem('user');
        if(userFromStorage) {
            const user = JSON.parse(userFromStorage);
            this.#user_id = user.id;
            this.#username = user.username;
            this.#first_name = user.first_name;
            this.#last_name = user.last_name;
            this.#email = user.email;
            this.#token = user.token;
        }
    }

    //getters
    get id(){
        return this.#user_id;
    }
    get username(){
        return this.#username;
    }
    get fullName(){
        return `${this.#first_name} ${this.#last_name}`;
    }
    get email(){
        return this.#email;
    }
    get token(){
        return this.#token;
    }

    get isLoggedIn(){
        if(this.#user_id != undefined){
            return true;
        }
        return false;
    }

    //method to handle user login
    async login(email, password) {
        const data = JSON.stringify({email: email, password:password});
        try {
            const response = await fetch(BACKEND_URL + '/user/login', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'  // set content type to JSON
                },
                body: data, // attach the login data
                mode: 'cors', // enable CORS
                credentials: 'include', // include credentials for the session
            });
            if (!response.ok) { 
                const errorResponse = await response.json(); // parse error response
                console.error('HTTP Error:', errorResponse.error);  // log error in console
                alert(`Error: ${errorResponse.error}`);
                return false;
            }
            const json = await response.json(); // parse successful response
            this.#user_id = json.id; // set user id
            this.#username = json.username; // set username 
            this.#email = json.email; // set email
            sessionStorage.setItem('user', JSON.stringify(json)); // store current user data in sessionStorage
            return true;
        } catch (error) {
            console.error('Error reg:', error);
            throw error;
        }
    }

    // method to handle user registration
    async register(firstName, lastName, userName, email, password) {
        const data = JSON.stringify({first_name: firstName, last_name:lastName, username:userName, email:email, password:password});
        try {
            const response = await fetch(BACKEND_URL + '/user/register',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: data
            });
            if (!response.ok) { 
                const errorResponse = await response.json();
                console.error('HTTP Error:', errorResponse.error);
                alert(`Error: ${errorResponse.error}`);
                return;
            }
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Network or Unexpected Error:', error);
            throw error;
        }
    }

    // method to handle loggin out
    async logout() {
        try{
            const response = await fetch(BACKEND_URL + '/user/logout', {
                method: 'POST',
                credentials: 'include',
            });
            if (!response.ok) { 
                const errorResponse = await response.json();
                console.error('HTTP Error:', errorResponse.error);
                alert(`Error: ${errorResponse.error}`);
                return;
            }
            // clear user data on successful logout
            this.#user_id = undefined;
            this.#username = undefined;
            this.#email = undefined;
            this.#token = undefined;
            sessionStorage.removeItem('user'); // remove user data from sessionStorage
        } catch (error) {
            console.error(error);
        }
    }

    // method to handle ressetting password
    async forgotPassword(email) {
        try {
            const response = await fetch(BACKEND_URL + `/user/forgot-password/${email}`);
            if (!response.ok) { 
                const errorResponse = await response.json();
                console.error('HTTP Error:', errorResponse.error);
                alert(`Error: ${errorResponse.error}`);
                return;
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
        }
    }
}
export {User} // export the user class

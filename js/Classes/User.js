import { BACKEND_URL } from "../config.js";

class User {
    static instanceCounter = 0;

    #user_id = undefined
    #email = undefined
    #token = undefined
    #username = undefined
    #first_name = undefined
    #last_name = undefined

    constructor() {
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

    //methods
    async login(email, password) {
        const data = JSON.stringify({email: email, password:password});
        try {
            const response = await fetch(BACKEND_URL + '/user/login', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: data,
                mode: 'cors', 
                credentials: 'include',
            });
            if (!response.ok) { 
                const errorResponse = await response.json();
                console.error('HTTP Error:', errorResponse.error);
                alert(`Error: ${errorResponse.error}`);
                return false;
            }
            const json = await response.json();
            this.#user_id = json.id;
            this.#username = json.username;
            this.#email = json.email;
            sessionStorage.setItem('user', JSON.stringify(json));
            return true;
        } catch (error) {
            console.error('Error reg:', error);
            throw error;
        }
    }

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
            this.#user_id = undefined;
            this.#username = undefined;
            this.#email = undefined;
            this.#token = undefined;
            sessionStorage.removeItem('user');
        } catch (error) {
            console.error(error);
        }
    }

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
export {User}

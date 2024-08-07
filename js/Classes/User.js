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
    //setters


    //methods
    async login(email, password) {
        const data = JSON.stringify({email: email, password:password});
        try {
            const res = await fetch(BACKEND_URL + '/user/login', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: data,
                mode: 'cors', 
                credentials: 'include',
            });
            let cookie = res.headers.get('set-cookie');
            console.log('set-cookie header value', cookie);

            const contentType = res.headers.get('content-type'); 
            if(!res.ok) {
                throw new Error('res failed');
            }
            if (contentType && contentType.includes('application/json')) {
                const json = await res.json();
                this.#user_id = json.id;
                this.#username = json.username;
                this.#email = json.email;
                this.#token = json.token;
                sessionStorage.setItem('user', JSON.stringify(json));
                return this;
            } else {
                const resultText = await res.text();
                return resultText;
            }
    
        } catch (error) {
            console.error('Error reg:', error);
            throw error;
        }
    }

    async register(firstName, lastName, userName, email, password) {
    
        const data = JSON.stringify({first_name: firstName, last_name:lastName, username:userName, email:email, password:password});
    
        try {
            const res = await fetch(BACKEND_URL + '/user/register',{
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

    logout() {
        this.#user_id = undefined;
        this.#username = undefined;
        this.#email = undefined;
        this.#token = undefined;
        sessionStorage.removeItem('user');
    }

    async forgotPassword(email) {
        console.log("This email", email);
        try {
            const response = await fetch(BACKEND_URL + `/user/forgot-password/${email}`);
            console.log("User that forgot password: ", response);
            
        } catch (error) {
            console.error(error);
        }
    }
    
}
export {User}

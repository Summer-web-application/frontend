import { BACKEND_URL } from "../config.js";

class Post {

    #post_firstName = undefined;
    #post_lastName = undefined;
    #post_username = undefined;
    #post_text = undefined;
    #post_createdAt = undefined;
    #post_likes = undefined;
    constructor(){
        
    }

    get post_firstName(){
        return this.#post_firstName;
    }
    get post_lastName(){
        return this.#post_lastName;
    }
    get post_username(){
        return this.#post_username;
    }
    get post_text(){
        return this.#post_text;
    }
    get post_createdAt(){
        const fullDate = new Date(this.#post_createdAt);
        const day = fullDate.getDate();
        const month = fullDate.getMonth();
        const year = fullDate.getFullYear();
        return `${day}.${month}.${year}`;
    }
    get post_likes(){
        return this.#post_likes;
    }

    async getAllPosts() {

    }

    async getOnePost(postId) {
        try {
            const res = await fetch(BACKEND_URL + `/posts/${postId}`);
            if(!res.ok) {
                throw new Error("res failed" + res.statusText);
            }
            const data = await res.json();
            console.log("Data: ", data);
            this.#post_firstName = data.first_name;
            this.#post_lastName = data.last_name;
            this.#post_username = data.username;
            this.#post_text = data.text;
            this.#post_createdAt = data.created_at;
            this.#post_likes = data.likes;
        } catch (error) {
            console.error("Fetch error: ", error);
        }
    }
}
            

export {Post}
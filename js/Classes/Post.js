import { BACKEND_URL } from "../config.js";
import { Comment } from "./Comment.js";
import { User } from "./User.js";

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
                throw new Error("response failed" + res.statusText);
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
    async getComments(postId) {
        try {
            const res = await fetch(BACKEND_URL + `/posts/${postId}/comments`)
            if(!res.ok){
                throw new Error("response failed" + res.statusText);
            }
            const data = await res.json();
            const comments = [];
            data.forEach(element => {
                const comment = new Comment(element.id, element.first_name, element.last_name, element.username, element.text, element.likes, element.created_at);
                comments.push(comment);
            });
            return comments;
        } catch (error) {
            console.error("Fetch error: ", error);
        }
    }

    async postComment(data) {
        try {
            const response = await fetch(BACKEND_URL + '/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if(!response.ok) {
                throw new Error(response.status, 'Not found or internal server');
            }
            const commentData = await response.json();
            console.log(commentData, ' full data');
            const comment = new Comment(commentData.id, commentData.first_name, commentData.last_name, commentData.username, commentData.text, commentData.likes, commentData.created_at);
            console.log("Single comment information received: ", commentData.first_name, " ", commentData.last_name, " ", commentData.username, " ", commentData.text, " ", commentData.likes, " ", commentData.created_at )
            return comment; 
        } catch (error) {
            console.error('Fetch', error);
        }
    }
    async likePost(postId) {

    }
    async likeComment(comment_id) {
        const user = new User();
        console.log(comment_id, user.user_id + " ids that is sent");
        const user_id = user.user_id
        try {
            const response = await fetch(BACKEND_URL + `/comment/like`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({comment_id, user_id})
            });
            if(!response.ok) {
                throw new Error(response.status, 'Not found or internal server');
            }
            const data = await response.text();
            console.log(data, " likes returned");
        } catch (error) {
            console.error("Fetch error: ", error);
        }
    }
}
            

export {Post}
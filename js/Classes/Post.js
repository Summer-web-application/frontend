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
    constructor() {

    }

    get post_firstName() {
        return this.#post_firstName;
    }
    get post_lastName() {
        return this.#post_lastName;
    }
    get post_username() {
        return this.#post_username;
    }
    get post_text() {
        return this.#post_text;
    }
    get post_createdAt() {
        const fullDate = new Date(this.#post_createdAt);
        const day = fullDate.getDate();
        const month = fullDate.getMonth();
        const year = fullDate.getFullYear();
        return `${day}.${month}.${year}`;
    }
    get post_likes() {
        return this.#post_likes;
    }

    async getAllPosts() {

    }

    async getOnePost(postId) {
        try {
            const res = await fetch(BACKEND_URL + `/blog/${postId}`);
            if (!res.ok) {
                throw new Error("response failed" + res.statusText);
            }
            const data = await res.json();
            console.log("Get one post: ", data);
            this.#post_firstName = data[0].first_name;
            this.#post_lastName = data[0].last_name;
            this.#post_username = data[0].username;
            this.#post_text = data[0].text;
            this.#post_createdAt = data[0].created_at;
            this.#post_likes = data[0].likes;
        } catch (error) {
            console.error("Fetch error: ", error);
        }
    }

    async likeDislikePost(post_id, classList) {
        const user = new User();
        const user_id = user.user_id;
        let like_status;
        if (classList.contains("liked")) {
            like_status = "dislike";
            console.log("sending dislike");
        } else {
            like_status = "like";
            console.log("sending like");
        }
        try {
            const response = await fetch(BACKEND_URL + `/blog/post/like`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ post_id, user_id, like_status })
            });
            if (!response.ok) {
                throw new Error(response.status, 'Not found or internal server');
            }
            const data = await response.json();
            const updatedLikes = data[0].likes;
            return updatedLikes;
        } catch (error) {
            console.error("Fetch error: ", error);
        }
    }
    async getComments(postId) {
        try {
            const res = await fetch(BACKEND_URL + `/blog/${postId}/comments`)
            if (!res.ok) {
                throw new Error("response failed" + res.statusText);
            }
            const data = await res.json();
            console.log("Comments for the post: ", data);
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
            const response = await fetch(BACKEND_URL + '/blog/comment/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(response.status, 'Not found or internal server');
            }
            const commentData = await response.json();
            console.log('Received new comment: ', commentData);
            const comment = new Comment(commentData[0].id, commentData[0].first_name, commentData[0].last_name, commentData[0].username, commentData[0].text, commentData[0].likes, commentData[0].created_at);
            return comment;
        } catch (error) {
            console.error('Fetch', error);
        }
    }
    async likeDislikeComment(comment_id, post_id, classList) {
        console.log(classList, " classList of liked comment");
        const user = new User();
        console.log(comment_id, user.user_id + " ids that is sent");
        const user_id = user.user_id
        let like_status;
        if (classList.contains("liked")) {
            like_status = "dislike";
            console.log("sending dislike");
        } else {
            like_status = "like";
            console.log("sending like");
        }

        try {
            const response = await fetch(BACKEND_URL + `/blog/comment/like`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ comment_id, user_id, post_id, like_status })
            });
            if (!response.ok) {
                throw new Error(response.status, 'Not found or internal server');
            }
            const data = await response.json();
            const updatedLikes = data[0].likes;
            return updatedLikes;
        } catch (error) {
            console.error("Fetch error: ", error);
        }
    }

    async editPost(postId, text) {
        console.log(postId + " " + text)
        const response = await fetch(`http://localhost:3000/blog/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });

        console.log(response);

        return response.ok;
    }

    async editComment(commentId, postId, updatedData) {
        try {
            const response = await fetch(`${BACKEND_URL}/blog/comment/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) {
                throw new Error(`Error updating comment: ${response.statusText}`);
            }

            return response.ok;
        } catch (error) {
            console.error('Failed to update comment:', error);
            return false;
        }
    }

}


export { Post }
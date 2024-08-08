import { Post } from "./Post.js";
import { Comment } from "./Comment.js";
import { BACKEND_URL } from "../config.js";

class Fetch {

    //#region Posts
    async getAllPosts() {
        try {
            const response = await fetch(BACKEND_URL + '/blog');
            if(!response.ok){
                throw new Error("res failed" + res.statusText);
            }
            const data = await response.json();
            return this.#mapPosts(data);
        } catch (error){
            console.error(error);
        }
    };

    async getOnePost(postId) {
        try {
            const res = await fetch(BACKEND_URL + `/blog/${postId}`);
            if(!res.ok) {
                throw new Error("response failed" + res.statusText);
            }
            const data = await res.json();
            return this.#mapPosts(data);
        } catch (error) {
            console.error("Fetch error: ", error);
        }
    }
    async getOwnPosts(user_id) {
        try {
            const response = await fetch(BACKEND_URL + `/blog/user/${user_id}/posts`);
            if(!response.ok) {
                throw new Error("response failed" + response.statusText);
            }
            const data = await response.json();
            return this.#mapPosts(data);
        } catch (error){
            console.error("Fetch error: ", error);
        }
    }
    async createPost(data) {
        console.log('form data: ', data);
        for (let [key, value] of data.entries()) {
            console.log(key, value, "in fetch");
        }
        try {
            const response = await fetch(BACKEND_URL + '/blog/new', {
                method: 'POST',
                credentials: 'include',
                body: data
            });
            if(!response.ok) {
                throw new Error(response.status, 'Not found or internal server');
            }
            const postData = await response.json();
            return this.#mapPosts(postData);
        } catch (error) {
            console.error(error);
        }
    }
    async editPost(postId, text) {
        console.log(postId + " " + text)
        const response = await fetch(`http://localhost:3000/blog/${postId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });

        console.log(response);

        return response.ok;
    }
    async deletePost(postId) {
        try {
            const response = await fetch(`${BACKEND_URL}/blog/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            if (!response.ok) {
                throw new Error(`Error deleting post: ${response.statusText}`);
            }
    
            return response.ok;
        } catch (error) {
            console.error('Failed to delete post:', error);
            return false;
        }
    }
    
    #mapPosts = (postData) => {
        const posts = [];
        postData.forEach(element => {
            const post = new Post(element.id, element.first_name, element.last_name, element.username, element.text,element.image, element.created_at, element.likes);
            posts.push(post);
        })
        return posts;
    }
    //#endregion
    //#region Comments
    async getComments(postId) {
        try {
            const res = await fetch(BACKEND_URL + `/blog/${postId}/comments`)
            if(!res.ok){
                throw new Error("response failed" + res.statusText);
            }
            const data = await res.json();
            return this.#mapComments(data);
        } catch (error) {
            console.error("Fetch error: ", error);
        }
    }

    async postComment(data) {
        try {
            const response = await fetch(BACKEND_URL + '/blog/comment/new', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if(!response.ok) {
                throw new Error(response.status, 'Not found or internal server');
            }
            const commentData = await response.json();
            return this.#mapComments(commentData);
        } catch (error) {
            console.error('Fetch', error);
        }
    }
    async editComment(commentId, postId, updatedData) {
        try {
            const response = await fetch(`${BACKEND_URL}/blog/comment/${commentId}`, {
                method: 'PUT',
                credentials: 'include',
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
    async deleteComment(commentId) {
        try {
            const response = await fetch(`${BACKEND_URL}/blog/comment/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            if (!response.ok) {
                throw new Error(`Error deleting comment: ${response.statusText}`);
            }
    
            return response.ok;
        } catch (error) {
            console.error('Failed to delete comment:', error);
            return false;
        }
    }
    
    #mapComments = (commentData) => {
        const comments = [];
        commentData.forEach(element => {
            const comment = new Comment(element.id, element.first_name, element.last_name, element.username, element.text, element.likes, element.created_at);
            comments.push(comment);
        });
        return comments;
    }
    //#endregion
    //#region Likes
    async likeDislikePost(post_id, classList, user_id) {
        let like_status;
        if(classList.contains("liked")){
            like_status = "dislike";
        } else {
            like_status = "like";
        }
        try {
            const response = await fetch(BACKEND_URL + `/blog/post/like`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({post_id, user_id, like_status})
            });
            if(!response.ok) {
                throw new Error(response.status, 'Not found or internal server');
            }
            const data = await response.json();
            const updatedLikes = data[0].likes;
            return updatedLikes;
        } catch (error) {
            console.error("Fetch error: ", error);
        }
    }
    async likeDislikeComment(comment_id, post_id, classList, user_id) {
        let like_status;
        if(classList.contains("liked")){
            like_status = "dislike";
        } else {
            like_status = "like";
        }
        try {
            const response = await fetch(BACKEND_URL + `/blog/comment/like`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({comment_id, user_id, post_id, like_status})
            });
            if(!response.ok) {
                throw new Error(response.status, 'Not found or internal server');
            }
            const data = await response.json();
            const updatedLikes = data[0].likes;
            return updatedLikes;
        } catch (error) {
            console.error("Fetch error: ", error);
        }
    }
    async getUserPostLikes(user_id) {
        try {
            const response = await fetch(BACKEND_URL + `/blog/${user_id}/posts/likes`);
            if(!response.ok){
                throw new Error("response failed" + response.statusText);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("error: ", error);
            throw error;
        }
    }
    async getUserCommentLikes(user_id, post_id) {
        try {
            const response = await fetch(BACKEND_URL + `/blog/${user_id}/${post_id}/comments/likes`);
            if(!response.ok){
                throw new Error("response failed" + response.statusText);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("error: ", error);
            throw error;
        }
    }
    //#endregion
}
export { Fetch }
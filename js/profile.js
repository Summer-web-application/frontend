import { BACKEND_URL } from "./config.js";
import { User } from "./Classes/User.js";
import { Post } from "./Classes/Post.js";
const user = new User();
const post = new Post(); 


function assignUserDetails() {
    document.getElementById('users-name').innerText = user.fullName;
    document.getElementById('username').innerText = "@" + user.username;
}

async function getUserPosts() {
    try {
        console.log("Users posts: ", data);
    } catch (error) {
        console.error(error);
    }
}

// fetch('http://localhost:3000/api/user/1')
//                 .then(response => response.json())
//                 .then(data => {
//                     document.getElementById('users-name').innerText = data[0].first_name + " " + data[0].last_name;
//                     document.getElementById('username').innerText = "@" + data[0].username;
//                 })
//                 .catch(error => console.error('Error cant get user profile:', error));

// fetch('http://localhost:3000/api/user/posts/1')
//     .then(response => response.json())
//     .then(posts => {
//         const postsContainer = document.getElementById('user-posts');
//         const postTemplate = postsContainer.querySelector('.post');

//         posts.forEach(post => {
//             const postElement = postTemplate.cloneNode(true);
//             postElement.classList.remove('template');
//             postElement.querySelector('.post-text').innerText = post.text;

//             postElement.addEventListener('click', function () {
//                 window.location.href = `post.html?postId=${post.id}`;
//             });

//             postsContainer.appendChild(postElement);
//         });
//         postTemplate.remove();
//     })
//     .catch(error => console.error('Error cant get user posts:', error));

    document.addEventListener('DOMContentLoaded', function() {
        assignUserDetails();
        getUserPosts();
    });
import { BACKEND_URL } from "../js/config.js";
import { User } from "./Classes/User.js";
import { Fetch } from "./Classes/Fetch.js";
import { handleImageSelection, getImageURL, clearImage, displayPostImage } from './imageHandler.js';
import { getAndAssignDetails } from './post.js';
const post = new Post();


const fetch = new Fetch();
const user = new User();
const list = document.getElementById('blog-posts'); // container
const input = document.getElementById('post-textarea');
const postButton = document.getElementById('post-button');
const charCount = document.getElementById('char-count');
const postModal = new bootstrap.Modal(document.getElementById('postModal'));
const maxChars = 250;


// update the character count display
const updateCharCount = () => {
    const remaining = maxChars - input.value.length;
    charCount.textContent = `${remaining} / 250`;
};

// handle image selection
handleImageSelection();

async function addPost () {
    const text = input.value.trim();
    const likes = 0;
    const user_id = user.id;
    const image = getImageURL()
    if (text !== '') {
        try {
        const data = { text, likes, user_id, image };
        const newPost = await fetch.createPost(data);
        renderPost(newPost);
        input.value = '';
        updateCharCount();
        clearImage();
        } catch (error) {
            console.error(error);
        }
    } else {
        //here some kind of error message
        console.log("Can't be empty");
    }
};
async function getUsersLikes() {
    try {
        const likedComments = await fetch.getUserPostLikes(user.id);
        likedComments.forEach(element => {
            const likeButton = document.querySelector(`#reaction-button-2[data="${element.post_id}"]`);
            if(likeButton) {
                likeButton.classList.add('liked');
            }
        })
    } catch (error) {
        console.log(error);
    }
}

async function likeDislikePost(post_id, classList) {
    try {
        //pass classlist to check the users comment like state
        const updateLikes = await fetch.likeDislikePost(post_id, classList, user.id);
        //update the like count
        const likeButton = document.querySelector(`#reaction-button-2[data="${post_id}"]`);
        if (!likeButton) {
            console.log("like button of post not found");
            return;
        }
        likeButton.innerHTML = `<i class="bi bi-heart-fill"></i> ${updateLikes}`;
        //toggle the buttons classlist
        if (likeButton.classList.contains("liked")) {
            likeButton.classList.remove('liked');
        } else {
            likeButton.classList.add('liked');
        }
    } catch (error) {
        console.log(error);
    }
}

function authCheck() {
    if (user.isLoggedIn) {
        addPost();
    } else {
        window.location.href="loginPrompt.html";
    }
}
async function getPosts () {
    try {
        list.innerHTML = ''; // Clear existing posts
        const data = await fetch.getAllPosts();
        renderPost(data);
    } catch (error) {
        console.error(error);
    }
}
function renderPost(data) {
        data.forEach(post => {
            // main container
            const div = document.createElement('div');
            div.setAttribute('class', 'blog-posts-container-item');

            //container for name
            const nameContainer = document.createElement('div'); // for firstname and lastname
            nameContainer.classList.add('name-container-item'); //for css styling
            const userNameContainer = document.createElement('div'); // for the username
            userNameContainer.classList.add('username-container-item'); 

            //first name element
            const firstNameElement = document.createElement('p');
            firstNameElement.textContent = post.firstName;
            nameContainer.appendChild(firstNameElement);

            //last name element
            const lastNameElement = document.createElement('p');
            lastNameElement.textContent = post.lastName;
            nameContainer.appendChild(lastNameElement);

            //add name container to main container
            div.appendChild(nameContainer);

            //username element
            const userNameElement = document.createElement('p');
            userNameElement.textContent = "@" + post.username;
            userNameContainer.appendChild(userNameElement);

            div.appendChild(userNameContainer);
            //main text element
            const textElement = document.createElement('p');
            textElement.textContent = post.text;
            div.appendChild(textElement);

            displayPostImage(post, div);

            // button container
            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('d-flex', 'justify-content-end', 'mt-2');

            // check comments button
            const commentButton = document.createElement('button');
            commentButton.innerHTML = `<i class="bi bi-chat-right-text-fill"></i> Comment`;
            commentButton.id = `reaction-button-1`; //assign post id to buttons class
            commentButton.classList.add('reaction-button', 'me-2');
            commentButton.addEventListener('click', () => {
                window.location.href = `post.html?postId=${post.id}`;
            });
            buttonContainer.appendChild(commentButton);

                // like button
            const likeButton = document.createElement('button');
            likeButton.innerHTML = `<i class="bi bi-heart-fill"></i> ${post.likes}`;
            likeButton.id = `reaction-button-2`;
            likeButton.classList.add('reaction-button', 'me-2');
            likeButton.setAttribute('data', post.id);
            likeButton.addEventListener('click', () => {
            likeDislikePost(post.id, likeButton.classList);
            });
            buttonContainer.appendChild(likeButton);

            div.appendChild(buttonContainer);

            list.prepend(div);
            })
}

document.addEventListener('DOMContentLoaded',async function() {
    if (list) {
        await getPosts();
        getUsersLikes();
    }
    updateCharCount();
});


input.addEventListener('input', updateCharCount);
postButton.addEventListener('click', authCheck);

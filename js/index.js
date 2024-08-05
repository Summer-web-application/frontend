import { BACKEND_URL } from "../js/config.js";
import { User } from "./Classes/User.js";
import { Post } from "./Classes/Post.js";
import { handleImageSelection, getImageURL, clearImage, displayPostImage } from './imageHandler.js';
import { getAndAssignDetails } from './post.js';
const post = new Post();


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

const addPost = () => {
    const text = input.value.trim();
    const likes = 0;
    const user_id = user.user_id;
    const image = getImageURL()

    if (text !== '') {
        const data = { text, likes, user_id, image };

        fetch(`${BACKEND_URL}/blog/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('res failed');
                }
                const contentType = res.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    return res.json();
                } else {
                    return res.text();
                }
            })
            .then(data => {
                console.log('success:', data);
                input.value = '';
                updateCharCount();
                clearImage();
                getAllPosts();
            })
            .catch(error => {
                console.error('Error: ', error);
            });
    }
};



const getAllPosts = () => {
    fetch(BACKEND_URL + '/blog')
        .then(res => {
            if (!res.ok) {
                throw new Error("res failed" + res.statusText);
            }
            return res.json();
        })
        .then(data => {
            console.log("Parsed JSON: ", data);
            list.innerHTML = ''; // Clear existing posts

            data.forEach(post => {
                //logs
                console.log("ID: ", post.id);
                console.log("First name: ", post.first_name);
                console.log("Last name: ", post.last_name);
                console.log("Text: ", post.text);
                //add to html

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
                firstNameElement.textContent = post.first_name;
                nameContainer.appendChild(firstNameElement);

                //last name element
                const lastNameElement = document.createElement('p');
                lastNameElement.textContent = post.last_name;
                nameContainer.appendChild(lastNameElement);

                //add name container to main container
                div.appendChild(nameContainer);


                //username element
                const userNameElement = document.createElement('p');
                userNameElement.textContent = "@" + post.last_name;
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


                const commentButton = document.createElement('button');
                commentButton.innerHTML = `<i class="bi bi-chat-right-text-fill"></i> Comment`;
                commentButton.id = `reaction-button-1`; //assign post id to buttons class
                commentButton.classList.add('reaction-button', 'me-2');
                commentButton.addEventListener('click', () => {
                    getAndAssignDetails(post.id)
                    postModal.show()
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
            });
            getUsersLikes();
        })
        .catch(error => {
            console.error("Error getting posts: ", error);
        });
};


async function getUsersLikes() {
    try {
        const likedComments = await user.getUserPostLikes(user.user_id);
        likedComments.forEach(element => {
            console.log(element.post_id, "post ids");
            const likeButton = document.querySelector(`#reaction-button-2[data="${element.post_id}"]`);
            console.log(likeButton, " liked buttons");
            if (likeButton) {
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
        const updateLikes = await post.likeDislikePost(post_id, classList);
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
        console.log("please log in");
        window.location.href = "loginPrompt.html";
    }
}

document.addEventListener('DOMContentLoaded', function () {
    if (list) {
        getAllPosts();
        console.log(user.user_id + "user class id");
    }
    updateCharCount();
});


input.addEventListener('input', updateCharCount);
postButton.addEventListener('click', authCheck);

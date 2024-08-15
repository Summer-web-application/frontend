import { Fetch } from "./Classes/Fetch.js";
import { User } from "./Classes/User.js";
import { BACKEND_URL } from "./config.js";
const fetch = new Fetch();
const user = new User();
const addCommentButton = document.getElementById('add-comment-button');
const addCommentText = document.getElementById('add-comment-text');
const container = document.querySelector('.comments-section');

async function initializePost(postId) {
    if (postId != null) {
        try {
            await getAndAssignDetails(postId);
            await getPostComments(postId);
            await getUsersLikes(postId);
            updatePost();
        } catch (error) {
            console.error(error);
        }
    } else {
        return;
    }
    // eventlistener for adding a comment
    addCommentButton.addEventListener('click', handleAddComment);
    const modalElement = document.getElementById('postModal');
    //reset values on close
    modalElement.addEventListener('hidden.bs.modal', function () {
        document.querySelector('.profile-header .profile-info h1').innerText = '';
        document.querySelector('.profile-header .profile-info p').innerText = '';
        document.querySelector('.post-content p').innerText = '';
        document.querySelector('.post-image').src = '';
        document.querySelector('.post-timestamp').innerText = '';
        //remove event listener so it doesnt dublicate
        addCommentButton.removeEventListener('click', handleAddComment); 
        // remove the postId param from URL
        const url = new URL(window.location.href);
        url.searchParams.delete('postId');
        history.replaceState(null, '', url.toString());
    });
}
function handleAddComment() {
    const urlParams = new URLSearchParams(window.location.search); // get the current URL
    const postId = urlParams.get('postId'); // get the "postId" parameter
    postComment(postId);
}

// get the post details and assign them to the right element
async function getAndAssignDetails(postId) {
    try {
        // get the postId
        const post = await fetch.getOnePost(postId);
        // assign the details to the appropriate elements
        document.querySelector('.profile-header .profile-info h1').innerText = post[0].firstName + ' ' + post[0].lastName;
        document.querySelector('.profile-header .profile-info p').innerText = '@' + post[0].username;
        document.querySelector('.post-content p').innerText = post[0].text;
        const postImage = document.querySelector('.post-image');
        if(post[0].image !== '') {
            assignImage(post[0].image, postImage);
        }
        document.querySelector('.post-timestamp').innerText = post[0].createdAt;
    } catch (error) {
        console.log(error)
    }
}
// assign the image to the image element
function assignImage(imageValue, postImage) {
    if (postImage) {
        postImage.src = BACKEND_URL + '/images/' + imageValue;
        postImage.style.maxWidth = '300px';
        postImage.style.maxHeight = '300px';
    }
}

// get the posts comments
async function getPostComments(postId) {
    try {
        container.innerHTML = '';
        const comments = await fetch.getComments(postId);
        renderComment(comments, postId);
    } catch (error) {
        console.log(error);
    }
}

// post a comment
async function postComment(post_id) {
    const user_id = user.id;
    const text = addCommentText.value.trim();
    const data = { text, post_id, user_id };
    const comment = await fetch.postComment(data);
    if (comment != undefined) {
        renderComment(comment, post_id);
        addCommentText.value = '';
    } else {
        addCommentText.value = '';
    }
}

// render the comments under the post
function renderComment(data, postId) {
    data.forEach(comment => {
        // create the necessary elements to hold the data
        const commentContainer = document.createElement('div');
        commentContainer.classList.add('comment');

        const commentProfile = document.createElement('div');
        commentProfile.classList.add('comment-profile');

        const commentBody = document.createElement('div');
        commentBody.classList.add('comment-body');

        const commentName = document.createElement('p');
        commentName.textContent = comment.name;

        const commentUsername = document.createElement('p');
        commentUsername.textContent = " @" + comment.username;

        const commentText = document.createElement('p');
        commentText.textContent = comment.text;

        const date = document.createElement('p');
        date.classList.add('comment-timestamp');
        date.textContent = comment.date;

        // create a like button with Bootstrap
        const likeButton = document.createElement('button');
        likeButton.innerHTML = `<i class="bi bi-heart-fill"></i> ${comment.likes}`;
        likeButton.id = `reaction-button-2`;
        likeButton.classList.add('reaction-button', 'me-2');
        likeButton.setAttribute('data', comment.id)
        likeButton.addEventListener('click', () => {
            likeDislikeComment(comment.id, likeButton.classList, postId);
        });

        // create the edit, save and delete buttons
        const editCommentButton = document.createElement('button');
        editCommentButton.classList.add('edit-comment-btn');
        editCommentButton.innerText = 'Edit';

        const saveCommentButton = document.createElement('button');
        saveCommentButton.classList.add('save-comment-btn');
        saveCommentButton.style.display = 'none';
        saveCommentButton.innerText = 'Save';

        const deleteCommentButton = document.createElement('button');
        deleteCommentButton.classList.add('delete-comment-btn', 'btn', 'btn-danger');
        deleteCommentButton.style.display = 'none';
        deleteCommentButton.innerText = 'Delete';

        const editCommentTextarea = document.createElement('textarea');
        editCommentTextarea.classList.add('edit-comment-textarea');
        editCommentTextarea.style.display = 'none';

        commentProfile.appendChild(commentName);
        commentProfile.appendChild(commentUsername);
        commentContainer.appendChild(commentProfile);

        commentBody.appendChild(commentText);
        commentBody.appendChild(likeButton);
        commentContainer.appendChild(commentBody);
        commentContainer.appendChild(date);
        container.appendChild(commentContainer);

        // if the user is the owner of the comment allow them to edit or delete it
        if (user.username === comment.username) {
            editCommentButton.addEventListener('click', function () {
                if (editCommentTextarea.style.display === 'none') {
                    editCommentTextarea.value = commentText.innerText;
                    commentText.style.display = 'none';
                    editCommentTextarea.style.display = 'block';
                    saveCommentButton.style.display = 'block';
                    deleteCommentButton.style.display = 'block';
                    editCommentButton.innerText = 'Cancel';
                } else {
                    commentText.style.display = 'block';
                    editCommentTextarea.style.display = 'none';
                    saveCommentButton.style.display = 'none';
                    deleteCommentButton.style.display = 'none'; 
                    editCommentButton.innerText = 'Edit';
                }
            });

            saveCommentButton.addEventListener('click', async function () {
                const updatedComment = editCommentTextarea.value.trim();
                if (updatedComment === '') return;

                try {
                    const success = await updateComment(comment.id, postId, updatedComment);
                    if (success) {
                        commentText.innerText = updatedComment;
                        commentText.style.display = 'block';
                        editCommentTextarea.style.display = 'none';
                        saveCommentButton.style.display = 'none';
                        deleteCommentButton.style.display = 'none';
                        editCommentButton.innerText = 'Edit';
                    } else {
                        console.error('Failed to update comment');
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            });
            deleteCommentButton.addEventListener('click', async function () {
                try {
                    const success = await fetch.deleteComment(comment.id);
                    if (success) {
                        commentContainer.remove();
                    } else {
                        console.error('Failed to delete comment');
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            });
            commentBody.appendChild(editCommentTextarea);
            commentBody.appendChild(saveCommentButton);
            commentBody.appendChild(deleteCommentButton);
            commentBody.appendChild(editCommentButton);
        }
    });
}

// get user likes
async function getUsersLikes(postId) {
    if(!user.isLoggedIn){
        return;
    }
    try {
        const likedComments = await fetch.getUserCommentLikes(user.id, postId);
        likedComments.forEach(element => {
            const likeButton = document.querySelector(`#reaction-button-2[data="${element.comment_id}"]`);
            if (likeButton) {
                likeButton.classList.add('liked'); // mark the comments that are liked
            }
        })
    } catch (error) {
        console.log(error);
    }
}

// function to like or dislike a commment
async function likeDislikeComment(commentId, classList, postId) {
    try {
        //pass classlist to check the users comment like state
        const updateLikes = await fetch.likeDislikeComment(commentId, postId, classList, user.id);
        if(updateLikes === undefined){
            return;
        }
        //update the like count
        const likeButton = document.querySelector(`#reaction-button-2[data="${commentId}"]`);
        if (!likeButton) {
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

// update comments
async function updateComment(commentId, postId, updatedCommentText) {
    try {
        const data = {
            text: updatedCommentText
        };
        const result = await fetch.editComment(commentId, postId, data);
        return result
    } catch (error) {
        console.error('Failed to update comment', error);
        return false;
    }
}
function handleEditButtonClick() {
    const editButton = document.querySelector('.edit-post-btn');
    const saveButton = document.querySelector('.save-edit-btn');
    const deleteButton = document.querySelector('.delete-post-btn');
    const postContentP = document.querySelector('.post-content p');
    const editTextarea = document.querySelector('.edit-textarea');

    if (editTextarea.style.display === 'none') {
        editTextarea.value = postContentP.innerText;
        postContentP.style.display = 'none';
        editTextarea.style.display = 'block';
        saveButton.style.display = 'block';
        deleteButton.style.display = 'block'; 
        editButton.innerText = 'Cancel';
    } else {
        postContentP.style.display = 'block';
        editTextarea.style.display = 'none';
        saveButton.style.display = 'none';
        deleteButton.style.display = 'none';
        editButton.innerText = 'Edit';
    }
}

async function handleSaveButtonClick() {
    const urlParams = new URLSearchParams(window.location.search); // get the current URL
    const postId = urlParams.get('postId'); // get the "postId" parameter

    const editTextarea = document.querySelector('.edit-textarea');
    const postContentP = document.querySelector('.post-content p');
    const saveButton = document.querySelector('.save-edit-btn');
    const deleteButton = document.querySelector('.delete-post-btn');

    const updatedContent = editTextarea.value.trim();
    if (updatedContent === '') return;

    try {
        const success = await fetch.editPost(postId, updatedContent);
        if (success) {
            postContentP.innerText = updatedContent;
            postContentP.style.display = 'block';
            editTextarea.style.display = 'none';
            saveButton.style.display = 'none';
            deleteButton.style.display = 'none';
            document.querySelector('.edit-post-btn').innerText = 'Edit';
        } else {
            console.error('Failed to update post');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function handleDeleteButtonClick() {
    const urlParams = new URLSearchParams(window.location.search); // get the current URL
    const postId = urlParams.get('postId'); // get the "postId" parameter

    try {
        const success = await fetch.deletePost(postId);
        if (success) {
            window.location.href = 'index.html'; 
        } else {
            console.error('Failed to delete post');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function updatePost() {
    const editButton = document.querySelector('.edit-post-btn');
    const saveButton = document.querySelector('.save-edit-btn');
    const deleteButton = document.querySelector('.delete-post-btn');
    const postUsername = document.querySelector(".profile-info p").textContent;

    // Check if the current user is the owner of the post
    if ("@" + user.username === postUsername) {
        editButton.style.display = 'block';
    } else {
        editButton.style.display = 'none';
    }

    //seperate event listeners so they can be removed and wont stack
    // Remove old event listeners
    editButton.removeEventListener('click', handleEditButtonClick);
    saveButton.removeEventListener('click', handleSaveButtonClick);
    deleteButton.removeEventListener('click', handleDeleteButtonClick);

    // Add new event listeners
    if (editButton.style.display !== 'none') {
        editButton.addEventListener('click', handleEditButtonClick);
        saveButton.addEventListener('click', handleSaveButtonClick);
        deleteButton.addEventListener('click', handleDeleteButtonClick);
    }
}

export { initializePost }
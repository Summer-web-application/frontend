import { Fetch } from "./Classes/Fetch.js";
import { User } from "./Classes/User.js";
import { BACKEND_URL } from "./config.js";
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('postId');
const fetch = new Fetch();
const user = new User();
const addCommentButton = document.getElementById('add-comment-button');
const addCommentText = document.getElementById('add-comment-text');
const container = document.querySelector('.comments-section');

// get the post details and assign them to the right element
async function getAndAssignDetails(post_id) {
    try {
        // get the postId
        const post = await fetch.getOnePost(post_id);
        // assign the details to the appropriate elements
        document.querySelector('.profile-header .profile-info h1').innerText = post[0].firstName + ' ' + post[0].lastName;
        document.querySelector('.profile-header .profile-info p').innerText = '@' + post[0].username;
        document.querySelector('.post-content p').innerText = post[0].text;
        if(post[0].image !== '') {
            const postImage = document.querySelector('.post-image');
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
async function getPostComments() {
    try {
        container.innerHTML = '';
        const comments = await fetch.getComments(postId);
        renderComment(comments);
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
        renderComment(comment);
        addCommentText.value = '';
    } else {
        addCommentText.value = '';
    }
}

// render the comments under the post
function renderComment(data) {
    data.forEach(comment => {
        // create the necessary elements to hold the data
        const commentContainer = document.createElement('div');
        commentContainer.classList.add('comment');

        const commentProfile = document.createElement('div');
        commentProfile.classList.add('comment-profile');

        const commentBody = document.createElement('div');
        commentBody.classList.add('comment-body');

        const profilePicture = document.createElement('img');
        profilePicture.src = "https://divedigital.id/wp-content/uploads/2022/07/2-Blank-PFP-Icon-Instagram.jpg";

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
            likeDislikeComment(comment.id, likeButton.classList);
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

        //commentProfile.appendChild(profilePicture);
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
                    const success = await updateComment(comment.id, updatedComment);
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
async function getUsersLikes() {
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
async function likeDislikeComment(commentId, classList) {
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
async function updateComment(commentId, updatedCommentText) {
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

document.addEventListener("DOMContentLoaded", async function () {
    if (postId != null) {
        try {
            await getAndAssignDetails(postId);
            await getPostComments(postId);
            await getUsersLikes();
            await updatePost();
        } catch (error) {
            console.error('Error loading post details or comments:', error);
        }
    } else {
        console.log("error not valid postId");
    }
    // reset URL when modal is hidden
    const modalElement = document.getElementById('postModal');
    modalElement.addEventListener('hidden.bs.modal', function () {
        // remove the postId param from URL
        const url = new URL(window.location.href);
        url.searchParams.delete('postId');
        history.replaceState(null, '', url.toString());
    });
});

// eventlistener for adding a comment
addCommentButton.addEventListener('click', async () => {
    postComment(postId);
});

// update post content
async function updatePost() {
    const editButton = document.querySelector('.edit-post-btn');

    const postUsername = document.querySelector(".profile-info p").textContent

    // check if the current user is the owner of the post
    if ("@" + user.username === postUsername) {
        editButton.style.display = 'block';
    } else {
        editButton.style.display = 'none';
    }

    if (editButton.style.display !== 'none') {
        const saveButton = document.querySelector('.save-edit-btn');
        const deleteButton = document.querySelector('.delete-post-btn');
        const postContentP = document.querySelector('.post-content p');
        const editTextarea = document.querySelector('.edit-textarea');

        editButton.addEventListener('click', function () {
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
        });


        saveButton.addEventListener('click', async function () {
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
                    editButton.innerText = 'Edit';
                } else {
                    console.error('Failed to update post');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });

        // delet post
        deleteButton.addEventListener('click', async function () { 
            try {
                const success = await fetch.deletePost(postId); // send delete request 
                if (success) {
                    window.location.href = 'index.html'; 
                } else {
                    console.error('Failed to delete post');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });

    }
}
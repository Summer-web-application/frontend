
import { Post } from "./Classes/Post.js";
import { User } from "./Classes/User.js";
const user = new User();
const post = new Post();

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('postId');

const addCommentButton = document.getElementById('add-comment-button');
const addCommentText = document.getElementById('add-comment-text');

async function getAndAssignDetails(postId) {
    try {
        await post.getOnePost(postId);
        document.querySelector('.profile-header .profile-info h1').innerText = post.post_firstName + ' ' + post.post_lastName;
        document.querySelector('.profile-header .profile-info p').innerText = '@' + post.post_username;
        document.querySelector('.post-content p').innerText = post.post_text;
        document.querySelector('.post-timestamp').innerText = post.post_createdAt;

    } catch (error) {
        console.log(error)
    }
    //get comments after post details
    getPostComments(postId);
}
async function getUsersLikes() {
    try {
        const likedComments = await user.getUserCommentLikes(user.user_id, postId);
        console.log(likedComments, "whats in here");
        likedComments.forEach(element => {
            console.log(element.comment_id, "comment ids");
            const likeButton = document.querySelector(`#reaction-button-2[data="${element.comment_id}"]`);
            console.log(likeButton, " liked buttons");
            if (likeButton) {
                likeButton.classList.add('liked');
            }
        })
    } catch (error) {
        console.log(error);
    }
}
async function likeDislikeComment(commentId, classList) {
    try {
        //pass classlist to check the users comment like state
        const updateLikes = await post.likeDislikeComment(commentId, postId, classList);
        console.log(updateLikes + " updated like count in post");
        //update the like count
        const likeButton = document.querySelector(`#reaction-button-2[data="${commentId}"]`);
        if (!likeButton) {
            console.log("likebutton not found");
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

async function getPostComments(postId) {
    try {
        const comments = await post.getComments(postId);
        const container = document.querySelector('.comments-section');
        container.innerHTML = '';
        comments.forEach(comment => {
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

            const likeButton = document.createElement('button');
            likeButton.innerHTML = `<i class="bi bi-heart-fill"></i> ${comment.likes}`;
            likeButton.id = `reaction-button-2`;
            likeButton.classList.add('reaction-button', 'me-2');
            likeButton.setAttribute('data', comment.id)
            likeButton.addEventListener('click', () => {
                likeDislikeComment(comment.id, likeButton.classList);
            });
            console.log(likeButton.outerHTML, "created like button");

            const editCommentButton = document.createElement('button');
            editCommentButton.classList.add('edit-comment-btn');
            editCommentButton.innerText = 'Edit';

            const saveCommentButton = document.createElement('button');
            saveCommentButton.classList.add('save-comment-btn');
            saveCommentButton.style.display = 'none';
            saveCommentButton.innerText = 'Save';

            const editCommentTextarea = document.createElement('textarea');
            editCommentTextarea.classList.add('edit-comment-textarea');
            editCommentTextarea.style.display = 'none';

            editCommentButton.addEventListener('click', function () {
                if (editCommentTextarea.style.display === 'none') {
                    editCommentTextarea.value = commentText.innerText;
                    commentText.style.display = 'none';
                    editCommentTextarea.style.display = 'block';
                    saveCommentButton.style.display = 'block';
                    editCommentButton.innerText = 'Cancel';
                } else {
                    commentText.style.display = 'block';
                    editCommentTextarea.style.display = 'none';
                    saveCommentButton.style.display = 'none';
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
                        editCommentButton.innerText = 'Edit';
                    } else {
                        console.error('Failed to update comment');
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            });

            // Profile things
            commentProfile.appendChild(editCommentButton);
            commentProfile.appendChild(profilePicture);
            commentProfile.appendChild(commentName);
            commentProfile.appendChild(commentUsername);
            commentContainer.appendChild(commentProfile);

            // Comment body things
            commentBody.appendChild(commentText);
            commentBody.appendChild(editCommentTextarea);
            commentBody.appendChild(saveCommentButton);
            commentBody.appendChild(editCommentButton);
            commentBody.appendChild(likeButton);
            commentContainer.appendChild(commentBody);
            commentContainer.appendChild(date);
            container.appendChild(commentContainer);
        });
    } catch (error) {
        console.log(error);
    }
    //get what comments user has liked after the comments are set
    getUsersLikes();
}


async function postComment(post_id) {
    const user_id = user.user_id;
    const text = addCommentText.value.trim();
    const data = { text, post_id, user_id };
    const comment = await post.postComment(data);
    if (comment != undefined) {
        addCommentToPage(comment);
        addCommentText.value = '';
    } else {
        console.log("Not valid comment");
    }
}
function addCommentToPage(comment) {
    const container = document.querySelector('.comments-section');

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

    const likeButton = document.createElement('button');
    likeButton.innerHTML = `<i class="bi bi-heart-fill"></i> ${comment.likes}`;
    likeButton.id = `reaction-button-2`;
    likeButton.classList.add('reaction-button', 'me-2');
    likeButton.setAttribute('data', comment.id)
    likeButton.addEventListener('click', () => {
        likeDislikeComment(comment.id, likeButton.classList);
    });

    const editCommentButton = document.createElement('button');
    editCommentButton.classList.add('edit-comment-btn');
    editCommentButton.innerText = 'Edit';

    const saveCommentButton = document.createElement('button');
    saveCommentButton.classList.add('save-comment-btn');
    saveCommentButton.style.display = 'none';
    saveCommentButton.innerText = 'Save';

    const editCommentTextarea = document.createElement('textarea');
    editCommentTextarea.classList.add('edit-comment-textarea');
    editCommentTextarea.style.display = 'none';

    editCommentButton.addEventListener('click', function () {
        if (editCommentTextarea.style.display === 'none') {
            editCommentTextarea.value = commentText.innerText;
            commentText.style.display = 'none';
            editCommentTextarea.style.display = 'block';
            saveCommentButton.style.display = 'block';
            editCommentButton.innerText = 'Cancel';
        } else {
            commentText.style.display = 'block';
            editCommentTextarea.style.display = 'none';
            saveCommentButton.style.display = 'none';
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
                editCommentButton.innerText = 'Edit';
            } else {
                console.error('Failed to update comment');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Profile things
    commentProfile.appendChild(profilePicture);
    commentProfile.appendChild(commentName);
    commentProfile.appendChild(commentUsername);
    commentContainer.appendChild(commentProfile);

    // Comment body things
    commentBody.appendChild(commentText);
    commentBody.appendChild(editCommentTextarea);
    commentBody.appendChild(saveCommentButton);
    commentBody.appendChild(editCommentButton);
    commentBody.appendChild(likeButton);
    commentContainer.appendChild(commentBody);
    commentContainer.appendChild(date);
    container.appendChild(commentContainer);
}

async function updateComment(commentId, updatedCommentText) {
    try {
        const data = {
            text: updatedCommentText
        };
        console.log(data)
        return await post.editComment(commentId, postId, data);
    } catch (error) {
        console.error('Failed to update comment', error);
        return false;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    if (postId != null) {
        getAndAssignDetails(postId);

        //-----edit section-----//
        const editButton = document.querySelector('.edit-post-btn');
        const saveButton = document.querySelector('.save-edit-btn');
        const postContentP = document.querySelector('.post-content p');
        const editTextarea = document.querySelector('.edit-textarea');

        editButton.addEventListener('click', function () {
            if (editTextarea.style.display === 'none') {
                editTextarea.value = postContentP.innerText;
                postContentP.style.display = 'none';
                editTextarea.style.display = 'block';
                saveButton.style.display = 'block';
                editButton.innerText = 'Cancel';
            } else {
                postContentP.style.display = 'block';
                editTextarea.style.display = 'none';
                saveButton.style.display = 'none';
                editButton.innerText = 'Edit';
            }
        });

        saveButton.addEventListener('click', async function () {
            const updatedContent = editTextarea.value.trim();
            if (updatedContent === '') return;

            try {
                const success = await updatePost(postId, updatedContent);
                if (success) {
                    postContentP.innerText = updatedContent;
                    postContentP.style.display = 'block';
                    editTextarea.style.display = 'none';
                    saveButton.style.display = 'none';
                    editButton.innerText = 'Edit';
                } else {
                    console.error('Failed to update post');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
        //--------edit section end-------//
    } else {
        console.log("error not valid postId");
    }
});

addCommentButton.addEventListener('click', async () => {
    postComment(postId);
});

getAndAssignDetails(postId);


async function fetchCommentProfile(userId) {
    const userResponse = await fetch(`http://localhost:3000/api/user/${userId}`);
    const profileData = await userResponse.json();
    const profile = profileData[0];

    if (!profile) {
        console.error('Error: user profile not found');
    }
    return profile;
}

async function updatePost(postId, text) {
    // const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
    //     method: 'PUT',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({ text })
    // });

    // return response.ok;

    // PLACEHOLDER
    console.log(postId + " updated to " + text);
    return "success";
}

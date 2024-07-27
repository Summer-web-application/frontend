document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');
    
    if (postId != null) {
        try {
            const post = await fetchPost(postId);
            if (!post) return;

            displayPostContent(post);

            const profile = await fetchUserProfile(post.user_id);
            if (!profile) return;

            displayUserProfile(profile);

            const comments = await fetchComments(postId);
            if (!comments) return;

            displayComments(comments);
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        console.error('postId not found in URL parameters');
    }

    const postButton = document.querySelector('.add-comment button');
    postButton.addEventListener('click', async function () {
        const textarea = document.querySelector('.add-comment textarea');
        const commentText = textarea.value.trim();
        if (commentText === '') return;

        try {
            const userId = 1; // Replace with actual user ID
            const success = await postComment(postId, commentText, userId);
            if (success) {
                textarea.value = '';
            } else {
                console.error('Failed to post comment');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

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
});

async function fetchPost(postId) {
    const postResponse = await fetch(`http://localhost:3000/api/posts/${postId}`);
    const userPostsData = await postResponse.json();
    const post = userPostsData.find(p => p.id == postId);

    if (!post) {
        console.error('Post not found');
    }
    return post;
}

function displayPostContent(post) {
    document.querySelector('.post-content p').innerText = post.text;
}

async function fetchUserProfile(userId) {
    const userResponse = await fetch(`http://localhost:3000/api/user/${userId}`);
    const profileData = await userResponse.json();
    const profile = profileData[0];

    if (!profile) {
        console.error('Error: user profile not found');
    }
    return profile;
}

function displayUserProfile(profile) {
    document.querySelector('.profile-header .profile-info h1').innerText = `${profile.first_name} ${profile.last_name}`;
    document.querySelector('.profile-header .profile-info p').innerText = `@${profile.username}`;
}

async function fetchComments(postId) {
    const commentsResponse = await fetch(`http://localhost:3000/api/posts/${postId}/comments`);
    const commentsData = await commentsResponse.json();
    return commentsData;
}

function displayComments(comments) {
    const commentsSection = document.querySelector('.comments-section');
    const commentTemplate = commentsSection.querySelector('.comment');
    
    comments.forEach(async comment => {
        const commentProfile = await fetchCommentProfile(comment.user_id);

        const commentElement = commentTemplate.cloneNode(true);
        commentElement.style.display = 'block';
        commentElement.querySelector('.comment-profile-info h1').innerText = `${comment.first_name} ${comment.last_name}`;
        commentElement.querySelector('.comment-profile-info p').innerText = `@${commentProfile.username}`;
        commentElement.querySelector('.comment-content p').innerText = comment.text;
        commentElement.querySelector('.comment .id').innerText = comment.id;

        commentsSection.appendChild(commentElement);
    });

    commentTemplate.remove();
}

async function postComment(postId, commentText, userId) {
    try {
        const response = await fetch(`http://localhost:3000/api/posts/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: commentText, likes: 0, post_id: postId, user_id: userId }),
        });
        if (response.status === 201) {
            return true;
        } else {
            const data = await response.json();
            console.error('Failed to post comment:', data);
            return false;
        }
    } catch (error) {
        console.error('Error posting comment:', error);
        return false;
    }
}

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

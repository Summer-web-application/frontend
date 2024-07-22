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

    } catch (error){
        console.log(error)
    }
}
async function likeComment(commentId) {
    try {
        const updateLikes = await post.likeComment(commentId);
        console.log(updateLikes + " updated like count in post");
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
            likeButton.addEventListener('click', () => {
                    likeComment(comment.id);
            });
            
            //profile things
            commentProfile.appendChild(profilePicture);
            commentProfile.appendChild(commentName);
            commentProfile.appendChild(commentUsername);
            commentContainer.appendChild(commentProfile);

            //comment body things
            commentBody.appendChild(commentText);
            commentBody.appendChild(likeButton);
            commentContainer.appendChild(commentBody);
            commentContainer.appendChild(date);
            container.appendChild(commentContainer);
        });

    } catch(error){
        console.log(error);
    }
}

async function postComment(postId) {
    const userId = user.user_id;
    const text = addCommentText.value.trim();
    const data = {text, postId, userId};
    const comment = await post.postComment(data);
    if(comment != undefined) {
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
            likeButton.addEventListener('click', () => {
                    likeComment(post.id);
            });
            
            //profile things
            commentProfile.appendChild(profilePicture);
            commentProfile.appendChild(commentName);
            commentProfile.appendChild(commentUsername);
            commentContainer.appendChild(commentProfile);

            //comment body things
            commentContainer.appendChild(commentText);
            commentContainer.appendChild(date);

            container.appendChild(commentContainer);
}

document.addEventListener("DOMContentLoaded", function () {
    if (postId != null) {
        getAndAssignDetails(postId);
        getPostComments(postId); 
    } else {
        console.log("error not valid postId");
    }
});

addCommentButton.addEventListener('click', () => postComment(postId));

//         fetch('URL')
//             .then(response => response.json())
//             .then(userPostsData => {
//                 const post = userPostsData.find(p => p.id == postId);
//                 if (post) {
//                     document.querySelector('.post-content p').innerText = post.content;
//                     document.querySelector('.post-timestamp').innerText = post.timestamp;
//                 } else {
//                     console.error('Post not found');
//                 }
//             })
//             .catch(error => console.error('Error getting posts:', error));
        
//         fetch('URL')
//             .then(response => response.json())
//             .then(data => {
//                 document.querySelector('.profile-header img').src = userProfileData.profilePicture;
//                 document.querySelector('.profile-header .profile-info h1').innerText = userProfileData.name;
//                 document.querySelector('.profile-header .profile-info p').innerText = '@' + userProfileData.handle;
//             })
//             .catch(error => console.error('Error cant get user profile:', error));
            

//         const post = userPostsData.find(p => p.id == postId);

//         if (post) {
//             document.querySelector('.profile-header img').src = userProfileData.profilePicture;
//             document.querySelector('.profile-header .profile-info h1').innerText = userProfileData.name;
//             document.querySelector('.profile-header .profile-info p').innerText = '@' + userProfileData.handle;
            
//             document.querySelector('.post-content p').innerText = post.content;
//             document.querySelector('.post-timestamp').innerText = post.timestamp;
//         } else {
//             console.error('Post not found');
//         }
//     } else {
//         console.error('Post ID not provided');
//     }
//  });


    const userProfileData = {
        profilePicture: "https://divedigital.id/wp-content/uploads/2022/07/2-Blank-PFP-Icon-Instagram.jpg",
        name: "Jane Smith",
        handle: "janesmith",
        bio: "Hi, I'm Jane Smith :)"
    };

    const userPostsData = [
        {
            id: 1,
            content: "hi.",
            timestamp: "May 1, 2024"
        },
        {
            id: 2,
            content: "⭐",
            timestamp: "April 25, 2024"
        },
        {
            id: 3,
            content: "Wikipedia is a free content online encyclopedia written and maintained by a community of volunteers, known as Wikipedians, through open collaboration and the use of the wiki-based editing system MediaWiki. Wikipedia is the largest and most-read reference work in history. It is consistently ranked as one of the ten most popular websites in the world, and as of 2024 is ranked the fifth most visited website on the Internet by Semrush, and second by Ahrefs. Founded by Jimmy Wales and Larry Sanger on January 15, 2001, Wikipedia is hosted by the Wikimedia Foundation, an American nonprofit organization that employs a staff of over 700 people.",
            timestamp: "April 20, 2024"
        }
    ];



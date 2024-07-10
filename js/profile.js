import { User } from "./Classes/User.js";

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

/*
fetch('URL')
    .then(response => response.json())
    .then(posts => {
        const postsContainer = document.getElementById('user-posts');
        posts.forEach((post) => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');

            const postContent = document.createElement('div');
            postContent.classList.add('post-content');
            const contentParagraph = document.createElement('p');
            contentParagraph.innerText = post.content;
            postContent.appendChild(contentParagraph);

            const postTimestamp = document.createElement('div');
            postTimestamp.classList.add('post-timestamp');
            postTimestamp.innerText = post.timestamp;

            postElement.appendChild(postContent);
            postElement.appendChild(postTimestamp);
            postsContainer.appendChild(postElement);

            postElement.addEventListener('click', function () {
                window.location.href = `post.html?postId=${index}`;
            });

            fetch('URL')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('profile-picture').src = data.profilePicture;
                    document.getElementById('user-name').innerText = data.name;
                    document.getElementById('user-handle').innerText = '@' + data.handle;
                    document.getElementById('user-bio').innerText = data.bio;
                })
    })
    .catch(error => console.error('Error cant get user profile:', error));

    })
    .catch(error => console.error('Error cant get user posts:', error));
*/
const user = new User();

document.getElementById('profile-picture').src = userProfileData.profilePicture;
document.getElementById('user-name').innerText = user.username;
document.getElementById('user-handle').innerText = '@' + userProfileData.handle;
document.getElementById('user-bio').innerText = userProfileData.bio;

document.addEventListener("DOMContentLoaded", function () {
    const postsContainer = document.getElementById('user-posts');
    userPostsData.forEach((post) => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        
        const postContent = document.createElement('div');
        postContent.classList.add('post-content');
        const contentParagraph = document.createElement('p');
        contentParagraph.innerText = post.content;
        postContent.appendChild(contentParagraph);

        const postTimestamp = document.createElement('div');
        postTimestamp.classList.add('post-timestamp');
        postTimestamp.innerText = post.timestamp;

        postElement.appendChild(postContent);
        postElement.appendChild(postTimestamp);
        postsContainer.appendChild(postElement);

        postElement.addEventListener('click', function () {
            window.location.href = `post.html?postId=${post.id}`;
        });
    });
});
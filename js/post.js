import { Post } from "./Classes/Post.js";

async function getAndAssignDetails(postId) {
    const post = new Post()
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

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');
    
    if (postId != null) {
        getAndAssignDetails(postId)
    } else {
        console.log("error not valid postId");
    }
});
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



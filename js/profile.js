fetch('http://localhost:3000/api/user/1')
                .then(response => response.json())
                .then(data => {
                    // TEMPORARY DATA NEED TO SWITCH TO USING THE DATABASE LATER
                    data.bio = "temp"
                    data.profilePicture = "https://divedigital.id/wp-content/uploads/2022/07/2-Blank-PFP-Icon-Instagram.jpg"


                    document.getElementById('profile-picture').src = data.profilePicture;
                    document.getElementById('user-name').innerText = data[0].first_name + " " + data[0].last_name;
                    document.getElementById('user-bio').innerText = data.bio;
                })
                .catch(error => console.error('Error cant get user profile:', error));

fetch('http://localhost:3000/api/user/posts/1')
    .then(response => response.json())
    .then(posts => {
        const postsContainer = document.getElementById('user-posts');
        const postTemplate = postsContainer.querySelector('.post');

        posts.forEach(post => {
            // TEMPORARY DATA NEED TO SWITCH TO USING THE DATABASE LATER
            post.time = "May 1, 2024";

            const postElement = postTemplate.cloneNode(true);
            postElement.querySelector('.post-text').innerText = post.text;
            postElement.querySelector('.post-timestamp').innerText = post.time;
            postElement.addEventListener('click', function () {
                window.location.href = `post.html?postId=${post.id}`;
            });

            postsContainer.appendChild(postElement);
        });
        postTemplate.remove();
    })
    .catch(error => console.error('Error cant get user posts:', error));
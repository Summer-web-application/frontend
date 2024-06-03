const list = document.getElementById('blog-posts'); // container
const input = document.getElementById('post-textarea');
const postButton = document.getElementById('post-button');

//hard coded values before user login is implemented
const addPost = () => {
    const text = input.value.trim();
    const header = '';
    const likes = 0;
    const user_id = 1;
    
    if (text !== '') {
        const div = document.createElement('div');
        div.setAttribute('class', 'blog-posts-container-item');

        const data = { header, text, likes, user_id };

        fetch('http://localhost:3000/api/user/posts', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(res => {
            if(!res.ok) {
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
            getAllPosts();
        })
        .catch(error => {
            console.error('Error: ', error);
        })
        //old local add post
        // div.innerHTML = task;
        // list.insertBefore(div, list.firstChild);
        // input.value = '';
    }
};

const getAllPosts = () => {
    fetch('http://localhost:3000/api/posts')
        .then(res => {
            if (!res.ok) {
                throw new Error("res failed" + res.statusText);
            }
            //parse json
            return res.json();
        })
        .then(data => {
            console.log("Parsed JSON: ", data);

            data.forEach(post => {
                
                //logs
                console.log("ID: ", post.id);
                console.log("First name: ", post.first_name);
                console.log("Last name: ", post.last_name);
                console.log("Header: ", post.header);
                console.log("Text: ", post.text);
                //add to html

                // main container
                const div = document.createElement('div');
                div.setAttribute('class', 'blog-posts-container-item');

                //container for name
                const nameContainer = document.createElement('div');
                nameContainer.classList.add('name-container-item'); //for css styling

                //first name element
                const firstNameElement = document.createElement('p');
                firstNameElement.textContent = post.first_name
                nameContainer.appendChild(firstNameElement);

                //last name element
                const lastNameElement = document.createElement('p');
                lastNameElement.textContent = post.last_name;
                nameContainer.appendChild(lastNameElement);

                //add name container to main container
                div.appendChild(nameContainer);

                //---header maybe not needed---
                //post header element 
                // const headerElement = document.createElement('p');
                // headerElement.textContent = post.header;
                // div.appendChild(headerElement);

                //main text element
                const textElement = document.createElement('p');
                textElement.textContent = post.text;
                div.appendChild(textElement);

                // check comments button
                const button = document.createElement('button');
                button.textContent = 'Comments';
                button.id = `post-comments-button-${post.id}`; //assign post id to buttons class
                button.classList.add('post-comments-button', 'btn-primary');
                button.addEventListener('click', () => {
                    fetchComments(post.id); //get posts comments using the right id
                })
                div.appendChild(button);

                list.appendChild(div);

            })
        })
        .catch(error => {
            console.error("Error getting posts: ", error);
        })
}

const fetchComments = (postId) => {
    fetch(`http://localhost:3000/api/posts/${postId}/comments`)
    .then(res => {
        if (!res.ok) {
            throw new Error("res failed: " + res.statusText);
        }
        return res.json();
    })
    .then(comments => {
        console.log(`Comments for post ${postId}:`, comments)
        
    })
    .catch(error => {
        console.error(`Error getting comments for post ${postId}:`, error);
    });
}

//gets all posts on site load
document.addEventListener('DOMContentLoaded', getAllPosts);

postButton.addEventListener('click', addPost);

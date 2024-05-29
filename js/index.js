const list = document.getElementById('blog-posts');
const input = document.getElementById('post-textarea');
const postButton = document.getElementById('post-button');

const addPost = () => {
    const task = input.value.trim();
    if (task !== '') {
        const div = document.createElement('div');
        div.setAttribute('class', 'blog-posts-container-item');
        div.innerHTML = task;
        list.insertBefore(div, list.firstChild);
        input.value = '';
    }
};

const getAllPosts = () => {
    fetch('http://localhost:3000/api/posts')
        .then(res => {
            if (!res.ok) {
                throw new Error("Network res failed" + res.statusText);
            }
            //parse json
            return res.json();
        })
        .then(data => {
            console.log("Parsed JSON: ", data);

            data.forEach(post => {
                console.log("ID: ", post.id);
                console.log("First name: ", post.first_name);
                console.log("Last name: ", post.last_name);
                console.log("Header: ", post.header);
                console.log("Text: ", post.text);
            })
        })
        .catch(error => {
            console.error("Error getting posts: ", error);
        })
}

//gets all posts on site load
document.addEventListener('DOMContentLoaded', getAllPosts);

postButton.addEventListener('click', addPost);

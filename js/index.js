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

postButton.addEventListener('click', addPost);

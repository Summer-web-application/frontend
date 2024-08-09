import { User } from "./Classes/User.js";

const user = new User();
let allPosts = [];

function initializeNavbar() {
    const authButton = document.getElementById('authButton');

    if (user.isLoggedIn) {
        authButton.textContent = 'Logout';
    } else {
        authButton.textContent = 'Login';
    }

    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    searchInput.addEventListener('keyup', function (event) {
        const query = searchInput.value.trim().toLowerCase();
        if (query) {
            const filteredPosts = allPosts.filter(post =>
                post.text.toLowerCase().includes(query)
            );
            displaySearchSuggestions(filteredPosts);
        } else {
            searchResults.innerHTML = "";
        }
    });

    const searchForm = document.getElementById('searchForm');
    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const query = document.getElementById('searchInput').value.trim().toLowerCase();
        if (query) {
            const filteredPosts = allPosts.filter(post =>
                post.text.toLowerCase().includes(query)
            );
            displaySearchResults(filteredPosts);
        }
    });
    fetchAllPosts();
}

function displaySearchSuggestions(posts) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = "";

    posts.forEach(post => {
        const resultItem = document.createElement('a');
        resultItem.classList.add('list-group-item', 'list-group-item-action');
        resultItem.href = `post.html?postId=${post.id}`;
        resultItem.textContent = post.text;
        searchResults.appendChild(resultItem);
    });
}

async function fetchAllPosts() {
    try {
        const response = await fetch("http://localhost:3000/blog");
        if (!response.ok) {
            throw new Error("Failed to fetch posts");
        }
        allPosts = await response.json();
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
}

function displaySearchResults(posts) {
    window.location.href = `post.html?postId=${posts[0].id}`;
}

document.getElementById('authButton').addEventListener('click',async function () {
    if (user.isLoggedIn) {
        await user.logout();
        window.location.reload();
    } else {
        window.location.href = 'login.html';
    }
});

initializeNavbar();
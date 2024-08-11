import { User } from "./Classes/User.js";

const user = new User();
let allPosts = [];

// intialize the navbar
function initializeNavbar() {
    const authButton = document.getElementById('authButton');

    // check if user is logged in and update the text based on that
    if (user.isLoggedIn) {
        authButton.textContent = 'Logout';
    } else {
        authButton.textContent = 'Login';
    }

    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    // eventlistener for the 'keyup' event on the search input
    searchInput.addEventListener('keyup', function (event) {
        const query = searchInput.value.trim().toLowerCase();
        if (query) {
            // filter posts based on the search query
            const filteredPosts = allPosts.filter(post =>
                post.text.toLowerCase().includes(query)
            );
            // display the filtered search options
            displaySearchSuggestions(filteredPosts);
        } else {
            searchResults.innerHTML = "";
        }
    });

    // eventlistener for the 'submit' event on the search form
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

// show the search suggestions
function displaySearchSuggestions(posts) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = "";

    // append each option to the search results
    posts.forEach(post => {
        const resultItem = document.createElement('a');
        resultItem.classList.add('list-group-item', 'list-group-item-action');
        resultItem.href = `post.html?postId=${post.id}`;
        resultItem.textContent = post.text;
        searchResults.appendChild(resultItem);
    });
}

// get all posts
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

// redirect for the searched suggestion
function displaySearchResults(posts) {
    window.location.href = `post.html?postId=${posts[0].id}`;
}

// eventlistener for the authButton
document.getElementById('authButton').addEventListener('click',async function () {
    if (user.isLoggedIn) {
        await user.logout();
        window.location.reload();
    } else {
        window.location.href = 'login.html';
    }
});

initializeNavbar();
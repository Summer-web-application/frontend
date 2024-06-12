document.addEventListener('DOMContentLoaded', () => {
    const includeHTML = (element, url) => {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                element.innerHTML = data;
            })
            .catch(error => console.error('Error including HTML:', error));
    };

    includeHTML(document.getElementById('navbar-container'), 'navbar.html');
});
//ejs
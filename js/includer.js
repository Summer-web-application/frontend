document.addEventListener('DOMContentLoaded', () => {
    const includeHTML = (element, url) => {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                element.innerHTML = data;

            const script = document.createElement('script');
            script.type = 'module';
            script.src = '../js/navbar.js';
            document.body.appendChild(script);
            })
            .catch(error => console.error('Error including HTML:', error));
    };

    includeHTML(document.getElementById('navbar-container'), 'navbar.html');
});



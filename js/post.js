document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');

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

    if (postId !== null) {
        console.log(postId);
    } else {
        console.error('Post ID not provided');
    }
});

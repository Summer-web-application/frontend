import { BACKEND_URL } from "../js/config.js";
const imageInput = document.getElementById('image-input');
const imagePreview = document.getElementById('image-preview');


// function to resize the image to a maximum size of 300px while maintaining aspect ratio
export const resizeImage = (file, callback) => {
    const reader = new FileReader(); // create a filereader to read the image file
    reader.onload = (event) => {
        const img = new Image();    
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            let width = img.width; // get the images width
            let height = img.height; // get the images height
            const maxSize = 300;

            // adjust the height and width of the image
            if (width > height) {
                if (width > maxSize) {
                    height *= maxSize / width;
                    width = maxSize;
                }
            } else {
                if (height > maxSize) {
                    width *= maxSize / height;
                    height = maxSize;
                }
            }

            // set the canvas dimensions for the new resized image
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height); // draw the image on the canvas
            callback(canvas.toDataURL('image/png'));
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
};

// function to display the image
export const displayImage = (imageDataURL, imagePreview, clearImage) => {
    imagePreview.innerHTML = ''; // clear previous input
    const imgContainer = document.createElement('div');
    imgContainer.classList.add('position-relative', 'd-inline-block'); //utility classes for styling

    const img = document.createElement('img');
    img.src = imageDataURL;
    img.style.maxWidth = '300px';
    img.style.maxHeight = '300px';
    img.classList.add('img-thumbnail');
    imgContainer.appendChild(img);

    // the close button on the image preview
    const closeButton = document.createElement('button');
    closeButton.innerHTML = 'X';
    closeButton.classList.add('btn', 'btn-danger', 'btn-sm', 'position-absolute', 'top-0', 'end-0');
    closeButton.style.transform = 'translate(50%, -50%)';
    closeButton.addEventListener('click', () => clearImage(imagePreview, imageInput)); // eventlistener to call clearImage()
    imgContainer.appendChild(closeButton);

    imagePreview.appendChild(imgContainer);
};

//clear image input
export const clearImage = () => {
    imagePreview.innerHTML = '';
    imageInput.value = '';
};

export const handleImageSelection = () => {
    imageInput.addEventListener('change', () => {
        const file = imageInput.files[0]; // get the selected file
        if (file) {
            // if a file is selected display the image and resize it
            resizeImage(file, (resizedImage) => {
                displayImage(resizedImage, imagePreview, () => clearImage(imagePreview, imageInput)); 
            });
        }
    });
};

// function to get the selected image file from the input element
export const getInputFile = () => {
    const fileInput = document.getElementById('image-input');
    if(fileInput.files.length > 0) {
        return fileInput.files[0];
    }
    return null;
};

// function to display the image on a post
export const displayPostImage = (postImage, container) => {
    if (postImage) {
        const imageElement = document.createElement('img');
        imageElement.src = BACKEND_URL + '/images/' + postImage;
        imageElement.style.maxWidth = '300px';
        imageElement.style.maxHeight = '300px';
        container.appendChild(imageElement);
    }
};
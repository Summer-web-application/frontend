const imageInput = document.getElementById('image-input');
const imagePreview = document.getElementById('image-preview');

export const resizeImage = (file, callback) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            let width = img.width;
            let height = img.height;
            const maxSize = 300;

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

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            callback(canvas.toDataURL('image/png'));
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
};

export const displayImage = (imageDataURL, imagePreview, clearImage) => {
    imagePreview.innerHTML = '';
    const imgContainer = document.createElement('div');
    imgContainer.classList.add('position-relative', 'd-inline-block');

    const img = document.createElement('img');
    img.src = imageDataURL;
    img.style.maxWidth = '300px';
    img.style.maxHeight = '300px';
    img.classList.add('img-thumbnail');
    imgContainer.appendChild(img);

    const closeButton = document.createElement('button');
    closeButton.innerHTML = 'X';
    closeButton.classList.add('btn', 'btn-danger', 'btn-sm', 'position-absolute', 'top-0', 'end-0');
    closeButton.style.transform = 'translate(50%, -50%)';
    closeButton.addEventListener('click', () => clearImage(imagePreview, imageInput));
    imgContainer.appendChild(closeButton);

    imagePreview.appendChild(imgContainer);
};

export const clearImage = () => {
    imagePreview.innerHTML = '';
    imageInput.value = '';
};

export const handleImageSelection = () => {
    imageInput.addEventListener('change', () => {
        const file = imageInput.files[0];
        if (file) {
            resizeImage(file, (resizedImage) => {
                displayImage(resizedImage, imagePreview, () => clearImage(imagePreview, imageInput));
            });
        }
    });
};

export function getImageFile() {
    const fileInput = document.getElementById('image-input');
    return fileInput.files[0];
}


export const displayPostImage = (post, container) => {
    if (post.image) {
        const imageElement = document.createElement('img');
        imageElement.src = post.image;
        imageElement.style.maxWidth = '300px';
        imageElement.style.maxHeight = '300px';
        container.appendChild(imageElement);
    }
};
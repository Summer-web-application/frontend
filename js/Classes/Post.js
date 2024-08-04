class Post {
    #id = undefined;
    #firstName = undefined;
    #lastName = undefined;
    #username = undefined;
    #text = undefined;
    #createdAt = undefined;
    #likes = undefined;

    constructor(id, firstName, lastName, username, text, createdAt, likes){
        this.#id = id;
        this.#firstName = firstName;
        this.#lastName = lastName;
        this.#username = username;
        this.#text = text;
        this.#createdAt = createdAt;
        this.#likes = likes;
    }

    get id(){
        return this.#id;
    }
    get firstName(){
        return this.#firstName;
    }
    get lastName(){
        return this.#lastName;
    }
    get username(){
        return this.#username;
    }
    get text(){
        return this.#text;
    }
    get createdAt(){
        const fullDate = new Date(this.#createdAt);
        const day = fullDate.getDate();
        const month = fullDate.getMonth();
        const year = fullDate.getFullYear();
        return `${day}.${month}.${year}`;
    }
    get likes(){
        return this.#likes;
    }

    async editComment(commentId, postId, updatedData) {
        console.log(commentId + " " + postId + " " +  JSON.stringify(updatedData))
        // try {
        //     const response = await fetch(`${BACKEND_URL}/blog/comment/${commentId}`, {
        //         method: 'PUT',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(updatedData)
        //     });

        //     if (!response.ok) {
        //         throw new Error(`Error updating comment: ${response.statusText}`);
        //     }

        //     const data = await response.json();
        //     return data.success;  // Assuming the API returns { success: true } on success
        // } catch (error) {
        //     console.error('Failed to update comment:', error);
        //     return false;
        // }
    }

}
            

export {Post}
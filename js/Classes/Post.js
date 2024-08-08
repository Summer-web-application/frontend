class Post {
    #id = undefined;
    #firstName = undefined;
    #lastName = undefined;
    #username = undefined;
    #text = undefined;
    #image = undefined;
    #createdAt = undefined;
    #likes = undefined;

    constructor(id, firstName, lastName, username, text, image, createdAt, likes){
        this.#id = id;
        this.#firstName = firstName;
        this.#lastName = lastName;
        this.#username = username;
        this.#text = text;
        this.#image = image;
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
    get image() {
        return this.#image;
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
}
            

export {Post}
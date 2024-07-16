class Comment {
#name = undefined;
#username = undefined;
#text = undefined;
#likes = undefined;
#date = undefined;

constructor(name, username, text, likes, date){
    this.#name = name;
    this.#username = username;
    this.#text = text;
    this.#likes = likes;
    this.#date = date;
}

get name(){
    return this.#name;
}
get username(){
    return this.#username;
}
get text(){
    return this.#text;
}
get likes(){
    return this.#likes;
}
get date(){
    return this.#date;
}

}
export {Comment}
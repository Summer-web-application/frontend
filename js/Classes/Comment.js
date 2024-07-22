class Comment {
#id = undefined;
#firstName = undefined;
#lastName = undefined;
#username = undefined;
#text = undefined;
#likes = undefined;
#date = undefined;

constructor(id, firstName, lastName, username, text, likes, date){
    this.#id = id;
    this.#firstName = firstName;
    this.#lastName = lastName;
    this.#username = username;
    this.#text = text;
    this.#likes = likes;
    this.#date = date;

    console.log("created comment instance with id value: " + this.#id);
}
get id() {
    return this.#id;
}

get name(){
    const fullName = this.#firstName + ' ' + this.#lastName;
    return fullName;
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
    const fullDate = new Date(this.#date);
    const day = fullDate.getDate();
    const month = fullDate.getMonth();
    const year = fullDate.getFullYear();
    return `${day}.${month}.${year}`;
}

}
export {Comment}
import { User } from "./Classes/User.js";

document.addEventListener('DOMContentLoaded', () => {
   checkLogin(); 
});

function checkLogin() {
    console.log("Check auth");
    const user = new User();
    if(user.user_id == undefined){
        window.location.href = 'login.html';
    }
}
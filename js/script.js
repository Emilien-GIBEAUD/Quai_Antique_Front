const tokenCookieName = "accesstoken";
// 2 méthodes pour créer et lire un token à l'aide des méthodes ---Cookie
function setToken(token) {
    setCookie(tokenCookieName,token,7);
}
function getToken() {
    return getCookie(tokenCookieName);
}


const roleCookieName = "role";
// Méthode pour lire le role
function getRole() {
    return getCookie(roleCookieName);
}


// 3 méthodes pour créer, lire et supprimer des cookies, à chercher sur internet
function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


// Methode vérifiant si on est connecté
function isConnected(){
    if(getToken() === null || getToken() === undefined){
        return false;
    }else{
        return true;
    }
}


/* Les roles
disconnected
connected (admin ou user)
    - admin
    - user
*/
// Methode qui affiche/masque les éléments HTML (ayant le data attribute "data-show") en fonction du rôle.
function showHideForRoles(){
    const userConnected = isConnected();
    const role = getRole();

    let allElementsToEdit = document.querySelectorAll("[data-show]");

    allElementsToEdit.forEach(element =>{
        switch(element.dataset.show){
            case "disconnected":
                if(userConnected){
                    element.classList.add("d-none");
                }
                break;
            case "connected":
                if(!userConnected){
                    element.classList.add("d-none");
                }
                break;
            case "admin":
                if(!userConnected || role !== "admin"){
                    element.classList.add("d-none");
                }
                break;
            case "user":
                if(!userConnected || role !== "user"){
                    element.classList.add("d-none");
                }
                break;
        }
    })
}
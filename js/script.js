export const apiUrl = "http://127.0.0.1:8000/api/";

export const tokenCookieName = "accesstoken";
// 2 méthodes pour créer et lire un token à l'aide des méthodes ---Cookie
export function setToken(token) {
    setCookie(tokenCookieName,token,7);
}
function getToken() {
    return getCookie(tokenCookieName);
}


export const roleCookieName = "role";
// Méthode pour lire le role
export function getRole() {
    return getCookie(roleCookieName);
}


// 3 méthodes pour créer, lire et supprimer des cookies, à chercher sur internet
export function setCookie(name,value,days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(const element of ca) {
        let c = element;
        while (c.startsWith(' ')) c = c.substring(1,c.length);
        if (c.startsWith(nameEQ)) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
export function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


// Methode vérifiant si on est connecté
export function isConnected(){
    return !(getToken() === null || getToken() === undefined);
}

/* Les roles    chercher dans l'API si des erreurs se produisent 
disconnected
connected (admin ou user)
    - user      l'API renvoie ROLE_USER à priori
    - admin     ROLE_USER ???
*/
// Methode qui affiche/masque les éléments HTML (ayant le data attribute "data-show") en fonction du rôle.
export function showHideForRoles(){
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
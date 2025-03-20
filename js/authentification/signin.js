// gestion de la connexion
// On utilise bien des var au cas ou l'utilisateur quitte puis revient sur la page, à voir si il est possible de gérer cela autrement.
var emailInput = document.getElementById("emailInput");
var pswInput = document.getElementById("pswInput");
var btnSignin = document.getElementById("btnSignin");

btnSignin.addEventListener("click", checkCredentials);

// vérification des données de connexions
function checkCredentials(){
    // Ici, il faudra appeler l'API pour vérifier les crédentials en BDD

    if(emailInput.value === "test@mail.com" && pswInput.value === "test"){
        // il faudra récupérer le vrai token
        const token = "vnvenvoejnvoiejnboinbjbrtsljbrijnsiojtgbspboisrpto"

        // Mise du token en cookie
        setToken(token);

        // Attribution du role, vrai role à récupérer en BDD
        setCookie(roleCookieName,"admin",7);
        // setCookie(roleCookieName,"user",7);

        window.location.replace("/");
    } else {
        emailInput.classList.add("is-invalid");
        pswInput.classList.add("is-invalid");
    }
}
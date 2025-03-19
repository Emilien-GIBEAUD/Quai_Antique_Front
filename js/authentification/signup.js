// Vérification du formulaire saisi

const nameSignup = document.getElementById("nameSignup");
const firstnameSignup = document.getElementById("firstnameSignup");
const emailSignup = document.getElementById("emailSignup");
const pswSignup = document.getElementById("pswSignup");
const pswConfirmSignup = document.getElementById("pswConfirmSignup");
const btnSuscribe = document.getElementById("btnSuscribe");
btnSuscribe.disabled = true;

nameSignup.addEventListener("keyup", checkInputs);
firstnameSignup.addEventListener("keyup", checkInputs);
emailSignup.addEventListener("keyup", checkInputs);
pswSignup.addEventListener("keyup", checkInputs);
pswConfirmSignup.addEventListener("keyup", checkInputs);

// fonction qui vérifie tous les inputs
function checkInputs(){
    const nameOK = checkOneInput(nameSignup);
    const firstnameOK = checkOneInput(firstnameSignup);
    const emailOK = checkEmail(emailSignup);
    const pswOK = checkPSW(pswSignup);
    const pswConfirmOK = checkPSWConfirm(pswSignup,pswConfirmSignup);

    if(nameOK && firstnameOK && emailOK && pswOK && pswConfirmOK){
        btnSuscribe.disabled = false;
    } else {
        btnSuscribe.disabled = true;
    }
}

// function qui vérifie si un input est vide
function checkOneInput(input) {
    if(input.value !== ""){
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        return true;
    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
}

// function qui vérifie que le mail est valide
function checkEmail(input) {
    // définition de la regex du mail :
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const userEmail = input.value;
    if(userEmail.match(emailRegex)){
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        return true;
    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
}

// Fonction qui vérifie les mots de passe
function checkPSW(input){
    // définition de la regex du mot de passe
    const PSWRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
    const userPSW = input.value;
    if(userPSW.match(PSWRegex)){
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        return true;
    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
}

// Fonction qui vérifie que les mots de passe saisis sont identiques
function checkPSWConfirm(input1,input2){
    if(input1.value === input2.value){
        input2.classList.add("is-valid");
        input2.classList.remove("is-invalid");
        return true;
    } else {
        input2.classList.remove("is-valid");
        input2.classList.add("is-invalid");
        return false;
    }
}
import { apiUrl, picturesUrl, sanityzeHTML, getToken } from './script.js';

const titleInput = document.getElementById("titleInput");
const pictureInput = document.getElementById("pictureInput");
const pictureForm = document.getElementById("pictureForm");
const btnEditPicture = document.getElementById("btnEditPicture");

btnEditPicture.addEventListener("click", addPicture);


// // Solution d'origine, ne fonctionne qu'après avoir rafraichi la page ...
// const galerieImages = document.getElementById("allImages");
// // Récupérer les infos des images
//     let titre = "titre";
//     let imgSource = "../images/chef2.jpg";
// let monImage = getImage(titre, imgSource);
// galerieImages.innerHTML = monImage;

export function initPage() {
    const galerieImages = document.getElementById("allImages");
    if (!galerieImages) return;

    let titre = "titre";
    let imgSource = picturesUrl + "plats4-6837478b7d18d141443765.jpg";
    let monImage = getImage(titre, imgSource);
    galerieImages.innerHTML = monImage;
}

function getImage(titre, urlImage){
    titre = sanityzeHTML(titre);
    urlImage = sanityzeHTML(urlImage);
    return `
        <div class="col">
            <div class="image-card text-white p-3">
                <img class="w-100 rounded-4" src="${urlImage}" alt="Photo du chef Arnaud Michant">
                <p class="titre-image">${titre}</p>
                <div class="image-edit p-4" data-show="admin">
                    <button type="button" class="btn btn-outline-light" data-bs-toggle="modal" data-bs-target="#imageEditModal">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button type="button" class="btn btn-outline-light" data-bs-toggle="modal" data-bs-target="#imageDeleteModal">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>
`;}

function addPicture(){
    const formData = new FormData(pictureForm);

    // Evite les saisies vides
    if (formData.get("titleInput") === "" || formData.get("pictureInput").name  === "") {
        alert("La saisie d'un titre et d'un fichier sont obligatoires.");
        return;
    }

    // Vérifie la taille et le type d'image
    const pictureInput = document.getElementById('pictureInput');
    if (!verifyImage(pictureInput, 4)) {
        return;
    }

    // Nettoie le titre
    const title = sanityzeHTML(formData.get("titleInput"));
    formData.set("titleInput",title);

    const myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", getToken());

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formData,
        redirect: "follow",
    };

    fetch(apiUrl + "picture", requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Erreur lors de l'envoi de l'image !");
            }
            
        })
        .then(result => {
            alert("Image envoyée.");
            document.location.href="/galerie";
        })
        .catch(error => {
            alert(error.message);
            console.error(error);
        });
}

/**
 * Vérifie si l'image sélectionnée est valide.
 *
 * @param {HTMLInputElement} fileInput - L'élément DOM du champ de fichier.
 * @param {float} maxSize - Taille maximale du fichier en Mo.
 * @returns {boolean} - Retourne true si l'image est valide, sinon false.
 */
function verifyImage(fileInput, maxSize) {
    const errorsImage = [];
    let uploadOk = 1;

    const file = fileInput.files[0];

    // Vérification du type de fichier
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
        errorsImage.push("Seuls les fichiers JPG, JPEG, PNG et WEBP sont autorisés.");
        // uploadOk = 0;
    }

    // Vérification de la taille du fichier (en octets)
    if (file.size > maxSize*1000000 && uploadOk === 1) {
        errorsImage.push("Le fichier image doit avoir une taille inférieure à " + maxSize + " Mo.");
    }

    if (errorsImage.length > 0) {
        const message = errorsImage.join("\n");
        alert(message);
        return false;
    } else {
        return true;
    }
}
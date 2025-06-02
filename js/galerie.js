import { apiUrl, picturesUrl, sanityzeHTML, getToken, showHideForRoles } from './script.js';
const restaurant_id = 1 ;   // ID du restaurant (Back opérationnel pour plusieurs restaurants mais le front ne gère qu'1 restaurant)
const maxSizePicture = 4 ;  // Taille max des images pouvant être envoyées (en Mo)

const pictureForm = document.getElementById("pictureForm");
const btnCreatePicture = document.getElementById("btnCreatePicture");

btnCreatePicture.addEventListener("click", addPicture);

// Ecoute tous les click (pour modification d'image)
document.addEventListener("click", async (event) => {
    const clickedBtnEdit = event.target.closest("#confirmEditBtn");
    if (!clickedBtnEdit) return;

    const modal = document.getElementById("imageEditModal");
    const pictureName = modal.getAttribute("data-image-to-edit");

    // fetch de modification d'image
    editPicture(pictureName);
});

// Ecoute tous les click (pour suppression d'image)
document.addEventListener("click", async (event) => {
    const clickedBtnDelete = event.target.closest("#confirmDeleteBtn");
    if (!clickedBtnDelete) return;

    const modal = document.getElementById("imageDeleteModal");
    const pictureName = modal.getAttribute("data-image-to-delete");

    // fetch de suppression d'image
    deletePicture(pictureName);
});

/**
 * Initialise la page de la galerie d'images.
 */
export function initPage() {
    const galerieImages = document.getElementById("allImages");
    if (!galerieImages) return;

    displayPictures(galerieImages);
}

/**
 * Envoie le HTML d'une image.
 *
 * @param {string} titre Le titre de l'image.
 * @param {string} imageName Le nom de du fichier image.
 */
function sendPicture(titre, imageName){
    titre = sanityzeHTML(titre);
    imageName = sanityzeHTML(imageName);
    return `
        <div class="col">
            <div class="image-card text-white p-3">
                <img class="w-100 rounded-4" src="${picturesUrl + imageName}" alt="Photo du chef Arnaud Michant">
                <p class="titre-image">${titre}</p>
                <div class="image-edit p-4" data-show="admin">
                    <button type="button" class="btn btn-outline-light btn-edit-image" data-bs-toggle="modal" data-bs-target="#imageEditModal" data-title="${titre}" data-image="${imageName}">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button type="button" class="btn btn-outline-light btn-delete-image" data-bs-toggle="modal" data-bs-target="#imageDeleteModal" data-title="${titre}" data-image="${imageName}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>
`;}

/**
 * Ajoute une image et son titre via une requête HTTP POST.
 * @returns {Promise<Response>} Une promesse résolue avec la réponse de la requête fetch.
 * @description
 * 1. Récupère le titre et le fichier (sort de la fonction s'il ne sont pas tous les deux saisis)
 * 2. Vérifie que le fichier est valide et que sa taille n'exède pas "maxSizePicture" via "verifyPicture"
 * 3. Nettoie le titre via "sanityzeHTML"
 * 4. Envoie une requête POST avec les données vers l'API
 * 5. Affiche un message de succès ou d'erreur en fonction de la réponse
 */
function addPicture(){
    const formData = new FormData(pictureForm);

    // Evite les saisies vides (2 saisies obligatoires)
    if (formData.get("title") === "" || formData.get("pictureFile").name  === "") {
        alert("La saisie d'un titre et d'un fichier sont obligatoires.");
        return;
    }

    // Vérifie la taille et le type d'image
    const pictureInput = document.getElementById('pictureInput');
    if (!verifyPicture(pictureInput, maxSizePicture)) {
        return;
    }

    // Nettoie le titre
    const title = sanityzeHTML(formData.get("title"));
    formData.set("title",title);

    const myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", getToken());
    myHeaders.append('accept', 'application/json');

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
function verifyPicture(fileInput, maxSize) {
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

/**
 * Récupère toutes les images d'un restaurant via une requête HTTP GET.
 *
 * @async
 * @param {int} id - id du restaurant concerné.
 * @returns {Promise<Response>} Une promesse résolue avec la réponse de la requête fetch.
 */
async function getAllPictures(id){
    const myHeaders = new Headers();

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    return fetch(apiUrl + "picture/" + id, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Impossible de récupérer les images !");
            }
        })
        .catch(error => {
            console.error(error);
        });
}

/**
 * Affiche les images dans une galerie et initialise les interactions pour la modification et la suppression.
 *
 * @async
 * @param {HTMLElement} galerieImages - L'élément DOM où les images seront affichées.
 * @returns {Promise<void>} Une promesse résolue lorsque l'affichage et les écouteurs sont configurés.
 *
 * @description
 * Récupère les images associées à un restaurant via la fonction getAllPictures,
 * insère le HTML de chaque image dans l'élément DOM spécifié, puis ajoute un écouteur
 * sur chaque bouton de modification et de suppression pour mettre à jour les modales de confirmation de modification et de suppression.
 * Elle appelle aussi showHideForRoles() pour gérer la visibilité des éléments selon les rôles.
 */
async function displayPictures(galerieImages) {
    const pictures = await getAllPictures(restaurant_id);
    
    pictures.forEach(elem => {
        const picture = sendPicture(elem.title, elem.pictureName);
        galerieImages.innerHTML += picture;
    });

    // Met un écouteur sur chaque bouton de modification (de chaque image)
    document.querySelectorAll(".btn-edit-image").forEach(btn => {
        btn.addEventListener("click", () => {
            // récupère le titre et l'adresse de l'image
            const title = btn.getAttribute("data-title");
            const image = btn.getAttribute("data-image");

            // Met à jour le contenu de la modale
            document.getElementById("editImageTitle").textContent = title;
            document.getElementById("editImagePreview").src = picturesUrl + image;
            document.getElementById("editImagePreview").alt = title;

            // Stocke le nom de l'image à modifier dans un attribut caché
            document.getElementById("imageEditModal").setAttribute("data-image-to-edit", image);
        });
    });

    // Met un écouteur sur chaque bouton de supression (de chaque image)
    document.querySelectorAll(".btn-delete-image").forEach(btn => {
        btn.addEventListener("click", () => {
            // récupère le titre et l'adresse de l'image
            const title = btn.getAttribute("data-title");
            const image = btn.getAttribute("data-image");

            // Met à jour le contenu de la modale
            document.getElementById("deleteImageTitle").textContent = title;
            document.getElementById("deleteImagePreview").src = picturesUrl + image;
            document.getElementById("deleteImagePreview").alt = title;

            // Stocke le nom de l'image à supprimer dans un attribut caché
            document.getElementById("imageDeleteModal").setAttribute("data-image-to-delete", image);
        });
    });

    showHideForRoles();
}

/**
 * Modifie une image via une requête HTTP POST.
 * @async
 * @param {string} pictureName - Le nom du fichier image à modifier.
 * @returns {Promise<Response>} Une promesse résolue avec la réponse de la requête fetch.
 * 1. Récupère le titre et/ou le fichier (sort de la fonction rien n'est saisi)
 * 2. Si saisi, vérifie que le fichier est valide et que sa taille n'exède pas "maxSizePicture" 
 * via "verifyPicture"
 * 3. Si saisi, nettoie le titre via "sanityzeHTML"
 * 4. Envoie une requête POST avec les données vers l'API
 * 5. Affiche un message de succès ou d'erreur en fonction de la réponse
 */
async function editPicture(pictureName) {
    const pictureFormEdit = document.getElementById("pictureFormEdit");
    const formData = new FormData(pictureFormEdit);

    // Evite les saisies vides (1 saisie obligatoire)
    if (formData.get("title") === "" && formData.get("pictureFile").name  === "") {
        alert("La saisie d'un titre ou d'un fichier sont obligatoires.");
        return;
    }

    // Vérifie la taille et le type d'image
    if (formData.get("pictureFile").name  !== "") {
        const pictureInput = document.getElementById('pictureInputEdit');
        if (!verifyPicture(pictureInput, maxSizePicture)) {
            return;
        }
    }

    // Nettoie le titre
    if (formData.get("title") !== "") {
        const title = sanityzeHTML(formData.get("title"));
        formData.set("title",title);
    }

    const myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", getToken());
    myHeaders.append('accept', 'application/json');

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formData,
        redirect: "follow",
    };

    return fetch(apiUrl + "picture/edit/" + pictureName, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Erreur lors de la modification de l'image !");
            }
            
        })
        .then(result => {
            alert("Image modifée.");
            document.location.href="/galerie";
        })
        .catch(error => {
            alert(error.message);
            console.error(error);
        });
}

/**
 * Supprime une image via une requête HTTP DELETE.
 *
 * @async
 * @param {string} pictureName - Le nom du fichier à supprimer.
 * @returns {Promise<Response>} Une promesse résolue avec la réponse de la requête fetch.
 */
async function deletePicture(pictureName) {
    const myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", getToken());

    const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow"
    };

    return fetch(apiUrl + "picture/" + pictureName, requestOptions)
        .then(response => {
            if (response.ok) {
                alert("Image supprimé avec succès !");
                document.location.href="/galerie";
            } else {
                throw new Error("Impossible de récupérer l'image !");
            }
        })
        .catch(error => {
            console.error(error);
        });
}
import { sanityzeHTML } from './script.js';

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
    let imgSource = "../images/chef2.jpg";
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


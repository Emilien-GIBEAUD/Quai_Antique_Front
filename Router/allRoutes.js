import Route from "./Route.js";

//Définir ici vos routes
export const allRoutes = [
    new Route("/", "Accueil", "/pages/home.html"),
    new Route("/galerie", "La galerie", "/pages/galerie.html"),
    new Route("/menu", "La carte", "/pages/menu.html"),
    new Route("/allReservations", "Mes réservations", "/pages/reservations/allReservations.html"),
    new Route("/reserve", "Réserver", "/pages/reservations/reserve.html"),
    new Route("/account", "Mon compte", "/pages/authentification/account.html"),
    new Route("/editPSW", "Editer mot de passe", "/pages/authentification/editPSW.html"),
    new Route("/signin", "Connexion", "/pages/authentification/signin.html"),
    new Route("/signup", "Inscription", "/pages/authentification/signup.html")
];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "Quai Antique";
import Route from "./Route.js";

//Définir ici vos routes
export const allRoutes = [
    new Route("/", "Accueil", "/pages/home.html", []),
    new Route("/galerie", "La galerie", "/pages/galerie.html", [], "/js/galerie.js"),
    new Route("/menu", "La carte", "/pages/menu.html", []),
    new Route("/allReservations", "Mes réservations", "/pages/reservations/allReservations.html", ["ROLE_USER"]),
    new Route("/reserve", "Réserver", "/pages/reservations/reserve.html", ["ROLE_USER"]),
    new Route("/account", "Mon compte", "/pages/authentification/account.html", ["ROLE_ADMIN", "ROLE_USER"]),
    new Route("/editPSW", "Editer mot de passe", "/pages/authentification/editPSW.html", ["ROLE_ADMIN", "ROLE_USER"]),
    new Route("/signin", "Connexion", "/pages/authentification/signin.html", ["disconnected"], "/js/authentification/signin.js"),
    new Route("/signout", "Deconnexion", "/pages/authentification/signout.html", ["ROLE_ADMIN", "ROLE_USER"], "/js/authentification/signout.js"),
    new Route("/signup", "Inscription", "/pages/authentification/signup.html", ["disconnected"], "/js/authentification/signup.js")
];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "Quai Antique";
/*
 * Stockage de  l'URL de l'API works dans la constante urlApi
 **/
const urlApi = "http://localhost:5678/api/works";

/*
 * Appel de la fonction  initHomepage() pour l'affichage de la page d'accueil
 */
initHomepage();

/*
 * Cette fonction affiche la page d'accueil en fonction de l'état de connexion de l'utilisateur.
 */
async function initHomepage() {

    const allWorks = await fetchWorks();// Récupère tous les travaux depuis l'API works.
    const token = localStorage.getItem("token");

    generateWorksInHtml(allWorks);// Génère le contenu HTML pour afficher tous les travaux dans la galerie.

    if (token) {
        showBanner();
        toggleLoginLogout();// Appelle la fonction pour gérer l'état de connexion (login/logout).

    } else {
        hideBanner();
        generateFilterCategories(allWorks); // Affiche le filtre des catégories des travaux.
    }
}

/*
 * Cette fonction affiche la bannière et le lien vers la modale.
 */
function showBanner() {

    const bannerElements = document.querySelector('.banner');
    bannerElements.style.display = 'flex';

    const modalLink = document.querySelector('.modalLink');
    modalLink.style.display = 'flex';
}

/*
 * Cette fonction masque la bannière et le lien vers la modal1.
 */
function hideBanner() {

    const bannerElements = document.querySelector('.banner');
    bannerElements.style.display = 'none';

    const modalLink = document.querySelector('.modalLink');
    modalLink.style.display = 'none';
}

/*
 * Cette fonction bascule entre les états de connexion (login/logout) en fonction de la présence du token d'authentification.
 */
function toggleLoginLogout() {

    const token = localStorage.getItem("token");
    const buttonLoginLogout = document.getElementById('loginLogout');

    if (token) {
        buttonLoginLogout.textContent = "logout";
        buttonLoginLogout.href = "./index.html";
        buttonLoginLogout.addEventListener('click', (event) => {
            event.preventDefault();
            localStorage.removeItem('token');
            window.location.href = "index.html";
        })
    } else {
        // Si non connecté, laissez le texte comme "login" avec le lien d'origine
        buttonLoginLogout.textContent = "login";
        buttonLoginLogout.href = "./login.html";
    }
}

/**
 * Cette fonction Récupère les travaux à partir d'une API en utilisant la fonction fetch.
 * @async
 * @function fetchWorks
 * @param {string} - L'URL de l'API à partir de laquelle les travaux sont récupérés.
 * @returns {Promise<Array>} Une promesse résolue avec un tableau d'objets représentant les travaux de l'architecte.
 */
export async function fetchWorks() {

    try {
        const response = await fetch(urlApi);
        if (!response.ok) {
            console.error("Une erreur s'est produite lors de la récupération des données.");
            return [];
        }
        return response.json(); // retourne un tableau contenant les works

    } catch (error) {
        console.error("Une erreur s'est produite : ", error);
        return [];
    }
}

/**
 * Cette fonction Génère du contenu HTML pour afficher la galerie des travaux.
 * @param {Array} works - Un tableau d'objets représentant les travaux à afficher.
 */
export function generateWorksInHtml(works) {

    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = '';

    works.forEach(work => {

        const figure = document.createElement("figure");
        const imageElement = document.createElement("img");
        imageElement.src = work.imageUrl;
        imageElement.alt = work.title;

        const titleElement = document.createElement("figcaption");
        titleElement.innerText = work.title;

        figure.appendChild(imageElement);
        figure.appendChild(titleElement);
        gallery.appendChild(figure);
    });
}

/**
 * Cette fonction effectue le tri des travaux par catégorie et retourne un tableau de catégories.
 * @function generateFilterCategories
 * @param {Array} works - Un tableau contenant les travaux.
 */
function generateFilterCategories(works) {

    const categoriesWorks = new Set();
    works.forEach((work) => categoriesWorks.add(work.category.name));
    const listWorksCategory = Array.from(categoriesWorks);
    generateButtonCategory(listWorksCategory);
}

/**
 * Cette fonction Affiche les boutons de catégorie dans la page web.
 * @function afficherButtonCategorie
 * @param {Array} listWorksCategory - Un tableau contenant les noms des catégories des travaux
 */
function generateButtonCategory(listWorksCategory) {

    const filter = document.querySelector('.filter');
    filter.innerHTML = ''; // Effacer les boutons précédents

    const newButtonTous = createCategoryButton("Tous");
    filter.appendChild(newButtonTous);

    listWorksCategory.forEach(category => {
        const newButton = createCategoryButton(category);
        filter.appendChild(newButton);
    });
    selectedCategoryButton();
}

/**
 * Cette fonction crée un bouton de catégorie.
 * @function createCategoryButton
 * @param {string} categoryName - Le nom du bouton de la catégorie.
 */
function createCategoryButton(categoryName) {

    const buttonCategory = document.createElement("button");

    if (categoryName === "Tous") {
        buttonCategory.classList.toggle('selected');
    }

    buttonCategory.innerText = categoryName;
    buttonCategory.dataset.category = categoryName;
    buttonCategory.type = "button";
    return buttonCategory;
}

/*
 * Cette fonction ajoute un gestionnaire d'événement 'click' à tous les boutons de catégorie.
 * Lorsqu'un bouton est cliqué, il appelle la fonction onClickButtonCategory.
 */
function selectedCategoryButton() {

    const categoryButtons = document.querySelectorAll('.filter button');

    categoryButtons.forEach(button => {
        button.addEventListener('click', onClickButtonCategory);

    });
}

/**
 * Cette fonction est appelée lorsqu'un bouton de catégorie est cliqué.
 * Elle met en évidence le bouton cliqué, désélectionne les autres boutons et génère les travaux en fonction de la catégorie sélectionnée.
 * @function onClickButtonCategory
 * @param {Event} event - L'objet d'événement représentant le clic sur le bouton de catégorie.
 * @param {HTMLButtonElement} event.target - Le bouton HTML sur lequel l'événement a été déclenché.
 */
function onClickButtonCategory(event) {

    const categoryButtons = document.querySelectorAll('.filter button');
    const button = event.target;
    const wCategory = button.dataset.category;

    button.classList.toggle('selected');

    categoryButtons.forEach(btn => {
        if (btn !== button) {
            btn.classList.remove('selected');
        }
    });
    generateWorksCategories(wCategory);
}

/**
 * Cette fonction génère le contenu HTML des travaux en fonction de la catégorie sélectionnée.
 * @function generateWorksCaterogies
 * @param {string} wCategory - Le nom de la catégorie sélectionnée.
 */
function generateWorksCategories(wCategory) {

    fetchWorks().then((works) => {
        let filteredWorks;

        switch (wCategory) {
            case 'Tous':
                filteredWorks = works;
                break;
            default:
                filteredWorks = works.filter((work) => {
                    return work.category.name === wCategory;
                });
                break;
        }
        generateWorksInHtml(filteredWorks); // Génère la page HTML à partir des travaux filtrés
    });
}



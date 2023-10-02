/**
 *stoker l'url de l'API works dans la constante urlApi
 **/
const urlApi = "http://localhost:5678/api/works";

/**
 * Cette fonction récupère les travaux à partir d'une API et effectue l'affichage initial de la page web.
 * @async
 * @function initHomepage
 */
export async function initHomepage() {
    const allWorks = await fetchWorks();//allWorks un tableau qui contient tous les travaux recupérer avec fetch
    generateWorksInHtml(allWorks)
    generateFilterCategories(allWorks)
}

/**
 * Cette fonction Récupère les travaux à partir d'une API en utilisant la fonction fetch.
 * @async
 * @function fetchWorks
 * @param {string} urlApi - L'URL de l'API à partir de laquelle les travaux sont récuperé.
 * @returns {Promise<Array>} Une promesse résolue avec un tableau d'objets représentant les travaux de l'architecte.
 */
async function fetchWorks() {
    try {
        const response = await fetch(urlApi);
        if (!response.ok) {
            throw new Error("Une erreur s'est produite lors de la récupération des données.");
        }
        const works = await response.json();
        return works;
    } catch (error) {
        console.error("Une erreur s'est produite : ", error);
        return [];
    }
}

/**
 * Cette fonction Génère du contenu HTML pour afficher la galerie des travaux.
 * @param {Array} works - Un tableau d'objets représentant les travaux à afficher.
 */
function generateWorksInHtml(works) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = '';

    works.forEach(work => {
        const figure = document.createElement("figure");
        const imageElement = document.createElement("img");
        imageElement.src = work.imageUrl;
        imageElement.alt = work.name;

        const titleElement = document.createElement("figcaption");
        titleElement.innerText = work.name;

        figure.appendChild(imageElement);
        figure.appendChild(titleElement);
        gallery.appendChild(figure);
    });
}

/**
 * Cette fonction effectue le tri des travaux par cétégorie et retourne au tableau de catégories.
 * @function generateFilterCategories
 * @param {Array} works - Un tableau contenant les travaux.
 */
function generateFilterCategories(works) {
    const categoriesWorks = new Set();
    works.forEach((work) => categoriesWorks.add(work.category.name));
    const listWorksCategory = Array.from(categoriesWorks);
    afficherButtonCategory(listWorksCategory);
}

/**
 * Cette fonction Affiche les boutons de catégorie dans la page web.
 * @function afficherButtonCategorie
 * @param {Array} listWorksCategory - Un tableau contenant les nom des catégories des travaux
 */
function afficherButtonCategory(listWorksCategory) {
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
 * Cette fonction crée un boutton de catégorie.
 * @function createCategoryButton
 * @param {string} categoryName - Le nom du boutton de la catégorie.
 */
function createCategoryButton(categoryName) {
    const buttonCategorie = document.createElement("button");

    if (categoryName === "Tous") {

        buttonCategorie.classList.toggle('selected');
    }
    buttonCategorie.innerText = categoryName;
    buttonCategorie.dataset.category = categoryName
    buttonCategorie.type = "button";
    return buttonCategorie;
}

/**
 * Cette fonction ajoute un gestionnaire d'événement 'click' à tous les boutons de catégorie.
 * Lorsqu'un bouton est cliqué, il appelle la fonction onClickButtonCategory.
 * @function selectedCategoryButton
 */
function selectedCategoryButton() {
    const categoryButtons = document.querySelectorAll('.filter button');

    categoryButtons.forEach(button => {
        button.addEventListener('click', onClickButtonCategory)

    });
}

/**
 * Cette fonction est appelée lorsqu'un bouton de catégorie est cliqué.
 * Elle met en évidence le bouton cliqué, désélectionne les autres boutons et génère les travaux en fonction de la catégorie sélectionnée.
 * @function onClickButtonCategory
 * @param {Event} event - L'objet d'événement représentant le clic sur le bouton de catégorie.
 */
function onClickButtonCategory(event) {
    const categoryButtons = document.querySelectorAll('.filter button');
    const button = event.target;
    const wCategory = button.dataset.category

    button.classList.toggle('selected');

    categoryButtons.forEach(b => {
        if (b !== button) {
            b.classList.remove('selected');
        }
    });
    generateWorksCaterogies(wCategory)
}

/**
 * Cette fonction génère le contenu HTML des travaux en fonction de la catégorie sélectionnée.
 * @function generateWorksCaterogies
 * @param {string} wCategory - Le nom de la catégorie selectionnée.
 */
function generateWorksCaterogies(wCategory) {
    fetchWorks().then((works) => {
        let filteredWorks = [];

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
        generateWorksInHtml(filteredWorks); // Génère le HTML à partir des travaux filtrés
    });
}
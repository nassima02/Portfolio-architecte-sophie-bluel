/**
*stoker l'url de l'API works dans la constante urlApi
 **/
const urlApi = "http://localhost:5678/api/works";

/**
 * cette fonction récupère les travaux à partir d'une API et effectue l'affichage initial de la page web.
 * @async
 * @function init
 */
export async function init() {
    const allWorks = await fetchWorks();
    generateWorksInHtml(allWorks);
}

/**
 * cette fonction Récupère les travaux à partir d'une API en utilisant la fonction fetch.
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
        console.error("Une erreur s'est produite : " + error.message);
        return [];
    }
}
/**
 * cette fonction Génère du contenu HTML pour afficher une galerie de travaux.
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

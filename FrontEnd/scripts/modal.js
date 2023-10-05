/**
 * l'import des deux fonctions, fetchWorks et generateWorksInHtml du fichier "./works.js"
 */
import {fetchWorks, generateWorksInHtml} from "./works.js";

/**
 * Récupération des éléments du DOM 
 */
const editLink = document.getElementById('edit');
const modal = document.getElementById('myModal');

//Les elements HTML de la modal-1 "Galerie photo"
const modalGalleryImage = document.getElementById("modalGallery");
const galleryModal = document.querySelector(".modalBody");
const addButton = document.getElementById("addModalButton");
const modalTitle1 = document.getElementById("modalTitle1");

//Les elements HTML de la modal-2 "Ajout photo"
const modalAddImage = document.getElementById('modalAdd');
const previousBtn = document.querySelector('.arrowBack');
const closeBtn = document.querySelector('.close');
const imageField = document.querySelector(".imageLabel");
const imagePreview = document.getElementById('imagePreview');
const validateModalBtn = document.getElementById('validateModalButton');
const modalTitle2 = document.getElementById("modalTitle2");

// les elements HTML du formulaire d'ajout d'une image
const imageInput = document.getElementById('image');
const titleInput = document.getElementById("title");
const categorySelect = document.getElementById("category");

/**
 * Ouverture de la fenêtre modal1 "Galerie photo" lors du clic sur le lien "modifier"
 */
editLink.addEventListener('click', (event) => {
    event.preventDefault();
    modal.style.display = 'flex';
    validateModalBtn.style.display = 'none';
    previousBtn.style.display = 'none';
    modalAddImage.style.display = 'none';
});

/**
 * Ouverture de la modal 2 en cliquant sur le bouton "Ajouter une photo"
 */
addButton.addEventListener('click', () => {

    addButton.style.display = 'none';
    modalGalleryImage.style.display = 'none';
    imagePreview.style.display = 'none';
    previousBtn.style.display = 'flex';
    modalAddImage.style.display = 'flex';
    validateModalBtn.style.display = 'block';
    modalTitle1.style.display = 'none'
    modalTitle2.style.display = 'flex'
    imageField.style.display = 'flex';
});

/**
 * Fermeture de la fenêtre modal lors du clic sur la croix
 */
closeBtn.addEventListener('click', closeModal);

/**
 * Fermeture de la fenêtre modale lorsque l'utilisateur clique en dehors de celle-ci
 */
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal ()
    }
});

/**
 * Cette fonction mis a jour la modale apres sa fermeture
 */
function closeModal (){
    modal.style.display = 'none';
    validateModalBtn.style.display = 'none';
    previousBtn.style.display = 'none';
    modalAddImage.style.display = 'none';
    modalGalleryImage.style.display = 'grid';
    addButton.style.display = 'block';
    imageField.style.display = 'none';
}
/**
 * le retour en arrière quand on clique sur la flèche
 */
previousBtn.addEventListener('click', () => {
    closeModal ()
    modal.style.display = 'flex';
    modalTitle1.style.display = 'flex'
    modalTitle2.style.display = 'none'
});

/**
 * Affichage des photos dans la modal "Galerie photo"
*/
let worksModal = await fetchWorks();

function generateWorkModal(works) {
    galleryModal.innerHTML = '';

    works.forEach(work => {

        const figureModal = document.createElement("figure");
        const imageModal = document.createElement('img');
        const trashIcon = document.createElement('i');

        figureModal.id = `modalWorkFigure_${work.id}`;

        imageModal.src = work.imageUrl;
        imageModal.alt = work.name;

        trashIcon.className = "fa-solid fa-trash-can trash-icon";

        figureModal.appendChild(imageModal);
        figureModal.appendChild(trashIcon);
        galleryModal.appendChild(figureModal);

        // Ajouter un écouteur d'événements au clic sur l'icône de la corbeille
        trashIcon.addEventListener("click", () => {
            deletePicture(work.id);
        });
    });
}

generateWorkModal(worksModal);

/**
 * Suppression d'une photo de la modal "Galerie photo"
 */
function deletePicture(id) {
    const token = localStorage.getItem("token");
    const figureModal = document.getElementById(`modalWorkFigure_${id}`);

    // Envoyer une requête DELETE à l'API pour supprimer la photo
    fetch(`http://localhost:5678/api/works/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
        .then(async response => {
            if (response.ok) { // La photo a été supprimée avec succès
                figureModal.remove(); // Supprimer l'élément de la galerie
                //  worksModal contienne toutes les images actuelles
                worksModal = worksModal.filter((w) => w.id !== id);
                generateWorksInHtml(worksModal);
                alert("Votre image a bien été supprimée !");
            } else {
                console.error("Échec de la suppression de la photo");
            }
        })
        .catch(error => {
            console.error("Erreur lors de la suppression de la photo:", error);
        });
}

/**
 * Cette fonction vérifie si les 3 champs du formulaire d'ajout d'une photo
 * sont bien remplis et active le bouton "Valider". *
 */
function updateValidateButton() {

    const imageSelected = imageInput.files.length > 0;
    const titleFilled = titleInput.value.trim() !== "";
    const categorySelected = categorySelect.value !== "";

    if (imageSelected && titleFilled && categorySelected) {
        validateModalBtn.style.backgroundColor = "#1D6154";
    } else {
        validateModalBtn.style.backgroundColor = "#CBD6DC";
    }
}

/**
 * vérifier si le fichier selectionné est conforme au format et taille indiquer
 */

imageInput.addEventListener('change', onChangeInputFile);

function onChangeInputFile(event) {
    imageField.style.display = 'none'; // Le label contenant le champ d'ajout d'image est masqué
    const file = event.target.files[0];

    if (!file.type.startsWith("image/")) {
        return;
    }

    if (file.size > 4 * 1024 * 1024) { // Vérifie que la taille du fichier est inférieure à 4 Mo
        alert("Image très volumineuse. Veuillez choisir une autre image.");
        // Réinitialiser l'input file pour permettre à l'utilisateur de sélectionner à nouveau une image
        imagePreview.style.display = 'none';
        imageField.style.display = 'flex';
        return;
    }

    imagePreview.style.display = 'flex';
    imagePreview.src = URL.createObjectURL(file);
}

/**
 * Activer le bouton "Valider" pour l'ajout d'une image *
 */

// Ajout des gestionnaires d'événements
imageInput.addEventListener("change", updateValidateButton);
titleInput.addEventListener("input", updateValidateButton);
categorySelect.addEventListener("change", updateValidateButton);
validateModalBtn.addEventListener("click", handleValidateButtonClick);

updateValidateButton(); // Appel de la fonction pour définir l'état initial du bouton Valider

/*****************************************************************
 * Cette fonction vérifie la validité des données avant le POST.
 *
 * @param {string} token - Le jeton d'authentification de l'utilisateur.
 * @param {string} title - Le titre à valider.
 * @param {string} image -  l'image à valider.
 * @param {number} categoryId - ID de la catégorie à valider.
 *
 * @returns {boolean} Renvoie vrai si les données sont valides, sinon faux.
 *****************************************************************/
function validateData(token, title, image, categoryId) {
    if (!token) {
        alert("Veuillez vous connecter pour effectuer cette opération.");
        return false;
    }

    if (!title) {
        alert("Veuillez entrer un titre.");
        return false;
    }

    if (!image) {
        alert("Veuillez sélectionner une photo.");
        return false;
    }

    if (!categoryId) {
        alert("Veuillez sélectionner une catégorie.");
        return false;
    }

    return true;
}

/**
 * Cette fonction gère le clic sur le bouton "Valider".
 * Elle extrait les données du formulaire (jeton, titre, image, catégorie),
 * valide les données, envoie une requête POST au serveur, gère la réponse
 * et effectue des actions en conséquence (comme réinitialiser les champs).
 */
async function handleValidateButtonClick() {
    const token = localStorage.getItem("token");
    const title = titleInput.value.trim();
    const image = imageInput.files[0];
    const categoryId = parseInt(categorySelect.value);

    if (validateData(token, title, image, categoryId)) {
        await postData(token, title, image, categoryId);

        alert("Photo ajoutée avec succès !");
        resetFieldsAndButtons(titleInput, categorySelect, imageInput, imagePreview, imageField);
        worksModal = await fetchWorks();
        generateWorksInHtml(worksModal);
        generateWorkModal(worksModal);
    }
}

/**
 * Cette fonction envoie une requête POST avec les données du formulaire.
 * Elle extrait les données du formulaire (jeton, titre, image, catégorie),
 * envoie la requête POST au serveur, gère la réponse, et effectue des actions
 * en conséquence (comme réinitialiser les champs et afficher des alertes).
 */
async function postData(token, title, image, categoryId) {

    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("category", categoryId);

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            alert("Erreur lors de l'ajout de la photo.");
        }
    } catch (error) {
        console.error("Erreur de réseau :", error);
    }
}

/********************************************************************
 * Cette fonction réinitialise les champs après l'ajout d'un fichier.
 *
 * @param {HTMLInputElement} titleInput - L'élément d'entrée pour le titre.
 * @param {HTMLSelectElement} categorySelect - L'élément de sélection pour la catégorie.
 * @param {HTMLInputElement} imageInput - L'élément d'entrée de type fichier pour les images.
 * @param {HTMLElement} imagePreview - L'élément pour l'aperçu de l'image.
 * @param {HTMLElement} imageField - L'élément contenant l'image.
 ********************************************************************/
function resetFieldsAndButtons(titleInput, categorySelect, imageInput, imagePreview, imageField) {
    titleInput.value = "";
    categorySelect.value = "";
    imageInput.value = "";
    imagePreview.style.display = 'none';
    imageField.style.display = 'flex';
    updateValidateButton();
}



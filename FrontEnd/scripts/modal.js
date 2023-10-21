/*
 * l'import des deux fonctions, fetchWorks et generateWorksInHtml du fichier "./works.js"
 */
import {fetchWorks, generateWorksInHtml} from "./works.js";

/**
 * Récupération des éléments du DOM
 * @type {HTMLElement}
 */
const editLink = document.getElementById('edit');
const modal = document.getElementById('myModal');
const message = document.getElementById("messageModal")

//Les elements HTML de la modal1 "Galerie photo"
const modalGalleryImage = document.getElementById("modalGallery");
const galleryModal = document.querySelector(".modalBody");
const addButton = document.getElementById("addModalButton");
const modalTitle1 = document.getElementById("modalTitle1");

//Les elements HTML de la modal2 "Ajout photo"
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

let worksModal = [];

/*
 * Ouverture de la fenêtre modal1 "Galerie photo" lors du clic sur le lien "modifier"
 * Récupération des travaux asynchrones avec fetchWorks().
 * Appel de la fonction generateWorkModal pour l'affichage de la galerie
 */
editLink.addEventListener('click', async (event) => {
    event.preventDefault();
    modal.style.display = 'flex';
    validateModalBtn.style.display = 'none';
    previousBtn.style.display = 'none';
    modalAddImage.style.display = 'none';
    worksModal = await fetchWorks();
    generateWorkModal(worksModal);
});

/*
 * Ouverture de la modal2 en cliquant sur le bouton "Ajouter une photo"
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

/*
 * Fermeture de la fenêtre modal lors du clic sur la croix
 */
closeBtn.addEventListener('click', closeModal);

/*
 * Fermeture de la fenêtre modale lorsque l'utilisateur clique en dehors de celle-ci
 */
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

/*
 * Cette fonction mise à jour la modale apres sa fermeture
 */
function closeModal() {
    modal.style.display = 'none';
    validateModalBtn.style.display = 'none';
    previousBtn.style.display = 'none';
    modalAddImage.style.display = 'none';
    modalGalleryImage.style.display = 'grid';
    addButton.style.display = 'block';
    imageField.style.display = 'none';
}

/*
 * le retour en arrière quand on clique sur la flèche
 */
previousBtn.addEventListener('click', () => {
    closeModal()
    modal.style.display = 'flex';
    modalTitle1.style.display = 'flex';
    modalTitle2.style.display = 'none';
});

/**
 * Affichage des photos dans la modal1 "Galerie photo"
 * @param {Array} works - Un tableau contenant les données des travaux à afficher dans la galerie.
 */
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

        trashIcon.addEventListener("click", () => {
            deletePicture(work.id);
        });
    });
}

/**
 * Suppression d'une photo de la modal "Galerie photo"
 * @param {number} id - L'identifiant unique de la photo à supprimer.
 */
function deletePicture(id) {
    const token = localStorage.getItem("token");
    const figureModal = document.getElementById(`modalWorkFigure_${id}`);

    fetch(`http://localhost:5678/api/works/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
        .then(async response => {
            if (response.ok) {
                figureModal.remove(); // Supprimer l'élément de la galerie
                worksModal = worksModal.filter((w) => w.id !== id);//  worksModal contient toutes les images actuelles
                generateWorksInHtml(worksModal);
                showMessageAlert('Votre projet a bien été supprimé !');
            } else {
                console.error("Échec de la suppression du projet");
            }
        })
        .catch(error => {
            console.error("Erreur lors de la suppression du projet:", error);
        });
}

/**
 * Cette fonction affiche un message d'alerte à l'utilisateur pendant 3 secondes.
 * @param {string} msg - Le message à afficher.
 */
function showMessageAlert(msg) {
    message.innerText = msg;
    message.style.display = 'flex';
    setTimeout(() => {
        message.style.display = 'none';
    }, 3000);
}

/*
 * Cette fonction vérifie si les trois champs du formulaire d'ajout d'un projet
 * sont bien remplis et active le bouton "Valider".
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

/*
 * vérifie si le fichier sélectionné est conforme au format et taille indiqués
 */

imageInput.addEventListener('change', onChangeInputFile);

function onChangeInputFile(event) {
    imageField.style.display = 'none'; // Le label contenant le champ d'ajout d'image est masqué
    const file = event.target.files[0];

    if (!file.type.startsWith("image/")) {
        return;
    }

    if (file.size > 4 * 1024 * 1024) { // Vérifie que la taille du fichier est inférieure à 4 Mo
        showMessageAlert("Photo très volumineuse. Veuillez choisir une autre.");

        // Réinitialiser l'input file pour permettre à l'utilisateur de sélectionner à nouveau une image
        imagePreview.style.display = 'none';
        imageField.style.display = 'flex';
        return;
    }

    imagePreview.style.display = 'flex';
    imagePreview.src = URL.createObjectURL(file);
}

/*
 * Activer le bouton "Valider" pour l'ajout d'une image
 */

imageInput.addEventListener("change", updateValidateButton);
titleInput.addEventListener("input", updateValidateButton);
categorySelect.addEventListener("change", updateValidateButton);
validateModalBtn.addEventListener("click", handleValidateButtonClick);

updateValidateButton(); // Appel de la fonction pour définir l'état initial du bouton Valider

/**
 * Cette fonction vérifie la validité des données avant le POST.
 *
 * @param {string} token - Le jeton d'authentification de l'utilisateur.
 * @param {string} title - Le titre a valider.
 * @param {string} image - l'image a validé.
 * @param {number} categoryId - ID de la catégorie à valider.
 *
 * @returns {boolean} Renvoie vrai si les données sont valides, sinon faux.
 */
function validateData(token, title, image, categoryId) {
    if (!token) {
        showMessageAlert("Veuillez vous connecter pour effectuer cette opération.");
        return false;
    }

    if (!image) {
        showMessageAlert("Veuillez sélectionner une photo.");
        return false;
    }

    if (!title) {
        showMessageAlert("Veuillez entrer un titre.");
        return false;
    }

    if (!categoryId) {
        showMessageAlert("Veuillez sélectionner une catégorie.");
        return false;
    }
    return true;
}

/*
 * Cette fonction gère l'événement de clic sur le bouton de validation.
 * si les données sont valides, elle les envoie au serveur en utilisant la fonction "postData".
 * En cas de succès, elle réinitialise les champs du formulaire, récupère les travaux depuis le serveur
 * Actualise la galerie de la page d'accueil et de la modal
 */
async function handleValidateButtonClick() {
    const token = localStorage.getItem("token");
    const title = titleInput.value.trim();
    const image = imageInput.files[0];
    const categoryId = parseInt(categorySelect.value);

    if (validateData(token, title, image, categoryId)) {
        await postData(token, title, image, categoryId);
        showMessageAlert("Projet ajouté avec succès !");
        resetFieldsAndButtons(titleInput, categorySelect, imageInput, imagePreview, imageField);
        worksModal = await fetchWorks();
        generateWorksInHtml(worksModal);
        generateWorkModal(worksModal);
    }
}

/**
 * Cette fonction envoie une requête POST avec les données du formulaire.
 *
 *  * @param {string} token - Le jeton d'authentification pour l'autorisation.
 *  * @param {string} title - Le titre de la photo à envoyer.
 *  * @param {File} image - Le fichier image à envoyer.
 *  * @param {number} categoryId - L'identifiant de la catégorie de la photo.
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
            showMessageAlert("Erreur lors de l'ajout du projet.");
        }
    } catch (error) {
        console.error("Erreur de réseau :", error);
    }
}

/**
 * Cette fonction réinitialise les champs après l'ajout d'un fichier.
 *
 * @param {HTMLInputElement} titleInput - L'élément d'entrée pour le titre.
 * @param {HTMLSelectElement} categorySelect - L'élément de sélection pour la catégorie.
 * @param {HTMLInputElement} imageInput - L'élément d'entrée de type fichier pour les images.
 * @param {HTMLElement} imagePreview - L'élément pour l'aperçu de l'image.
 * @param {HTMLElement} imageField - L'élément contenant l'image.
 */
function resetFieldsAndButtons(titleInput, categorySelect, imageInput, imagePreview, imageField) {
    titleInput.value = "";
    categorySelect.value = "";
    imageInput.value = "";
    imagePreview.style.display = 'none';
    imageField.style.display = 'flex';
    updateValidateButton();
}



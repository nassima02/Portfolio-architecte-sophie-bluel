import {fetchWorks} from "./works.js";

/********************************
 Création de la fenêtre modal
 *********************************/
//selection du lien de l'ouverture de la modal "modifier"
const editLink = document.getElementById('edit');

// Sélection de la fenêtre modale
const modal = document.getElementById('myModal');

//Sélection du button de validation de la modal
const validateModalBtn = document.getElementById('validateModalButton')

//Sélection du button d'ajout d'une image de la modal
const addModalBtn = document.getElementById("addModalButton")

//Sélection de la flèche pour le retour en arrière de la modal
const arrow = document.querySelector('.arrowBack')

//Sélectionner la modal2 "Ajouter une image"
const modalAdd = document.getElementById('pictureForm')


// Ouvrertur de la fenêtre modale1 "Gallerie photo"  lors du clic sur le lien "modifier"
editLink.addEventListener('click', () => {
    modal.style.display = 'block';
    validateModalBtn.style.display = 'none'
    arrow.style.display = 'none'
    modalAdd.style.display = 'none'
});

/*************************************************
 Affichage des photos dans  la modal galerie photo
 **************************************************/

const galeryModal = document.querySelector(".modalBody")

const worksModal = await fetchWorks()
worksModal.forEach(workModal => {


    const figureModal = document.createElement("figure")
    const imageModal = document.createElement('img')
    const trashIcon = document.createElement('i');

    imageModal.src = workModal.imageUrl
    imageModal.alt = workModal.name
    imageModal.id = workModal.id

    trashIcon.className = "fa-solid fa-trash-can trash-icon"

    // Ajoutez un écouteur d'événements au clic sur l'icône de la corbeille
    trashIcon.addEventListener("click", () => {
        deletePicture(imageModal.id)
    })

    figureModal.appendChild(imageModal)
    figureModal.appendChild(trashIcon)
    galeryModal.appendChild(figureModal)
})

/************************************************
 Suppression d'une photo de la galerrie modal
 ***********************************************/
function deletePicture(id) {
    const token = localStorage.getItem("token")
    const figureModal = document.createElement("figure")

    // Envoyez une requête DELETE à l'API pour supprimer la photo
    fetch(`http://localhost:5678/api/works/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
        .then(response => {
            if (response.ok) {// La photo a été supprimée avec succès

                figureModal.remove(); // Supprimez l'élément de la galerie
            } else {
                console.error("Échec de la suppression de la photo");// Gestion des erreurs si la suppression a échoué
            }
        })
        .catch(error => {
            console.error("Erreur lors de la suppression de la photo:", error);
        });
}

/*******************************
 Fermeture de la fenêtre modal
 *******************************/

// Sélection de l'élément de fermeture (la croix)
const closeBtn = document.querySelector('.close');

// Fermeture de la fenêtre modale lors du clic sur la croix
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Fermeture de la fenêtre modale lorsque l'utilisateur clique en dehors de celle-ci
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

/********************************************************************
 Ouvertur de la modale 2 en cliquant sur le button "Ajouter une photo"
 ********************************************************************/

//récuper de la modale1
const modal1 = document.getElementById("modalGallery")

//récuper le label d'ajout de photo
const picture = document.querySelector(".picture")

//récuper le champ d'affichage d'image
const imagePreview = document.getElementById('imagePreview')

addModalBtn.addEventListener('click', () => {

    addModalBtn.style.display = 'none'
    modal1.style.display = 'none'
    imagePreview.style.display = 'none'
    arrow.style.display = 'flex'
    modalAdd.style.display = 'flex'
    validateModalBtn.style.display = 'block'
    picture.style.display = 'flex'
})

/**********************************************************************
 Ajouter un ecouteur d'evenement de la flèche pour le retour en arrière
 **********************************************************************/
arrow.addEventListener('click', (event) => {

    modal.style.display = 'block';
    validateModalBtn.style.display = 'none'
    arrow.style.display = 'none'
    modalAdd.style.display = 'none'
    modal1.style.display = 'grid'
    addModalBtn.style.display = 'block'
    picture.style.display = 'none'
})

/********************************************************
 Afficher  la deuxième modal pour l'ajout des travaux
 ********************************************************/
//Récuperer l'input pour l'ajout d'un fichier
const inputPhoto = document.getElementById('photo');

inputPhoto.addEventListener('change', onChangeInputFile)

function onChangeInputFile(event) {
    picture.style.display = 'none' //le label contenant le boutton ajout image est masquer
    const file = event.target.files[0];

    if (!file.type.startsWith("image/")) {
        return;
    }
    imagePreview.style.display = 'flex'
    imagePreview.src = URL.createObjectURL(file);
}

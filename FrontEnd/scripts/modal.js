import {fetchWorks, generateWorksInHtml} from "./works.js";

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
editLink.addEventListener('click', (event) => {
    event.preventDefault();
    modal.style.display = 'flex';
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

    figureModal.id = `modalWorkFigure_${workModal.id}`;

    imageModal.src = workModal.imageUrl
    imageModal.alt = workModal.name
    // imageModal.id = workModal.id

    trashIcon.className = "fa-solid fa-trash-can trash-icon"

    figureModal.appendChild(imageModal)
    figureModal.appendChild(trashIcon)
    galeryModal.appendChild(figureModal)


    // Ajoutez un écouteur d'événements au clic sur l'icône de la corbeille
    trashIcon.addEventListener("click", () => {
        deletePicture(workModal.id)
    })
})

/************************************************
 Suppression d'une photo de la galerie modal
 ***********************************************/
function deletePicture(id) {
    const token = localStorage.getItem("token");
    const figureModal = document.getElementById(`modalWorkFigure_${id}`);

    // Envoyez une requête DELETE à l'API pour supprimer la photo
    fetch(`http://localhost:5678/api/works/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
        .then(async response => {
            if (response.ok) { // La photo a été supprimée avec succès
                figureModal.remove(); // Supprimez l'élément de la galerie
                // Supposons que worksModal contienne toutes les images actuelles
                const newAllWorks = worksModal.filter((w) => w.id !== id);
                updateHomePageGallery(newAllWorks);
                alert("Votre image a bien été supprimée !");
            } else {
                console.error("Échec de la suppression de la photo"); // Gestion des erreurs si la suppression a échoué
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
    validateModalBtn.style.display = 'none';
    arrow.style.display = 'none';
    modalAdd.style.display = 'none';
    modal1.style.display = 'grid';
    addModalBtn.style.display = 'block';
    picture.style.display = 'none';

    // Appelez la fonction pour mettre à jour la page d'accueil
    updateHomePageGallery(w); // Assurez-vous que w est défini
});
// Fermeture de la fenêtre modale lorsque l'utilisateur clique en dehors de celle-ci
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';

        // Appelez la fonction pour mettre à jour la page d'accueil
        updateHomePageGallery(w); // Assurez-vous que w est défini
    }
});

// Fonction pour mettre à jour la page d'accueil
function updateHomePageGallery(w) {
    // Vous pouvez insérer ici le code pour mettre à jour la galerie sur la page d'accueil.
    // Par exemple, si vous avez une fonction pour générer les éléments de galerie, appelez-la ici.
    generateWorksInHtml(w); // Assurez-vous que generateWorksInHtml est définie
}
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

    modal.style.display = 'flex';
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
const imageInput = document.getElementById('photo');
//const imagePreview = document.getElementById('image-preview'); // Assurez-vous que cette ligne est correcte

imageInput.addEventListener('change', onChangeInputFile);

function onChangeInputFile(event) {
    picture.style.display = 'none'; // Le label contenant le bouton d'ajout d'image est masqué
    const file = event.target.files[0];

    if (!file.type.startsWith("image/")) {
        return;
    }

    if (file.size > 4 * 1024 * 1024) { // Vérifie que la taille du fichier est inférieure à 4 Mo
        alert("Image très volumineuse. Veuillez choisir une autre image.");
        // Réinitialiser l'input file pour permettre à l'utilisateur de sélectionner à nouveau une image
       // imageInput.value = '';
        imagePreview.style.display = 'none';
        picture.style.display = 'flex';
        return;
    }

    imagePreview.style.display = 'flex';
    imagePreview.src = URL.createObjectURL(file);
}

/****************************************************
 Activer le boutton Valider pour l'ajout d'une image
 ****************************************************/
async function initializeModal() {

    const imageInput = document.getElementById("photo");
    const titleInput = document.getElementById("title");
    const categorySelect = document.getElementById("category");
    const validateButton = document.getElementById("validateModalButton");

// Ajoutez des gestionnaires d'événements pour surveiller les changements dans les champs
    imageInput.addEventListener("change", updateValidateButton);
    titleInput.addEventListener("input", updateValidateButton);
    categorySelect.addEventListener("change", updateValidateButton);

    function updateValidateButton() {
        // Vérifiez si les trois champs sont remplis
        const imageSelected = imageInput.files.length > 0;
        const titleFilled = titleInput.value.trim() !== "";
        const categorySelected = categorySelect.value !== "";

        // Activez le bouton Valider si tous les champs sont remplis, sinon désactivez-le
        if (imageSelected && titleFilled && categorySelected) {
            validateButton.style.backgroundColor = "#1D6154";
        } else {
            validateButton.style.backgroundColor = "#CBD6DC";
        }
    }

// Appelez la fonction initiale pour définir l'état initial du bouton Valider
    updateValidateButton();


    validateButton.addEventListener("click", function () {
        const token = localStorage.getItem("token");

        const title = titleInput.value.trim();
        const image = imageInput.files[0];
        const categoryId = parseInt(categorySelect.value);

        console.log('categoryId', categoryId)

        // vérifications de la présence des données
        if (!token) {
            alert("Veuillez vous connecter pour effectuer cette opération.");
            return
        }

        if (!title) {
            alert("Veuillez entrer un titre.");
            return
        }

        if (!image) {
            alert("Veuillez sélectionner une photo.");
            return
        }

        if (!categoryId) {
            alert("Veuillez sélectionner une catégorie.");
            return
        }

        const formData = new FormData();
        formData.append("image", image);
        formData.append("title", title);
        formData.append("category", categoryId)

        fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData
        })
            .then(async (response) => {

                if (!response.ok) {
                    alert("Erreur lors de l'ajout de la photo.");
                }

                alert("Photo ajoutée avec succès !");

                // Réinitialisez les champs après l'ajout réussi
                titleInput.value = "";
                categorySelect.value = "";
                imageInput.value = "";
                imagePreview.style.display = 'none'
                picture.style.display = 'flex'
                updateValidateButton(); // Rétablissez la couleur du bouton

               //const  worksModal = await fetchWorks()
//console.log ("works",worksModal)
                // Appelez updateHomePageGallery avec worksModal mis à jour
                // updateHomePageGallery(worksModal);


               return fetchWorks();
            }).then((worksModal) => {
                updateHomePageGallery(worksModal);
            })
            .catch((error) => {
                console.error("Erreur de réseau :", error);
            });
    });


}

initializeModal();
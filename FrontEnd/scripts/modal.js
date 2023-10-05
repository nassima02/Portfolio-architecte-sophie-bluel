
import {fetchWorks} from "./works.js";

/********************************
création de la fenêtre modal
*********************************/

const editLink = document.getElementById('edit');

// Sélectionnez la fenêtre modale
const modal = document.getElementById('myModal');

// Sélectionnez l'élément de fermeture (la croix)
const closeBtn = document.getElementsByClassName('close')[0];

// Ouvrir la fenêtre modale lors du clic sur le lien "modifier"

editLink.addEventListener('click', () => {
    modal.style.display = 'block';
});

// Fermer la fenêtre modale lors du clic sur la croix
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Fermer la fenêtre modale lorsque l'utilisateur clique en dehors de celle-ci
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});


/********************************************
Afficher les photos dans  la galery modal
********************************************/

const galeryModal = document.querySelector(".modalBody")

const worksModal = await fetchWorks()
worksModal.forEach(workModal => {


    const figureModal = document.createElement("figure")
    const imageModal =document.createElement('img')
    const trashIcon = document.createElement('i');

    imageModal.src = workModal.imageUrl
    imageModal.alt = workModal.name
    imageModal.id = workModal.id

    trashIcon.className = "fa-solid fa-trash-can trash-icon"

    // Ajoutez un gestionnaire d'événements de clic à l'icône de la corbeille
    trashIcon.addEventListener("click", () => {
        deletePicture(imageModal.id)
    })

    figureModal.appendChild(imageModal)
    figureModal.appendChild(trashIcon)
    galeryModal.appendChild(figureModal)
})
/*********************** Supprimer une photo de la galerrie modal ********************/
function deletePicture(id){
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

                    // Vous pouvez mettre à jour l'interface utilisateur ou effectuer d'autres actions ici
                    figureModal.remove(); // Supprimez l'élément de la galerie
                } else {
                    // Gestion des erreurs si la suppression a échoué
                    console.error("Échec de la suppression de la photo");
                }
            })
            .catch(error => {
                console.error("Erreur lors de la suppression de la photo:", error);
            });
    }



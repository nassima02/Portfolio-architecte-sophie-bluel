/**
 * Récupération des éléments du DOM
 * @type {HTMLElement}
 */
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const message = document.getElementById("message");

/*
 * Cet objet contient des messages d'erreur qui seront affichés en fonction du code d'état
 * de la réponse HTTP renvoyée par le serveur lors de la tentative de connexion.
 */
const errorMessages = {
    401: "Le mot de passe est incorrect. Veuillez réessayer.",
    404: "l'adresse mail ou le mot de passe est incorrect. Veuillez réessayer.",
    other: "Une erreur s'est produite lors de la connexion. "
};

/*
 * L'écoute de l'événement de soumission du formulaire
 */
loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email, password}),
        });

        if (response.ok) {
            const data = await response.json();
            const token = data.token;

            localStorage.setItem("token", token);

            window.location.href = "index.html"; //Rediriger l'utilisateur vers la page d'accueil en mode edition

        } else {
            message.textContent = errorMessages[response.status] || errorMessages.other;
        }
    } catch (error) {
        console.error(error);
    }
});

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    // Envoyer une requête POST à l'API pour la connexion
    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email, password}),
        });

        if (response.ok) {
            // Connexion réussie, récupérez le token
            const data = await response.json();
            const token = data.token;

            // Stockez le jeton dans le local storage
            localStorage.setItem("token", token);

            // Redirigez l'utilisateur vers la page "index.html" en mode édition
            window.location.href = "index.html";
        } else {
            // Affichez un message d'erreur en cas d'échec de la connexion
            message.textContent = "Votre identifiant ou mot de passe est incorrect. Veuillez réessayer.";
            localStorage.removeItem("token");
        }
    } catch (error) {
        console.error("Une erreur s'est produite lors de la connexion :", error);
    }
});

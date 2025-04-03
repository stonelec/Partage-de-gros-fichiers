// Fonction pour uploader un fichier
async function uploadFile(event) {
    event.preventDefault(); // Empêche le rechargement de la page

    const fileInput = document.getElementById("fileInput");
    if (fileInput.files.length === 0) {
        alert("Veuillez sélectionner un fichier.");
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
        const response = await fetch("/upload", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        alert("Upload réussi : " + data.filename);
    } catch (error) {
        console.error("Erreur lors de l'upload :", error);
    }
}

// Fonction pour télécharger un fichier
async function downloadFile() {
    try {
        const response = await fetch("/download");
        if (!response.ok) throw new Error("Erreur lors du téléchargement");

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement("a");
        a.href = url;
        a.download = "fichier_p2p"; // Nom du fichier téléchargé
        document.body.appendChild(a);
        a.click();
        a.remove();
    } catch (error) {
        console.error("Erreur de téléchargement :", error);
    }
}

// Ajout des écouteurs d'événements
document.addEventListener("DOMContentLoaded", function () {
    const uploadForm = document.getElementById("uploadForm");
    const downloadButton = document.getElementById("downloadButton");

    if (uploadForm) uploadForm.addEventListener("submit", uploadFile);
    if (downloadButton) downloadButton.addEventListener("click", downloadFile);
});

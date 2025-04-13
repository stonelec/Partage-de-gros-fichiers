document.addEventListener("DOMContentLoaded", () => {
    getTorrentInfoOnly();
    const downloadButton = document.querySelector(".card button.active");

    if (downloadButton) {
        downloadButton.addEventListener("click", () => {
            console.log("Téléchargement lancé...");
            downloadButton.disabled = true;
            downloadButton.textContent = "Téléchargement en cours...";
            downloadFile(); // Appelle ta fonction de téléchargement
        });
    }
});
// Fonction pour uploader un fichier
async function uploadFile(event) {
    event.preventDefault(); // Empêche le rechargement de la page

    const fileInput = document.getElementById("file-input");
    if (fileInput.files.length === 0) {
        alert("Veuillez sélectionner un fichier.");
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
        const response = await fetch("/file/upload", {
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
        const response = await fetch("/file/download");
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
document.getElementById('upload').style.display = 'flex';

document.getElementById('file-input').addEventListener('change', function () {
    console.log(document.getElementById('file-input').value);
    document.getElementById('share').style.display = 'flex';
    document.getElementById('upload').style.display = 'none';
    uploadFile();

});

document.getElementById('close').addEventListener('click', function () {
    document.getElementById('share').style.display = 'none';
    document.getElementById('upload').style.display = 'flex';



});
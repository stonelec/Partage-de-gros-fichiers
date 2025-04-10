document.addEventListener("DOMContentLoaded", () => {
    const url = "https://hey.ca";

    const card = document.querySelector(".card");
    if (card) {
        // Créer un conteneur pour le QR
        const qrContainer = document.createElement("div");
        card.appendChild(qrContainer);

        new QRCode(qrContainer, {
            text: url,
            width: 250,
            height: 250,
            correctLevel: QRCode.CorrectLevel.H
        });
    }

    // Met à jour le lien de téléchargement
    const downloadLink = document.querySelector(".download-link");
    if (downloadLink) {
        downloadLink.href = url;
        downloadLink.textContent = url;
    }

    document.getElementById('whatsapp').onclick = function () {
        console.log('whatsapp');
        const message = "Voici le lien de téléchargement du fichier via l'application Partage de Gros Fichier qui permet un partage Gratuit et sans aucunes limitations : ";
        const fullUrl = 'https://web.whatsapp.com/send?text=' + encodeURIComponent(message + url);
        window.open(fullUrl, '_blank');
    };

    document.getElementById('twitter').onclick = function () {
        console.log('twitter');
        const message = "Voici le lien de téléchargement du fichier via l'application Partage de Gros Fichier qui permet un partage Gratuit et sans aucunes limitations : ";
        const fullUrl = 'https://twitter.com/intent/tweet/?text=' + encodeURIComponent(message + url);
        window.open(fullUrl, '_blank');
    };

    document.getElementById('facebook').onclick = function () {
        console.log('facebook');
        const message = "Voici le lien de téléchargement du fichier via l'application Partage de Gros Fichier qui permet un partage Gratuit et sans aucunes limitations : ";
        const fullUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url) + '&quote=' + encodeURIComponent(message);
        window.open(fullUrl, '_blank');
    };

    document.getElementById('instagram').onclick = function () {
        const message = "Voici le lien de téléchargement du fichier via l'application Partage de Gros Fichier qui permet un partage Gratuit et sans aucunes limitations : ";
        const instagramUrl = "https://www.instagram.com/direct/inbox/";
        const fullMessage = message + "https://hey.ca";

        alert("Le message à été copié dans le presse-papier");
        navigator.clipboard.writeText(fullMessage);
        window.open(instagramUrl, '_blank');
    };

    document.getElementById('gmail').onclick = function () {
        const subject = "Téléchargement du fichier via Partage de Gros Fichier";
        const body = "Voici le lien de téléchargement du fichier via l'application Partage de Gros Fichier qui permet un partage Gratuit et sans aucunes limitations :\n\nhttps://hey.ca";
        const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
    };

});

document.getElementById('upload').style.display = 'flex';

// Function to handle file upload
document.getElementById('file-input').addEventListener('change', function () {
    const input = document.getElementById('file-input');
    console.log(input);
    document.getElementById('share').style.display = 'flex';
    document.getElementById('upload').style.display = 'none';
    uploadFile(input);

});
// Function to handle closing file upload
document.getElementById('close').addEventListener('click', function () {
    document.getElementById('share').style.display = 'none';
    document.getElementById('upload').style.display = 'flex';
});

document.addEventListener("DOMContentLoaded", () => {

    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('file-input');

    dropArea.addEventListener('click', () => {
        fileInput.click(); // simule un clic sur le vrai input file
    });

});


function setupURL(url){
    const card = document.querySelector(".qrcode");
    //vider le contenu de la carte
    card.innerHTML = "";
    const qrContainer = document.createElement("div");
    card.appendChild(qrContainer);

    new QRCode(qrContainer, {
        text: url,
        width: 250,
        height: 250,
        correctLevel: QRCode.CorrectLevel.H
    });
    const image = document.querySelector("#qrcode img");

    image.setAttribute("draggable", "false");

    const downloadLink = document.querySelector(".download-link");
    if (downloadLink) {
        downloadLink.href = url;
        downloadLink.textContent = "Télécharger le fichier";
    }

    //copy url
    document.getElementById('copy').onclick = function () {
        const icon = document.getElementById('copy'); // récupération de l'élément

        icon.setAttribute('icon', 'fluent:document-copy-24-filled'); // modification de l'icône
        navigator.clipboard.writeText(url); // copie dans le presse-papiers
    };


    //share on social media
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
        const body = "Voici le lien de téléchargement du fichier via l'application Partage de Gros Fichier qui permet un partage Gratuit et sans aucunes limitations :\n" + url;;
        const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
    };

    document.getElementById('discord').onclick = function () {
        const message = "Voici le lien de téléchargement du fichier via l'application Partage de Gros Fichier qui permet un partage Gratuit et sans aucunes limitations :\n" + url;;

        const discordUrl = `https://discordapp.com/channels/@me/123456789012345678?message=${encodeURIComponent(message)}`;
        alert("Le message à été copié dans le presse-papier");
        navigator.clipboard.writeText(message);
        window.open(discordUrl, "_blank");
    };

}
async function uploadFile(input) {
    const client = new WebTorrent({
        tracker: {
            rtcConfig: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' }, // STUN
                    {
                        urls: 'turn:relay1.openwebrtc.io:443',
                        username: 'openwebrtc',
                        credential: 'webrtc'
                    } // TURN public
                ]
            }
        }
    });

    const files = input.files;
    if (files.length === 0) {
        alert("Please select a file!");
        return;
    }

    // Calculer la taille totale
    let totalSize = 0;
    const fileList = document.getElementById("fileList");
    fileList.innerHTML = "";

    const zip = new JSZip();
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        zip.file(file.name, await file.arrayBuffer());
        totalSize += file.size;

    }

    document.getElementById("totalSize").textContent = (totalSize / 1024 / 1024).toFixed(2);

    //Nom fichier
    const fileName = "Partage-de-gros-fichers-" + Date.now() + ".zip";
    fileList.appendChild(document.createTextNode(fileName));
    // Générer le fichier ZIP
    const blob = await zip.generateAsync({ type: "blob" });
    const zipFile = new File([blob], fileName, { type: "application/zip" });
    const baseURL = window.location.origin; // 'https://partage-de-gros-fichiers.onrender.com'

    // Seed le fichier zip avec WebTorrent
    let torrent = client.seed(zipFile, (t) => {
        const magnetURI = t.magnetURI;

        // Construire dynamiquement l'URL

        const uniqueURL = `${baseURL}/download?magnet=${encodeURIComponent(magnetURI)}`;

        console.log("uniqueURL : ", uniqueURL);


        setupURL(uniqueURL);

        t.on("upload", () => {
            const percentUploaded = (t.uploaded / t.length) * 100;
            const clampedPercent = Math.min(percentUploaded, 100);
            document.querySelector(".download-section .progress-bar").style.width = clampedPercent + "%";

            document.getElementById("uploadPercentage").textContent = ` - ${Math.round(clampedPercent)}%`;
            document.getElementById("uploadSpeed").textContent = ` - Upload speed: ${(t.uploadSpeed / 1024).toFixed(2)} KB/s - `;
            document.getElementById("peerCount").textContent = `Peers: ${t.numPeers}`;
        });

        t.on("done", () => {
            console.log("Transfert terminé.");
            client.remove(torrent);
        });
    });

    const heartbeatInterval = setInterval(() => {
        console.log("Keeping the connection alive...");
    }, 5000);

    const connectionCheckInterval = setInterval(() => {
        if (torrent.numPeers === 0) {
            console.log("No connected peers. Attempting to reconnect...");
        }
    }, 10000);

    window.addEventListener("beforeunload", () => {
        clearInterval(heartbeatInterval);
        clearInterval(connectionCheckInterval);
    });
}


function downloadFile() {
    const client = new WebTorrent();

    // Récupérer l'URL complète et extraire le lien magnet
    const urlParams = new URLSearchParams(window.location.search);
    const magnetURI = urlParams.get('magnet');

    if (!magnetURI) {
        alert("Aucun lien magnet trouvé !");
        return;
    }
    console.log("magnetURI : ",magnetURI);

    // Télécharger le fichier via WebTorrent
    client.add(magnetURI, function (torrent) {
        console.log("Test")
        console.log("Téléchargement démarré pour :", torrent.name);

        torrent.files.forEach(file => {
            // Créer un lien de téléchargement
            file.getBlobURL((err, url) => {
                if (err) return console.error("Erreur de récupération :", err);

                const a = document.createElement('a');
                a.href = url;
                a.download = file.name;
                a.textContent = `Télécharger ${file.name}`;
                a.className = "download-link";

                document.getElementById("filename").innerHTML = `Nom : ${file.name}`;
                // Afficher la taille du fichier dans un p
                const fileSize = (file.length / 1024 / 1024).toFixed(2);
                document.getElementById("fileSize").innerHTML = `Taille : ${fileSize} Mo`;

                document.getElementById("fileList").appendChild(a);
            });
        });

        // Mettre à jour la barre de progression
        torrent.on('download', () => {
            const percent = (torrent.downloaded / torrent.length) * 100;
            const clampedPercent = Math.min(percent, 100);

            document.querySelector(".progress-bar").style.width = clampedPercent + "%";

            document.getElementById("downloadPercentage").textContent = ` - ${Math.round(clampedPercent)}% - `;
            document.getElementById("downloadSpeed").textContent = `Download speed: ${(torrent.downloadSpeed / 1024).toFixed(2)} KB/s`;
        });

        torrent.on('done', () => {
            console.log('Téléchargement terminé');
        });
    }).on('error', err => {
        console.error("Erreur WebTorrent :", err);
    });
}


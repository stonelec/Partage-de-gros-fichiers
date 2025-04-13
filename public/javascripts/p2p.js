function uploadFile(input) {
    const client = new WebTorrent();

    const files = input.files;
    if (files.length === 0) {
        alert("Please select a file!");
        return;
    }
    const zip = new JSZip();

    // Ajoute chaque fichier dans le ZIP
    for (let file of files) {
        const arrayBuffer = await file.arrayBuffer();
        zip.file(file.name, arrayBuffer);
    }
    // Génére le ZIP final (en Blob)
    const zipBlob = await zip.generateAsync({ type: "blob" });
    // Crée un fichier zip simulé pour le partager
    const zipFile = new File([zipBlob], "partage_fichiers.zip", {
        type: "application/zip",
    });


    // Calculate total size
    let totalSize = 0;
    for (let i = 0; i < files.length; i++) {
        totalSize += files[i].size; // Add each file size
    }
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2); // Convert to MB
    document.getElementById("totalSize").textContent = totalSizeMB; // Display total size

    // Display selected files information
    const fileList = document.getElementById("fileList");
    fileList.innerHTML = ""; // Clear previous file list
    for (let i = 0; i < files.length; i++) {
        const listItem = document.createElement("li");
        listItem.textContent = files[i].name; // Display the file name
        fileList.appendChild(listItem);
    }
    // RC : Pas besoins de ça
    //document.getElementById("fileInfo").style.display = "block"; // Show file info

    // RC : Pas besoins de ça
    // Hide the file select area and share button
    //document.getElementById("file-select-area").style.display = "none"; // Hide file input and button

    // RC : Pas besoins de ça, mais peut être utile
    // Show "Processing..." message
    //document.getElementById("processingMessage").style.display = "block";
    //document.getElementById("shareInfo").style.display = "none";

    // Seed the file(s) using WebTorrent
    let torrent = client.seed(files, (t) => {
        const magnetURI = t.magnetURI;
        const uniqueURL = `http://localhost:3000/download?magnet=${encodeURIComponent(
            magnetURI
        )}`;

        // RC : Pas besoins de ça, mais peut être utile
        // Hide "Processing..." message
        //document.getElementById("processingMessage").style.display = "none";

        // Show the URL and other sharing info
        console.log("uniqueURL : ",uniqueURL)
        //RC : trop long
        /*
        //document.getElementById("shareURL").textContent = uniqueURL; // texte cliquable visible
        document.getElementById("download-link").textContent = "http://localhost:3000/download?magnet=..."
        document.getElementById("download-link").href = uniqueURL;         // destination du lien
        // RC : Pas besoins de ça
        //document.getElementById("shareInfo").style.display = "block";

        // Copy URL to clipboard
        document.getElementById("copy").addEventListener("click", () => {
            navigator.clipboard.writeText(uniqueURL);
            const copyButton = document.getElementById("copy");
            copyButton.textContent = "Copied"; // Change button text to 'Copied'
            setTimeout(() => {
                copyButton.textContent = "Copy URL"; // Reset button text after 2 seconds
            }, 2000); // Reset the text back after 2 seconds
        });
        */
        setupURL(uniqueURL); // Call the function to set up the QR code and download link
        // Update upload stats
        t.on("upload", (bytes) => {
            const percentUploaded = (t.uploaded / t.length) * 100;
            const clampedPercent = Math.min(percentUploaded, 100); // Ensure it does not exceed 100%

            // Met à jour dynamiquement la largeur de la barre
            document.querySelector(".download-section .progress-bar").style.width = clampedPercent + "%";

            // Met à jour dynamiquement le texte affichant le pourcentage
            document.querySelector(".download-section .progress-text").textContent = `${Math.round(clampedPercent)}%`;

            document.getElementById(
                "uploadPercentage"
            ).textContent = `${Math.round(clampedPercent)}%`; // Update percentage
            document.getElementById(
                "uploadSpeed"
            ).textContent = `Upload speed: ${(t.uploadSpeed / 1024).toFixed(
                2
            )} KB/s`;
            document.getElementById(
                "peerCount"
            ).textContent = `Peers: ${t.numPeers}`;
        });

        t.on("done", () => {
            // RC : erreur ici
            //document.getElementById("transferComplete").style.display = "block";
            client.remove(torrent);
        });
    });

    // Start the heartbeat mechanism every 5 seconds
    const heartbeatInterval = setInterval(() => {
        console.log("Keeping the connection alive...");
    }, 5000); // Every 5 seconds

    // Start checking connection every 10 seconds
    const connectionCheckInterval = setInterval(() => {
        if (torrent.numPeers === 0) {
            console.log("No connected peers. Attempting to reconnect...");
            // Do not re-seed; instead, just log and check the connection status
        }
    }, 10000); // 10 seconds

    // Clean up on window unload
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

                document.getElementById("fileList").appendChild(a);
            });
        });

        // Mettre à jour la barre de progression
        torrent.on('download', () => {
            const percent = (torrent.downloaded / torrent.length) * 100;
            const clampedPercent = Math.min(percent, 100);

            document.querySelector(".progress-bar").style.width = clampedPercent + "%";
            document.querySelector(".progress-text").textContent = `${Math.round(clampedPercent)}%`;
        });

        torrent.on('done', () => {
            console.log('Téléchargement terminé');
        });
    }).on('error', err => {
        console.error("Erreur WebTorrent :", err);
    });
}


async function uploadFile(input) {
    const client = new WebTorrent({
        tracker: {
            rtcConfig: {
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
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

    // Seed le fichier zip avec WebTorrent
    let torrent = client.seed(zipFile, (t) => {
        const magnetURI = t.magnetURI;
        const uniqueURL = `https://localhost:3000/receiver?magnet=${encodeURIComponent(magnetURI)}`;
        console.log("uniqueURL : ", uniqueURL);

        setupURL(uniqueURL);

        t.on("upload", () => {
            const percentUploaded = (t.uploaded / t.length) * 100;
            const clampedPercent = Math.min(percentUploaded, 100);
            document.querySelector(".download-section .progress-bar").style.width = clampedPercent + "%";
            document.querySelector(".download-section .progress-text").textContent = `${Math.round(clampedPercent)}%`;

            document.getElementById("uploadPercentage").textContent = `${Math.round(clampedPercent)}%`;
            document.getElementById("uploadSpeed").textContent = `Upload speed: ${(t.uploadSpeed / 1024).toFixed(2)} KB/s`;
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

function uploadFile(input) {
    const client = new WebTorrent({
        tracker: {
            rtcConfig: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' }, // STUN public
                ]
            }
        }
    });
    const files = input.files;
    if (files.length === 0) {
        alert("Please select a file!");
        return;
    }

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
        const uniqueURL = `https://localhost:3000/receiver?magnet=${encodeURIComponent(
            magnetURI
        )}`;

        // RC : Pas besoins de ça, mais peut être utile
        // Hide "Processing..." message
        //document.getElementById("processingMessage").style.display = "none";

        // Show the URL and other sharing info
        console.log("uniqueURL : ",uniqueURL)
        //RC : trop long
        //document.getElementById("shareURL").textContent = uniqueURL; // texte cliquable visible
        document.getElementById("download-link").textContent = "https://localhost:3000/receiver?magnet=..."
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

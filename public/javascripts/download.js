document.getElementById("shareBtn").addEventListener("click", function () {
    const client = new WebTorrent(); // Instantiate WebTorrent client
    const files = document.getElementById("fileInput").files;

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
    document.getElementById("fileInfo").style.display = "block"; // Show file info

    // Hide the file select area and share button
    document.getElementById("file-select-area").style.display = "none"; // Hide file input and button

    // Show "Processing..." message
    document.getElementById("processingMessage").style.display = "block";
    document.getElementById("shareInfo").style.display = "none";

    // Seed the file(s) using WebTorrent
    let torrent = client.seed(files, (t) => {
        const magnetURI = t.magnetURI;
        const uniqueURL = `https://p2pfileshare.com/receiver?magnet=${encodeURIComponent(
            magnetURI
        )}`;

        // Hide "Processing..." message
        document.getElementById("processingMessage").style.display = "none";

        // Show the URL and other sharing info
        document.getElementById("shareURL").value = uniqueURL;
        document.getElementById("shareInfo").style.display = "block";

        // Copy URL to clipboard
        document.getElementById("copyURLBtn").addEventListener("click", () => {
            navigator.clipboard.writeText(uniqueURL);
            const copyButton = document.getElementById("copyURLBtn");
            copyButton.textContent = "Copied"; // Change button text to 'Copied'
            setTimeout(() => {
                copyButton.textContent = "Copy URL"; // Reset button text after 2 seconds
            }, 2000); // Reset the text back after 2 seconds
        });

        // Update upload stats
        t.on("upload", (bytes) => {
            const percentUploaded = (t.uploaded / t.length) * 100;
            const clampedPercent = Math.min(percentUploaded, 100); // Ensure it does not exceed 100%
            document.getElementById("uploadProgress").value = clampedPercent;
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
            document.getElementById("transferComplete").style.display = "block";
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
});

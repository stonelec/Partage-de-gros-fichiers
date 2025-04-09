document.getElementById("send").addEventListener("click", function () {
    const client = new WebTorrent();
    const files = document.getElementById("file").files;

    if (files.length === 0) {
        alert("Please select a file to send.");
        return;
    }

    let torrent = client.seed(files, function (t) {
        console.log("Torrent info hash:", t.infoHash);
        const magnetURI = t.magnetURI;
        const torrentURL = `http://localhost:3000/download?magnetURI=${encodeURIComponent(
            magnetURI
        )}`;

        // document.getElementById("torrentURL").value = torrentURL;

        t.on("upload", (bytes) => {
            console.log(`Uploaded: ${bytes} bytes`);
        });
    });
});

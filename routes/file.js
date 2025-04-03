const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Configurer Multer pour stocker les fichiers
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "Aucun fichier reçu" });
    }
    res.json({ message: "Fichier uploadé avec succès", filename: req.file.filename });
});

router.get("/download", (req, res) => {
    const filePath = path.join(__dirname, "../uploads/example.txt");  // Remplace avec un fichier réel
    res.download(filePath);
});

module.exports = router;

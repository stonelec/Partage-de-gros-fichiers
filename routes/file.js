const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Configurer Multer pour stocker les fichiers avec leurs extensions d'origine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        // Génère un nom de fichier unique avec son extension d'origine
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname); // Récupère l'extension du fichier
        cb(null, uniqueSuffix + ext); // Utilise l'extension dans le nom du fichier
    }
});

const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "Aucun fichier reçu" });
    }
    res.json({ message: "Fichier uploadé avec succès", filename: req.file.filename });
});

router.get("/download", (req, res) => {
    const fileName = "1743692413857-16283106.png"; // Utilise le nom réel du fichier
    const filePath = path.join(__dirname, "../uploads", fileName);  // Ajoute l'extension au fichier
    res.download(filePath);
});

module.exports = router;

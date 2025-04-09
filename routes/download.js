var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
    res.render("download", { title: "Download" });
});

module.exports = router;

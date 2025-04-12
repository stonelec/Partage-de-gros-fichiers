var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/share", function (req, res, next) {
    res.render("share", { title: "share" });
});
router.get("/download", function (req, res, next) {
    res.render("download", { title: "download" });
});
module.exports = router;

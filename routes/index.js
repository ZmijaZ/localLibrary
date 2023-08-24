var express = require("express");
var router = express.Router();
// const asyncHandler = require("express-async-handler");

/* GET home page. */
router.get("/", function (req, res, next) {
  try {
    // res.render("index", { title: "Express" });

    res.redirect("/catalog");
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

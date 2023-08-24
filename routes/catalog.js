const express = require("express");
const router = express.Router();

const authorController = require("../controllers/authorController");
const bookController = require("../controllers/bookController");
const bookinstanceController = require("../controllers/bookinstanceController");
const genreController = require("../controllers/genreController");

router.get("/", bookController.index);

router.get("/books", bookController.book_list);
router.get("/book-instances", bookinstanceController.bookinstance_list);
router.get("/authors", authorController.author_list);

module.exports = router;

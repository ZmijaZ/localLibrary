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
router.get("/genres", genreController.genre_list);

router.get("/genre/create", genreController.genre_create_get);
router.post("/genre/create", genreController.genre_create_post);
router.get("/author/create", authorController.author_create_get);
router.post("/author/create", authorController.author_create_post);
router.get("/book/create", bookController.book_create_get);
router.post("/book/create", bookController.book_create_post);
router.get(
  "/bookinstance/create",
  bookinstanceController.bookinstance_create_get
);
router.post(
  "/bookinstance/create",
  bookinstanceController.bookinstance_create_post
);

router.get("/genre/:id", genreController.genre_detail);
router.get("/author/:id", authorController.author_detail);
router.get("/book/:id", bookController.book_detail);
router.get("/bookInstance/:id", bookinstanceController.bookinstance_detail);

module.exports = router;

const express = require("express");
const router = express.Router();

const authorController = require("../controllers/authorController");
const bookController = require("../controllers/bookController");
const bookinstanceController = require("../controllers/bookinstanceController");
const genreController = require("../controllers/genreController");

router.get("/", bookController.index);

//listing
router.get("/books", bookController.book_list);
router.get("/book-instances", bookinstanceController.bookinstance_list);
router.get("/authors", authorController.author_list);
router.get("/genres", genreController.genre_list);

//creation
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

//deletion
router.get("/author/:id/delete", authorController.author_delete_get);
router.post("/author/:id/delete", authorController.author_delete_post);
router.get("/book/:id/delete", bookController.book_delete_get);
router.post("/book/:id/delete", bookController.book_delete_post);
router.get(
  "/bookinstance/:id/delete",
  bookinstanceController.bookinstance_delete_get
);
router.post(
  "/bookinstance/:id/delete",
  bookinstanceController.bookinstance_delete_post
);
router.get("/genre/:id/delete", genreController.genre_delete_get);

//detail
router.get("/genre/:id", genreController.genre_detail);
router.get("/author/:id", authorController.author_detail);
router.get("/book/:id", bookController.book_detail);
router.get("/bookinstance/:id", bookinstanceController.bookinstance_detail);

module.exports = router;

const Genre = require("../models/genreModel");
const Book = require("../models/bookModel");
const asyncHandler = require("express-async-handler");

exports.genre_list = asyncHandler(async (req, res, next) => {
  const allGenres = await Genre.find().sort({ name: 1 }).exec();

  res.render("genreList", { title: "Genre List", genreList: allGenres });
});

exports.genre_detail = asyncHandler(async (req, res, next) => {
  const [genre, booksInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, "title summary").exec(),
  ]);

  if (genre === null) {
    // No results.
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  }

  res.render("genreDetail", {
    title: "Genre detail",
    genre: genre,
    genreBooks: booksInGenre,
  });
});

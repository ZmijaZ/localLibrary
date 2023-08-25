const Genre = require("../models/genreModel");
const Book = require("../models/bookModel");
const asyncHandler = require("express-async-handler");
//form validation/sanitation
const { body, validationResult } = require("express-validator");

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

exports.genre_create_get = (req, res, next) => {
  res.render("genreForm", { title: "Create Genre", genre: {}, errors: [] });
};

exports.genre_create_post = [
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      res.render("genreForm", {
        title: "Create genre",
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      const genreExists = await Genre.findOne({ name: req.body.name }).exec();
      if (genreExists) {
        res.redirect(genreExists.url);
      } else {
        await genre.save();
        res.redirect(genre.url);
      }
    }
  }),
];

exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  const [genre, booksOfGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }).exec(),
  ]);

  if (genre === null) {
    res.redirect("/catalog/genres");
  }

  res.render("genreDelete", {
    title: "Delete genre",
    genre: genre,
    booksOfGenre: booksOfGenre,
  });
});

exports.genre_create_post = asyncHandler(async (req, res, next) => {
  const [genre, booksOfGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }).exec(),
  ]);

  if (booksOfGenre.length > 0) {
    res.render("genreDelete", {
      title: "Delete genre",
      genre: genre,
      booksOfGenre: booksOfGenre,
    });
    return;
  } else {
    await Genre.findByIdAndDelete(req.body.genreid).exec();
    res.redirect("/catalog/genres");
  }
});

exports.genre_update_get = asyncHandler(async (req, res, next) => {
  const genre = await Genre.findById(req.params.id);

  if (genre === null) {
    const error = new Error("Genre not found");
    error.status = 404;
    return next(err);
  }

  res.render("genreForm", {
    title: "Update genre",
    genre: genre,
    errors: [],
  });
});

exports.genre_update_post = [
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const genre = new Genre({ name: req.body.name, _id: req.params.id });

    if (!errors.isEmpty()) {
      res.render("genreForm", {
        title: "Create genre",
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      const genreExists = await Genre.findOne({ name: req.body.name }).exec();
      if (genreExists) {
        res.redirect(genreExists.url);
      } else {
        const updatedGenre = await Genre.findByIdAndUpdate(
          req.params.id,
          genre,
          {}
        );
        res.redirect(updatedGenre.url);
      }
    }
  }),
];

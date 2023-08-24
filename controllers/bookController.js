const Book = require("../models/bookModel");
const Author = require("../models/authorModel");
const Genre = require("../models/genreModel");
const BookInstance = require("../models/bookinstanceModel");

const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  const [
    numBooks,
    numBookInstances,
    numAvaliableBookInstances,
    numAuthors,
    numGenres,
  ] = await Promise.all([
    Book.countDocuments({}).exec(),
    BookInstance.countDocuments({}).exec(),
    BookInstance.countDocuments({ status: "Available" }).exec(),
    Author.countDocuments({}).exec(),
    Genre.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "Local library Home",
    bookCount: numBooks,
    bookInstanceCount: numBookInstances,
    bookInstanceAvailableCount: numAvaliableBookInstances,
    authorCount: numAuthors,
    genreCount: numGenres,
  });
});

exports.book_list = asyncHandler(async (req, res, next) => {
  const allBooks = await Book.find({}, "title author")
    .sort({ title: 1 })
    .populate("author")
    .exec();

  res.render("bookList", { title: "Book list", bookList: allBooks });
});

exports.book_detail = asyncHandler(async (req, res, next) => {
  const [book, instancesOfBook] = await Promise.all([
    Book.findById(req.params.id).populate("author").populate("genre").exec(),
    BookInstance.find({ book: req.params.id }).exec(),
  ]);

  if (book === null) {
    const err = new Error("Book not found");
    err.status = 404;
    return next(err);
  }

  res.render("bookDetail", {
    title: "Book detail",
    book: book,
    bookInstances: instancesOfBook,
  });
});

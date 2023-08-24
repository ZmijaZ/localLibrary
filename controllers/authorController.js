const Author = require("../models/authorModel");
const Book = require("../models/bookModel");
const asyncHandler = require("express-async-handler");

//use exports.function because I have a lot functions to export from the file

exports.author_list = asyncHandler(async (req, res, next) => {
  const allAuthors = await Author.find().sort({ family_name: 1 }).exec();

  res.render("authorList", {
    title: "Author List",
    authorList: allAuthors,
  });
});

exports.author_detail = asyncHandler(async (req, res, next) => {
  const [author, booksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (author === null) {
    const err = new Error("Error, author not found");
    err.status = 404;
    return next(err);
  }

  res.render("authorDetail", {
    title: "Author detail",
    author: author,
    authorBooks: booksByAuthor,
  });
});

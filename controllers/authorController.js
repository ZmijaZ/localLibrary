const Author = require("../models/authorModel");
const Book = require("../models/bookModel");
const asyncHandler = require("express-async-handler");

const { body, validationResult } = require("express-validator");

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

exports.author_create_get = (req, res, next) => {
  res.render("authorForm", { title: "Create Author", author: {}, errors: [] });
};

exports.author_create_post = [
  // Validate and sanitize fields.
  body("firstName")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("familyName")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  body("DOB", "Invalid date of birth")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  body("DOD", "Invalid date of death")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create Author object with escaped and trimmed data
    let name = req.body.firstName;
    console.log(name);
    const author = new Author({
      first_name: req.body.firstName,
      family_name: req.body.familyName,
      date_of_birth: req.body.DOB,
      date_of_death: req.body.DOD,
    });
    console.log(author);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("authorForm", {
        title: "Create Author",
        author: author,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.

      // Save author.
      await author.save();
      // Redirect to new author record.
      res.redirect(author.url);
    }
  }),
];

exports.author_delete_get = asyncHandler(async (req, res, next) => {
  const [author, booksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (author === null) {
    res.redirect("/catalog/authors");
  }

  res.render("authorDelete", {
    title: "Delete author",
    author: author,
    author_books: booksByAuthor,
  });
});

exports.author_delete_post = asyncHandler(async (req, res, next) => {
  const [author, booksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (booksByAuthor.length > 0) {
    res.render("authorDelete", {
      title: "Delete author",
      author: author,
      author_books: booksByAuthor,
    });
    return;
  } else {
    await Author.findByIdAndDelete(req.body.authorid);
    res.redirect("/catalog/authors");
  }
});

exports.author_update_get = asyncHandler(async (req, res, next) => {
  const author = await Author.findById(req.params.id);

  if (author === null) {
    const error = new Error("Author not found");
    error.status = 404;
    return next(err);
  }

  res.render("authorForm", {
    title: "Update author",
    author: author,
    errors: [],
  });
});

exports.author_update_post = [
  body("firstName")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("familyName")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  body("DOB", "Invalid date of birth")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  body("DOD", "Invalid date of death")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create Author object with escaped and trimmed data
    let name = req.body.firstName;
    console.log(name);
    const author = new Author({
      first_name: req.body.firstName,
      family_name: req.body.familyName,
      date_of_birth: req.body.DOB,
      date_of_death: req.body.DOD,
      _id: req.params.id, //OBAVEZNO <----------------------------------!!!
    });
    console.log(author);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("authorForm", {
        title: "Create Author",
        author: author,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.

      // Save author.
      const updatedAuthor = await Author.findByIdAndUpdate(
        req.params.id,
        author,
        {}
      );
      // Redirect to new author record.
      res.redirect(updatedAuthor.url);
    }
  }),
];

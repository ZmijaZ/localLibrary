const Author = require("../models/authorModel");
const asyncHandler = require("express-async-handler");

//use exports.function because I have a lot functions to export from the file

exports.author_list = asyncHandler(async (req, res, next) => {
  const allAuthors = await Author.find().sort({ family_name: 1 }).exec();

  res.render("authorList", {
    title: "Author List",
    authorList: allAuthors,
  });
});

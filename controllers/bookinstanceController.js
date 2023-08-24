const BookInstance = require("../models/bookinstanceModel");
const asyncHandler = require("express-async-handler");

exports.bookinstance_list = asyncHandler(async (req, res, next) => {
  const allBookInstances = await BookInstance.find().populate("book").exec();

  res.render("bookInstanceList", {
    title: "Book instance list",
    bookInstanceList: allBookInstances,
  });
});

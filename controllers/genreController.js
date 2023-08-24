const Genre = require("../models/genreModel");
const asyncHandler = require("express-async-handler");

exports.genre_list = asyncHandler(async (req, res, next) => {
  const allGenres = await Genre.find().sort({ name: 1 }).exec();

  res.render("genreList", { title: "Genre List", genreList: allGenres });
});

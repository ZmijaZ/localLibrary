const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { DateTime } = require("luxon");

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

AuthorSchema.virtual("name").get(function () {
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}  ${this.first_name}`;
  }

  return fullname;
});

AuthorSchema.virtual("url").get(function () {
  return `/catalog/author/${this._id}`;
});

AuthorSchema.virtual("dateOfBirth").get(function () {
  return DateTime.fromJSDate(this.date_of_birth).toLocaleString(
    DateTime.DATE_MED
  );
});

AuthorSchema.virtual("dateOfDeath").get(function () {
  return DateTime.fromJSDate(this.date_of_death).toLocaleString(
    DateTime.DATE_MED
  );
});

AuthorSchema.virtual("lifeSpan").get(function () {
  let dob = DateTime.fromJSDate(this.date_of_birth).toLocaleString(
    DateTime.DATE_MED
  );
  ("Unknown");
  let dod = DateTime.fromJSDate(this.date_of_death).toLocaleString(
    DateTime.DATE_MED
  );
  ("Unknown");

  if (dob === "Invalid DateTime") {
    dob = "Unknown";
  }
  if (dod === "Invalid DateTime") {
    dod = "Unknown";
  }

  return `${dob} - ${dod}`;
});

module.exports = mongoose.model("Author", AuthorSchema);

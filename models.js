const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// schema for movies
let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    Bio: String,
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean,
});

// schema for users
let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

// function to hash a password
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

// function to validate users's password
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

// define models variables
let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);

// export models
module.exports.Movie = Movie;
module.exports.User = User;

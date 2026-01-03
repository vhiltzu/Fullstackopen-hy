const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 3,
    },
    favoriteGenre: {
      type: String,
      required: true,
    },
  },
  {
    virtuals: {
      recommendedBooks: {
        async get() {
          const Book = require("./book");
          return await Book.find({ genres: this.favoriteGenre }).populate(
            "author"
          );
        },
      },
    },
  }
);

module.exports = mongoose.model("User", schema);

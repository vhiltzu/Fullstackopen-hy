const mongoose = require("mongoose");
const Book = require("./book");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minlength: 4,
    },
    born: {
      type: Number,
    },
  },
  {
    virtuals: {
      bookCount: {
        async get() {
          return await Book.find({ author: this.id }).countDocuments();
        },
      },
    },
  }
);

module.exports = mongoose.model("Author", schema);

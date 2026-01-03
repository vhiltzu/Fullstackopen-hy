const mongoose = require("mongoose");
const Book = require("./book");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
  },
  born: {
    type: Number,
  },
});

module.exports = mongoose.model("Author", schema);

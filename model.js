const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
  title: String,
  notes: String,
});

const Todo = mongoose.model("Todo", todoSchema);

let store = {};

module.exports = {
  Todo,
  store,
};

// TODO Schema
// title: String,
// notes: String,


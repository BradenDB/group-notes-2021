const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
  name: String,
  description: String
});

const Todo = mongoose.model("Todo", todoSchema);

let store = {};

module.exports = {
  Todo,
  store,
};

// TODO Schema
// name: String,
// description: String

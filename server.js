// This file is in charge of api endpoints and the
// api server stuff

// import express so you can use it
const express = require("express");
const { store, Todo } = require("./model");
// instantiate your app/server
const app = express();

// tell our app to use json (this is an example of a middleware but this one
// is implemented for us)
app.use(express.json({}));

app.use(cors());

// this is where we will do our own middleware
app.use((req, res, next) => {
  console.log(
    "Time: ",
    Date.now(),
    " - Method: ",
    req.method,
    " - Path: ",
    req.originalUrl,
    " - Body: ",
    req.body
  );
  next();
});

// Get - gets all of the todos (does not have a URL param)
app.get("/todo", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let findQuery = {};

  console.log(req.query);
  if (req.query.name !== null && req.query.name !== undefined) {
    findQuery.name = req.query.name;
  }

  if (
    req.query.afterDeadline !== null &&
    req.query.afterDeadline !== undefined
  ) {
    findQuery.$deadline = { $gt: new ISODate(req.query.afterDeadline) };
  }

  console.log("getting all notes with find query", findQuery);
  // return all of the todos in the store

  Todo.find(findQuery, function (err, todos) {
    // check if there was an error
    if (err) {
      console.log(`there was an error listing notes`, err);
      // send back the error
      res.status(500).json({ message: `unable to list notes`, error: err });
      return;
    }
    // success!!! return all the todos
    res.status(200).json(todos);
  });
});

// Get - gets the todo with the given id
app.get("/todo/:id", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  console.log(`getting note with id: ${req.params.id}`);
  Todo.findById(req.params.id, (err, todo) => {
    // check if there was an error
    if (err) {
      console.log(
        `there was an error finding a note with id ${req.params.id}`,
        err
      );
      // send back the error
      res.status(500).json({
        message: `unable to find note with id ${req.params.id}`,
        error: err,
      });
    } else if (todo === null) {
      console.log(`unable to find note with id ${req.params.id}`);
      res.status(404).json({
        message: `note with id ${req.params.id} not found`,
        error: err,
      });
    } else {
      // success!!!! return the todo
      res.status(200).json(todo);
    }
  });
});

let nextID = 0;

// Post - crates one todo (does not have a URL param)
app.post("/todo", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  console.log(`creating a note with body`, req.body);

  let creatingTodo = {
    name: req.body.name || "",
    description: req.body.description || "",
    done: req.body.done || false,
    deadline: req.body.deadline || new Date(),
  };

  Todo.create(creatingTodo, (err, todo) => {
    // check if there is an error
    if (err) {
      console.log(`unable to create note`);
      res.status(500).json({
        message: "unable to create note",
        error: err,
      });
      return;
    }
    // success!!! return the todo
    res.status(201).json(todo);
  });
});

// Delete - deletes the todo with the given id
app.delete("/todo/:id", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  console.log(`deleting note with id: ${req.params.id}`);

  Todo.findByIdAndDelete(req.params.id, function (err, todo) {
    if (err) {
      console.log(`unable to delete note`);
      res.status(500).json({
        message: "unable to delete note",
        error: err,
      });
      return;
    } else if (todo === null) {
      console.log(`unable to delete note with id ${req.params.id}`);
      res.status(404).json({
        message: `note with id ${req.params.id} not found`,
        error: err,
      });
    } else {
      res.status(200).json(todo);
    }
  });
});

// Patch - updates the todo with the given id
app.patch("/todo/:id", function (req, res) {
  console.log(`updating note with id: ${req.params.id} with body`, req.body);

  let updateTodo = {};
  // name
  if (req.body.name !== null && req.body.name !== undefined) {
    updateTodo.name = req.body.name;
  }
  // description
  if (req.body.description !== null && req.body.description !== undefined) {
    updateTodo.description = req.body.description;
  }
  // deadline
  if (req.body.deadline !== null && req.body.deadline !== undefined) {
    updateTodo.deadline = req.body.deadline;
  }
  // done
  if (req.body.done !== null && req.body.done !== undefined) {
    updateTodo.done = req.body.done;
  }

  Todo.updateOne(
    { _id: req.params.id },
    {
      $set: updateTodo,
    },
    function (err, updateOneResponse) {
      if (err) {
        console.log(`unable to patch note`);
        res.status(500).json({
          message: "unable to patch note",
          error: err,
        });
        return;
      } else if (updateOneResponse.n === 0) {
        console.log(`unable to patch note with id ${req.params.id}`);
        res.status(404).json({
          message: `note with id ${req.params.id} not found`,
          error: err,
        });
      } else {
        res.status(200).json(updateOneResponse);
      }
    }
  );
});

// Put - replaces the todo with the given id`
app.put("/todo/:id", function (req, res) {
  console.log(`replacing note with id: ${req.params.id} with body`, req.body);

  let updateTodo = {
    name: req.body.name || "",
    description: req.body.description || "",
    done: req.body.done || false,
    deadline: req.body.deadline || new Date(),
  };

  Todo.updateOne(
    { _id: req.params.id },
    { $set: { updateTodo } },
    function (err, updateOneResponse) {
      if (err) {
        console.log(`unable to replace note`);
        res.status(500).json({
          message: "unable to replace note",
          error: err,
        });
        return;
      } else if (updateOneResponse.n === 0) {
        console.log(`unable to replace note with id ${req.params.id}`);
        res.status(404).json({
          message: `note with id ${req.params.id} not found`,
          error: err,
        });
      } else {
        res.status(200).json(updateOneResponse);
      }
    }
  );
});

module.exports = app;
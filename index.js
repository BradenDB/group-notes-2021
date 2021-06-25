// This file is in charge of starting the application
const server = require("./server");
const persist = require("./persist");
const fs = require("fs");


// define a port
const portNumber = process.argv[2] || process.env.PORT || 8080;

// connect to the database
persist.connect(function () {
  // start the server
  server.listen(portNumber, () => {
    console.log(`Running Server on Port ${portNumber}`);
  });
});

//test to see if heroku works

// function readFile(filePath, callback) {
//   fs.readFile(filePath, "utf-8", (err, content) => {
//     console.log("content in readFile", content);
//     let counter = 0;
//     callback(counter, content);
//     counter++;
//     callback(counter, content);
//     counter++;
//     callback(counter, content);
//     counter++;
//     callback(counter, content);
//   });
// }

// readFile("myfile.txt", (counter, content) => {
//   console.log(counter, " content in not readfile", content);
// });


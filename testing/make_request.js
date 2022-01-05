#!/usr/bin / env node
// This is a cool alternative to Postman!
// Usually we don't send custom API calls, but rather specific calls to the database.
"use strict";

const http = require("http");
const prompt = require("prompt-sync")({sigint: true});

const typesOfReq = ["POST", "PUT", "DELETE"];
// display the different types of requests available
console.log(typesOfReq);

let reqIndex = prompt("Enter index to perform specific type of request (default = 0 [POST]): ") || 0;

// try to convert to a number
try {
  reqIndex = Number(reqIndex);
} catch(err) {
  reqIndex = null;
  console.error(err);
}

let req_method = null;

// try to find the reqIndex in array, this can throw a index out of range error
// POST request default
try {
  req_method = typesOfReq[reqIndex];
} catch(err) {
  console.error(err);
  req_method = typesOfReq[0];
}

// display the selected type of request
console.log(req_method);

let toDoId = null;

// PUT and DELETE require todo_id
if (req_method != "POST") {
  toDoId = prompt("Enter todo_id: ");
  toDoId = Number(toDoId);
}

let task = null;

// POST and PUT require task description
if (req_method != "DELETE") {
  task = prompt("Enter a task: ");
  task = String(task);
}

let path = "/todos/"

// concat :id @param to the path
if (toDoId !== null) {
  path += String(toDoId);
  path += "/";
}

console.log(`path: ${path} | method: ${req_method}`);

// convert JS object to JSON
const jsonData = JSON.stringify({
  todo_id: toDoId,
  description: task
});

// encodes the JSON string to Unit8Array for transmission
const data = new TextEncoder().encode(jsonData);

// http request options (headers) rfc
const options = {
  hostname: "localhost",
  port: 8080,
  path: path,
  method: req_method,
  headers: {
    "Content-Type": "application/json",
    "Content-Length": data.length
  }
};

// Sends a POST/PUT/DELETE request
const req = http.request(options, (res) => {

  // stdout to terminal, data is in Unit8Array
  // on returning data after POST or PUT req
  res.on("data", data => {
    process.stdout.write(`${data}\n\r`);
  })

  req.on("error", err => {
    console.log("Error caught 🤕")
    console.error(err);
  })

  // Logs status code 200 for success!
  console.log(`StatusCode: ${res.statusCode}`);

});

// Send the Unit8Array data
req.write(data);
req.end();

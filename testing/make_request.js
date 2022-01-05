#!/usr/bin / env node
// This is a cool alternative to Postman!
"use strict";

const http = require("http");
const prompt = require("prompt-sync")({sigint: true});

const typesOfReq = ["POST", "PUT", "DELETE"];
console.log(typesOfReq);

let reqIndex = prompt("Enter index to perform specific type of request (default = 0 [POST]): ") || 0;

let req_method = null;

try {
  req_method = typesOfReq[Number(reqIndex)];
} catch(err) {
  console.error(err);
  req_method = typesOfReq[0];
}

console.log(req_method);

let toDoId = null;

if (req_method != "POST") {
  toDoId = prompt("Enter todo_id: ");
  toDoId = Number(toDoId);
}

let task = null;

if (req_method != "DELETE") {
  task = prompt("Enter a task: ");
  task = String(task);
}

let path = "/todos/"

if (toDoId !== null) {
  path += String(toDoId);
  path += "/";
}

console.log(`path: ${path} | method: ${req_method}`);

// convert obj to json
const jsonData = JSON.stringify({
  todo_id: toDoId,
  description: task
});

// encodes the json string to Unit8Array
const data = new TextEncoder().encode(jsonData);

// http request options (headers)
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

// Send the Unit8Array
req.write(data);
req.end();

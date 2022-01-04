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

let task = prompt("Enter a task: ") || null;

// encodes the json string to binary
const jsonData = JSON.stringify({
  todo_id: null,
  description: (task === null) ? "Null task" : task,
});

const data = new TextEncoder().encode(jsonData);

// http request options (headers)
const options = {
  hostname: "localhost",
  port: 8080,
  path: "/todos/",
  method: String(req_method),
  headers: {
    "Content-Type": "application/json",
    "Content-Length": data.length
  }
};

// Sends a POST/PUT/DELETE request
const req = http.request(options, (res) => {

  // logs status code 200 for success!
  console.log(`StatusCode: ${res.statusCode}`);

  // No clue what this does! Look into it.
  res.on("data", data => {
    process.stdout.write(`${data}\n\r`);
  })

  req.on("error", err => {
    console.error(err);
  })

});

req.write(data);
req.end();

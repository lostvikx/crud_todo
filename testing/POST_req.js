"use strict";

const http = require("http");

let task = null;

// process.stdin.on("data", (data) => {
//   task = data.toString();
//   process.exit();
// });

// encodes the json string to binary
const jsonData = JSON.stringify({
  description: (task === null) ? "Change Dir!" : task,
});

const data = new TextEncoder().encode(jsonData);

// http options (headers)
const options = {
  hostname: "localhost",
  port: 8080,
  path: "/todos",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": data.length
  }
};

// Sends a POST request
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
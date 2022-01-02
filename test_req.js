"use strict";

const http = require("http");

// POST Request
const jsonData = JSON.stringify({
  description: "Buy some bread 🍞",
});

const data = new TextEncoder().encode(jsonData);

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

const req = http.request(options, (res) => {
  // logs status code 200 for success!
  console.log(`StatusCode: ${res.statusCode}`);

  // No clue what this does!
  // res.on("data", d => {
  //   process.stdout.write(d);
  // })

  req.on("error", err => {
    console.error(err);
  })
});

req.write(data);
req.end();
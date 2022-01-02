"use strict";

const http = require("http");
const pool = require("./db.js");

const server = http.createServer((req, res) => {
  const { method, url } = req;
  res.setHeader("Access-Control-Allow-Origin", "*");
  // console.log(req)

  if (method == "GET" && url == "/todos") {
    console.log("Received a GET request!");
  }

  // POST request (create a todo)
  if (method == "POST" && url == "/todos") {
    let data = "";

    req.on("data", chunk => {
      data += chunk;
    });

    req.on("end", () => {
      console.log(JSON.parse(data));

      res.end();
    });
  }

});

server.on("listening", () => console.log(`Listening on http://[${server.address().address}]:${server.address().port} at ${server.address().family}`));

const PORT = 8080;
server.listen(PORT, "localhost");
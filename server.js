// Remember command: sudo -u vik psql
"use strict";

const http = require("http");
const pool = require("./db.js");

const server = http.createServer((req, res) => {
  const { method, url } = req;
  res.setHeader("Access-Control-Allow-Origin", "*");
  // console.log(req)

  // GET request (get all todos)
  if (method == "GET" && url == "/todos") {
    console.log("Received a GET request!");
  }

  // POST request (create a todo)
  if (method == "POST" && url == "/todos") {
    let jsonData = "";

    req.on("data", chunk => {
      jsonData += chunk;
    });

    req.on("end", async () => {
      const data = JSON.parse(jsonData);

      const newTodo = await pool.query("INSERT INTO todo (description) VALUES ($1)", [data["description"]]);

      // res.write(JSON.stringify(newTodo));
      // res.end();
    });
  }

});

server.on("listening", () => console.log(`Listening on http://[${server.address().address}]:${server.address().port} at ${server.address().family}`));

const PORT = 8080;
server.listen(PORT, "localhost");
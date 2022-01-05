// Remember command: sudo -u vik psql
"use strict";

const http = require("http");
const pool = require("./database/db.js");
const URL = require("url");
const { createReadStream } = require("fs");
// const mimeTypes = require("./testing/mimeTypes.js");
// console.log(mimeTypes);

const server = http.createServer((req, res) => {

  const { method, url } = req;
  // Allows all requests!
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (url.slice(url.length - 1) !== "/") {
    res.writeHead(302, {
      "Location": `${url}/`
    });
    res.end();
  }

  // GET request (get all todos)
  if (method == "GET" && url == "/todos/") {

    // console.log("Received a GET request at /todos/");

    // get all the rows in the todo table
    const getAllToDos = async () => {

      const allToDos = await pool.query("SELECT * FROM todo;");

      // response is in json format
      res.setHeader("Content-Type", "application/json");
      res.write(JSON.stringify(allToDos["rows"]));
      res.end();
    }

    // calling the async function
    getAllToDos();
  } 

  // GET request (get specific todo)
  if (method == "GET" && /\/todos\/(\d+)\/$/.test(url)) {
    // console.log("regex works");
    const urlId = url.match(/\/todos\/(\d+)\/$/);

    try {
      const getToDo = async (id) => {
        const toDo = await pool.query("SELECT * FROM todo WHERE todo_id = $1;", [id]);

        // response is in json format
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify(toDo["rows"]));
        res.end();
      }
      
      getToDo(urlId[1]);
    } catch(err) {
      console.error(err);
      res.end();
    }
  }

  // POST request (create a todo)
  if (method == "POST" && url == "/todos/") {
    console.log("POST request at /todos/");
    let jsonData = "";

    req.on("data", chunk => {
      jsonData += chunk;
    });

    req.on("end", async () => {
      const data = JSON.parse(jsonData);

      const newTodo = await pool.query("INSERT INTO todo (description) VALUES ($1) RETURNING *;", [data["description"]]);

      res.setHeader("Content-Type", "application/json");
      res.write(JSON.stringify(newTodo["rows"]));
      res.end();
    });
  }

  // PUT request (update specific todo)
  if (method == "PUT" && /\/todos\/(\d+)\/$/.test(url)) {
    // console.log("PUT request at", url);
    const urlId = url.match(/\/todos\/(\d+)\/$/);
    // console.log(urlId);

    try {
      let jsonData = "";

      req.on("data", chunk => {
        jsonData += chunk;
      });

      req.on("end", async () => {
        const data = JSON.parse(jsonData);
        // console.log([data["description"], urlId[1]]);

        const updateTodo = await pool.query(
          "UPDATE todo SET description = $1 WHERE todo_id = $2;", 
          [data["description"], urlId[1]]
        );

        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify("Todo was updated!"));
        res.end();
      });

    } catch (err) {
      console.error(err);
      res.end();
    }
  }

  // DELETE request
  if (method == "DELETE" && /\/todos\/(\d+)\/$/.test(url)) {

    const urlId = url.match(/\/todos\/(\d+)\/$/);
    
    try {
      const delToDo = async (id) => {
        
        const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1;", [id]);

      }

      delToDo(urlId[1]);

      res.setHeader("Content-Type", "application/json");
      res.write(JSON.stringify("Todo was deleted!"));
      res.end();

    } catch (err) {
      console.error(err);
      res.end();
    }

  }

  if (method == "GET" && /\/todos\/\D+\d*\/$/.test(url)) {

    res.statusCode = 404;
    res.setHeader("Content-Type", "text/html");

    const readStream = createReadStream("./views/404.html");

    readStream.on("error", (err) => {
      res.end(err);
    })

    readStream.on("open", () => {
      readStream.pipe(res);
    });
  }

});

server.on("listening", () => console.log(`Listening on http://[${server.address().address}]:${server.address().port} at ${server.address().family}`));

const PORT = 8080;
server.listen(PORT, "localhost");
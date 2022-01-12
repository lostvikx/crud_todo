CREATE DATABASE learn_restapi

CREATE TABLE todo(
  todo_id SERIAL PRIMARY KEY,
  description VARCHAR(255),
  done boolean
);


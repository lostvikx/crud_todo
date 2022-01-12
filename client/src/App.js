import React, { useEffect, useState } from "react";
import Todo from "./components/Todo";

const App = () => {

  const [todos, setTodos] = useState([]);

  const getTodos = async () => {

    try {
      
      const res = await fetch("http://localhost:8080/todos/");
      const data = await res.json();

      // console.log(data);
      setTodos(data); // gets called everytime the page gets rendered

    } catch (err) {
      console.error(err);
    }

  }

  useEffect(() => {
    getTodos();
  }, []);

  const allTodos = todos.map(todo => {
    return (
      <Todo 
        todo={todo} 
        key={todo.todo_id}
      />
    );
  });

  return (
    <div className="container">
      {allTodos}
    </div>
  );

}

export default App;
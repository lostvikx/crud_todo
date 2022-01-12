import React from "react";

const Todo = (props) => {

  return (
    <div>
      {props.todo.description}
    </div>
  );

}

export default Todo;
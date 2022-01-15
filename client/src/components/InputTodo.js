import React from "react";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    margin: '0 auto',
    transform: 'translate(-50%, -50%)',
  },
};

const addTodo = async (description) => {

  try {
    const res = await fetch("http://localhost:8080/todos/", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        todo_id: null, 
        description: description,
      }),
    });

    const data = await res.json();

    console.log(data);
  } catch (err) {
    console.error(err);
  }

}

Modal.setAppElement(document.getElementById('root'));

const InputTodo = () => {

  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [description, setDescription] = React.useState("");

  const openModal = () => {
    setIsOpen(true);
  }

  const closeModal = () => {
    setIsOpen(false);
  }
  
  const handleUpdateDescription = (event) => {
    setDescription(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(description);
    addTodo(description);
    closeModal();
  }

  return (
    <div>
      <button onClick={openModal}>+</button>
      <Modal 
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        // contentLabel="Test modal"
      >
        <button onClick={closeModal}>&times;</button>
        <div>
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Tasks you wanna complete today!"
              onChange={handleUpdateDescription}
              autoFocus
              name="todo"
            />
            <button type="submit">Add</button>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default InputTodo;
"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [todos, setTodos] = useState([]);
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const [id, setId] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const todo = {
      title,
      description,
      completed,
    };

    try {
      const response = await fetch("http://localhost:8080/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
      });

      if (response.ok) {
        console.log("Todo created successfully");
        // Reset form
        setTitle("");
        setDescription("");
        setCompleted(false);
      } else {
        console.error("Failed to create todo");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const getTodos = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/todos");
        if (response.ok) {
          const data = await response.json();
          setTodos(data);
          console.log(todos);
        } else {
          console.error("Failed to fetch todos");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getTodos();
  }, []);

  const getSpecificTodo = async () => {
    try {
      console.log(id);
      const response = await fetch(`http://localhost:8080/api/todos/${id}`);
      if (response.ok) {
        const todo = await response.json();
        console.log(todo);
      } else {
        console.error("Failed to fetch todo");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div>
        <h2>Todo List</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Completed</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => (
              <tr key={todo.id}>
                <td>{todo.id}</td>
                <td>{todo.title}</td>
                <td>{todo.description}</td>
                <td>{todo.completed ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            className="border rounded-md m-2 p-1"
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter todo title"
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description:</label>
          <input
            className="border rounded-md m-2 p-1"
            type="text"
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter todo description"
            required
          />
        </div>

        <div>
          <label htmlFor="completed">Completed:</label>
          <input
            className="border rounded-md m-2 p-1"
            type="checkbox"
            id="completed"
            name="completed"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
          />
        </div>

        <button
          type="submit"
          className="rounded-md border p-1 m-2 border-blue-300"
        >
          Add Todo
        </button>
        <br />
        <label htmlFor="completed">Id:</label>
        <input
          className="border rounded-md m-2 p-1"
          type="number"
          name="id"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <button
          type="submit"
          className="rounded-md border p-1 m-2 border-blue-300"
          onClick={getSpecificTodo}
        >
          Get specific todo
        </button>
      </form>
    </>
  );
}

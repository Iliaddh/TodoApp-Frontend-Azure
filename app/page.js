"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [todos, setTodos] = useState([]);
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);

  const [id, setId] = useState();
  const [showTodo, setShowTodo] = useState(false);
  const [specificTodo, setSpecificTodo] = useState({});
  const [editMode, setEditMode] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const todo = {
      title,
      description,
      completed,
    };

    try {
      const response = await fetch("https://todoappbackend.azurewebsites.net/api/todos", {
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
        window.location.reload();
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
        const response = await fetch("https://todoappbackend.azurewebsites.net/api/todos");
        if (response.ok) {
          const data = await response.json();
          setTodos(data);
        } else {
          console.error("Failed to fetch todos");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getTodos();
  }, []);

  const getSpecificTodo = async (id) => {
    setShowTodo(true);
    try {
      const response = await fetch(`https://todoappbackend.azurewebsites.net/api/todos/${id}`);
      if (response.ok) {
        setSpecificTodo(await response.json());
      } else {
        console.error("Failed to fetch todo");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    console.log(specificTodo);
  }, [specificTodo]);
  const deleteHandler = async (id) => {
    try {
      const response = await fetch(`https://todoappbackend.azurewebsites.net/api/todos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Todo deleted successfully");
        // Reload todos after deletion
        setTodos(todos.filter((todo) => todo.id !== id));
        window.location.reload();
      } else {
        console.error("Failed to delete todo");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const editModeHandler = () => {
    setEditMode(true);
  };

  const updateHandler = async () => {
    const todo = {
      title,
      description,
      completed,
    };
    try {
      const response = await fetch(
        `https://todoappbackend.azurewebsites.net/api/todos/${specificTodo.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(todo),
        }
      );

      if (response.ok) {
        console.log("Todo updated successfully");
        // Reload todos after deletion
        window.location.reload();
      } else {
        console.error("Failed to delete todo");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="px-4">
      <div className="flex justify-center mt-2 font-bold text-lg border-b-2 py-2  border-blue-300">
        <h2 className="">Todo List</h2>
      </div>
      <div className="flex justify-center">
        <table className="table-fixed justify-center mt-6 border-2">
          <thead className=" justify-center">
            <tr className=" justify-center">
              <th className="p-4">Title</th>
              <th className="p-4">Description</th>
              <th className="p-4">Completed</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className=" justify-center ">
            {todos.length === 0 && (
              <tr className="w-full table-fixed">No todo!</tr>
            )}
            {todos.map((todo) => (
              <tr
                key={todo.id}
                onClick={() => getSpecificTodo(todo.id)}
                className="border-2 hover:bg-blue-200 cursor-pointer transition-colors"
              >
                <td className="p-4">{todo.title}</td>
                <td className="p-4">{todo.description}</td>
                <td className="p-4">{todo.completed ? "Yes 😀" : "No ☹️"} </td>
                <td className="p-4">
                  {!editMode & !showTodo ? (
                    <button
                      className="border border-red-300 p-1 rounded-md hover:bg-red-300"
                      onClick={() => deleteHandler(todo.id)}
                    >
                      ❌
                    </button>
                  ) : (
                    <p>👇</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!showTodo && (
        <form onSubmit={handleSubmit}>
          <div className="">
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

          <button
            type="submit"
            className="rounded-md border p-1 m-2 border-blue-300"
          >
            Add Todo
          </button>
        </form>
      )}

      {showTodo && (
        <tr
          className=" border-yellow-400"
        >
          <td className="p-4 flex">
            {specificTodo.title}{" "}
            <p className="ml-1 cursor-pointer" onClick={editModeHandler}>
              📝
            </p>
          </td>
          <td className="p-4">{specificTodo.description}</td>
          <td className="p-4">
            {specificTodo.completed ? "Yes 😀" : "No ☹️"}{" "}
          </td>
          <td className="p-4">
            <button
              className="border border-red-300 p-1 rounded-md hover:bg-red-300"
              onClick={() => deleteHandler(specificTodo.id)}
            >
              ❌
            </button>{" "}
          </td>
        </tr>
      )}

      {editMode && showTodo && (
        <form onSubmit={updateHandler} className="flex justify-center">
          <div className="">
            <label htmlFor="title">Title:</label>
            <input
              className="border rounded-md m-2 p-1"
              type="text"
              id="title"
              name="title"
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
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter todo description"
              required
            />
          </div>

          <button
            type="submit"
            className="rounded-md border p-1 m-2 border-blue-300"
          >
            Update Todo
          </button>
        </form>
      )}
      <div className="flex justify-center mt-2 font-bold text-lg border-b-2 py-2  border-blue-300"></div>
    </div>
  );
}

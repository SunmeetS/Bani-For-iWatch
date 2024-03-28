import { MenuItem, Select } from "@mui/material";
import React, { useState } from "react";
import { NavigateFunction } from "react-router-dom";
import { todoMap } from "./utils";

type Props = { navigate?: NavigateFunction };

const Todo = ({ navigate }: Props) => {
  const [todo, setTodo] = useState(" ");
  const handleChange = (path, heading) => {
    setTodo(path);
    if (navigate) navigate(path);
    else location.pathname = selectedValue;
  };

  const uniqueTodo = { ...todoMap };
  delete uniqueTodo[window.location.pathname];
  return (
    <>
      {Object.entries(uniqueTodo).map(([path, heading]) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            margin: "1rem",
            padding: "1rem",
            width: "60%",
          }}
          onClick={() => handleChange(path, heading)}
        >
          <h3 className="">{heading}</h3>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ height: 15, width: 15 }}
          >
            <path d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM12 11H8V13H12V16L16 12L12 8V11Z"></path>
          </svg>
        </div>
      ))}
    </>
  );
};

export default Todo;

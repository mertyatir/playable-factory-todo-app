import React from "react";

import { Button } from "@mui/material";

import styles from "./styles.module.css";

import { getToken, getBaseUrl } from "@/utils/utils";

const token = getToken();
const base_url = getBaseUrl();

import { EditDeleteButtonsProps } from "@/types/ComponentProps";

export const EditDeleteButtons: React.FC<EditDeleteButtonsProps> = ({
  todo,
  setTodos,
  todos,
  setEditedId,
  setInputVal,
  setIsEdited,
}) => {
  const handleEdit = (id: number) => {
    const editVal = todos.find((todo) => todo._id === id);
    if (editVal) {
      setEditedId(editVal._id);
      setInputVal(editVal.title);
      setIsEdited(true);
    }
  };

  const onDelete = (_id: number) => {
    fetch(`${base_url}/todos/${_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        const newTodos = todos.filter((todo) => todo._id !== _id);
        setTodos(newTodos);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  return (
    <>
      <Button
        onClick={() => handleEdit(todo._id)}
        variant="contained"
        className={styles.listButtons}
      >
        Edit
      </Button>
      <Button
        onClick={() => onDelete(todo._id)}
        color="secondary"
        variant="contained"
        className={styles.listButtons}
      >
        delete
      </Button>
    </>
  );
};

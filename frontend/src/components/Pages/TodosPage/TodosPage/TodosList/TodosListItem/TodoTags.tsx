import React from "react";
import { Button, Chip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import styles from "./styles.module.css";

import { getToken, getBaseUrl } from "@/utils/utils";

import { TodoTagsProps } from "@/types/ComponentProps";

const token = getToken();
const base_url = getBaseUrl();

export const TodoTags: React.FC<TodoTagsProps> = ({
  todo,
  setCurrentTodoId,
  setDialogOpen,
  setTodos,
}) => {
  const handleTagDelete = (tag: string, todoId: number) => {
    fetch(`${base_url}/todos/${todoId}/removeTag`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ tag }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo._id === todoId
              ? { ...todo, tags: todo.tags.filter((t) => t !== tag) }
              : todo
          )
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  return (
    <>
      <div className={styles.tag}>
        {todo.tags.map((tag, index) => (
          <Chip
            key={index}
            label={tag}
            variant="outlined"
            onDelete={() => handleTagDelete(tag, todo._id)}
          />
        ))}
      </div>
      <Button
        className={styles.addTagButton}
        color="primary"
        onClick={() => {
          setCurrentTodoId(todo._id);
          setDialogOpen(true);
        }}
      >
        <AddIcon />
      </Button>
    </>
  );
};

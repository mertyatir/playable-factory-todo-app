import React from "react";
import { Checkbox, ListItem, Typography } from "@mui/material";

import styles from "./styles.module.css";

import { TodosListItemProps } from "@/types/ComponentProps";

import { getToken, getBaseUrl } from "@/utils/utils";
import { TodoImageUpload } from "./TodosListItem/TodoImageUpload";
import { TodoTags } from "./TodosListItem/TodoTags";
import { TodoFileUpload } from "./TodosListItem/TodoFileUpload";
import { AddTagDialog } from "./TodosListItem/AddTagDialog";
import { EditDeleteButtons } from "./TodosListItem/EditDeleteButtons";

const token = getToken();
const base_url = getBaseUrl();

export const TodosListItem: React.FC<TodosListItemProps> = ({
  todo,
  dialogOpen,
  setDialogOpen,
  setTagsInput,
  setCurrentTodoId,
  setTodos,
  setEditedId,
  setInputVal,
  setIsEdited,
  tagsInput,
  currentTodoId,
  todos,
}) => {
  const handleDone = (_id: number) => {
    const todo = todos.find((todo) => todo._id === _id);
    if (todo) {
      const updatedTodo = { ...todo, completed: !todo.completed };
      fetch(`${base_url}/todos/${_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: updatedTodo.completed }),
      })
        .then((response) => response.json())
        .then((updatedTodo) => {
          // Find the old todo item in the state
          const oldTodo = todos.find((todo) => todo._id === _id);

          if (oldTodo) {
            // Preserve the imageUrl property
            updatedTodo.imageUrl = oldTodo.imageUrl;
          }

          // Update the state with the updated todo item
          setTodos(
            todos.map((todo) => (todo._id === _id ? updatedTodo : todo))
          );
        });
    }
  };

  const handleAddTag = (todoId: number) => {
    if (currentTodoId === null) return;

    const tag = tagsInput;

    fetch(`${base_url}/todos/${currentTodoId}/addTag`, {
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
            todo._id === currentTodoId
              ? { ...todo, tags: [...todo.tags, tag] }
              : todo
          )
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setDialogOpen(false);
  };
  return (
    <ListItem key={todo._id} className={styles.list}>
      <TodoImageUpload setTodos={setTodos} todo={todo} />
      <Checkbox onClick={() => handleDone(todo._id)} checked={todo.completed} />
      <Typography
        className={styles.text}
        style={{ color: todo.completed ? "green" : "" }}
        key={todo._id}
      >
        {todo.title}
      </Typography>

      <TodoTags
        todo={todo}
        setCurrentTodoId={setCurrentTodoId}
        setDialogOpen={setDialogOpen}
        setTodos={setTodos}
      />

      <TodoFileUpload setTodos={setTodos} todo={todo} />

      <AddTagDialog
        todo={todo}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        setTagsInput={setTagsInput}
        handleAddTag={handleAddTag}
      />

      <EditDeleteButtons
        todo={todo}
        setTodos={setTodos}
        todos={todos}
        setEditedId={setEditedId}
        setInputVal={setInputVal}
        setIsEdited={setIsEdited}
      />
    </ListItem>
  );
};

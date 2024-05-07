"use client";

import {
  TextField,
  Button,
  Typography,
  Checkbox,
  List,
  ListItem,
  Container,
} from "@mui/material";
import { useState } from "react";
import styles from "./styles.module.css";

export default function TodoList() {
  const [inputVal, setInputVal] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isEdited, setIsEdited] = useState(false);
  const [editedId, setEditedId] = useState<number | null>(null);

  type Todo = {
    val: string;
    isDone: boolean;
    id: number;
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
  };

  const handleClick = () => {
    if (!isEdited) {
      setTodos([
        ...todos,
        { val: inputVal, isDone: false, id: new Date().getTime() },
      ]);
    } else {
      if (editedId !== null) {
        setTodos([...todos, { val: inputVal, isDone: false, id: editedId }]);
      }
    }
    setInputVal("");
    setIsEdited(false);
  };

  const onDelete = (id: number) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
  };

  const handleDone = (id: number) => {
    const updated = todos.map((todo) => {
      if (todo.id === id) {
        todo.isDone = !todo.isDone;
      }
      return todo;
    });
    setTodos(updated);
  };

  const handleEdit = (id: number) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    const editVal = todos.find((todo) => todo.id === id);
    if (editVal) {
      setEditedId(editVal.id);
      setInputVal(editVal.val);
      setTodos(newTodos);
      setIsEdited(true);
    }
  };

  return (
    <Container component="main" className={styles.container}>
      <TextField
        variant="outlined"
        onChange={onChange}
        label="type your task"
        value={inputVal}
        className={styles.input}
      ></TextField>

      <Button
        size="large"
        variant={isEdited ? "outlined" : "contained"}
        color="primary"
        onClick={handleClick}
        disabled={inputVal ? false : true}
        className={styles.addButton}
      >
        {isEdited ? "Edit Task" : "Add Task"}
      </Button>
      <List>
        {todos.map((todo) => {
          return (
            <>
              <ListItem className={styles.list}>
                <Checkbox
                  onClick={() => handleDone(todo.id)}
                  checked={todo.isDone}
                />
                <Typography
                  className={styles.text}
                  style={{ color: todo.isDone ? "green" : "" }}
                  key={todo.id}
                >
                  {todo.val}
                </Typography>
                <Button
                  onClick={() => handleEdit(todo.id)}
                  variant="contained"
                  className={styles.listButtons}
                >
                  Edit
                </Button>
                <Button
                  onClick={() => onDelete(todo.id)}
                  color="secondary"
                  variant="contained"
                  className={styles.listButtons}
                >
                  delete
                </Button>
              </ListItem>
            </>
          );
        })}
      </List>
    </Container>
  );
}

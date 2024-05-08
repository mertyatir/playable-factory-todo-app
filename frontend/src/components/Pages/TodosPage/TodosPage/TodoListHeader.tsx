import { useState } from "react";

import { Box, Button, MenuItem, Select, TextField } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

import styles from "./styles.module.css";

import { Todo } from "@/types/Todo";

import { getToken, getBaseUrl } from "@/utils/utils";

const token = getToken();
const base_url = getBaseUrl();

type TodoListHeaderProps = {
  selectedTag: string | null;
  setSelectedTag: React.Dispatch<React.SetStateAction<string | null>>;
  inputVal: string;
  setInputVal: React.Dispatch<React.SetStateAction<string>>;
  isEdited: boolean;
  setIsEdited: React.Dispatch<React.SetStateAction<boolean>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  tags: string[];
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  editedId: number | null;
};

export const TodosListHeader: React.FC<TodoListHeaderProps> = ({
  selectedTag,
  setSelectedTag,
  inputVal,
  setInputVal,
  isEdited,
  setIsEdited,
  search,
  setSearch,
  tags,
  todos,
  setTodos,
  editedId,
}) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
  };

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleTagChange = (event: SelectChangeEvent<string | null>) => {
    setSelectedTag(event.target.value as string);
  };

  const handleClick = () => {
    const todo = {
      title: inputVal,
      completed: false,
      image: "",
      file: "",
      tags: [],
    };
    const method = isEdited ? "PUT" : "POST";
    const url = isEdited
      ? `${base_url}/todos/${editedId}`
      : `${base_url}/todos`;

    const bodyContent = method === "PUT" ? { title: todo.title } : todo;

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyContent),
    })
      .then((response) => response.json())
      .then((data) => {
        setTodos((prevTodos) => {
          if (isEdited) {
            return prevTodos.map((t) => (t._id === data._id ? data : t));
          } else {
            return [...prevTodos, data];
          }
        });
        setInputVal("");
        setIsEdited(false);
      });
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Box sx={{ justifyContent: "flex-start" }}>
        <TextField
          variant="outlined"
          onChange={onChange}
          label="Type your task"
          value={inputVal}
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
      </Box>

      <Box>
        <TextField
          variant="outlined"
          onChange={onSearchChange}
          label="Search tasks"
          value={search}
        ></TextField>

        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedTag}
          onChange={handleTagChange}
        >
          <MenuItem value="all">All</MenuItem>
          {tags.map((tag, index) => (
            <MenuItem key={index} value={tag}>
              {tag}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </Box>
  );
};

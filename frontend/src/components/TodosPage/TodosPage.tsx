"use client";

import {
  TextField,
  Button,
  Typography,
  Checkbox,
  List,
  ListItem,
  Container,
  Chip,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { SelectChangeEvent } from "@mui/material/Select";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";

import { getCookie } from "cookies-next";

import { useDebounce } from "use-debounce";

import Image from "next/image";

type Todo = {
  _id: number;
  title: string;
  completed: boolean;
  image: string;
  file: string;
  tags: string[];
};

export default function TodoList() {
  const [inputVal, setInputVal] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isEdited, setIsEdited] = useState(false);
  const [editedId, setEditedId] = useState<number | null>(null);

  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagsInput, setTagsInput] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [debouncedSearch] = useDebounce(search, 300);

  const [currentTodoId, setCurrentTodoId] = useState<number | null>(null);

  const token = getCookie("token");
  const base_url = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    fetch(`${base_url}/todos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTodos(data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (debouncedSearch) {
      fetch(`${base_url}/todos/search?q=${debouncedSearch}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setFilteredTodos(data))
        .catch((error) => console.error("Error:", error));
    } else {
      setFilteredTodos(todos);
    }
  }, [debouncedSearch, todos, token, base_url]);

  useEffect(() => {
    const allTags = todos.reduce((tags: string[], todo: Todo) => {
      return [...tags, ...todo.tags];
    }, []);

    const uniqueTags = Array.from(new Set(allTags));
    setTags(uniqueTags);
  }, [todos]);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
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

  const handleTagChange = (event: SelectChangeEvent<string | null>) => {
    setSelectedTag(event.target.value as string);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
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
        .then((data) => {
          setTodos(todos.map((todo) => (todo._id === data._id ? data : todo)));
        });
    }
  };

  const handleEdit = (id: number) => {
    const editVal = todos.find((todo) => todo._id === id);
    if (editVal) {
      setEditedId(editVal._id);
      setInputVal(editVal.title);
      setIsEdited(true);
    }
  };

  return (
    <Container component="main" className={styles.container}>
      <TextField
        variant="outlined"
        onChange={onChange}
        label="Type your task"
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
      <TextField
        variant="outlined"
        onChange={onSearchChange}
        label="Search tasks"
        value={search}
        className={styles.searchInput}
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
      <List>
        {filteredTodos
          .filter((todo) =>
            selectedTag === "all"
              ? true
              : selectedTag
              ? todo.tags.includes(selectedTag)
              : false
          )
          .map((todo) => {
            return (
              <ListItem key={todo._id} className={styles.list}>
                <Checkbox
                  onClick={() => handleDone(todo._id)}
                  checked={todo.completed}
                />
                <Typography
                  className={styles.text}
                  style={{ color: todo.completed ? "green" : "" }}
                  key={todo._id}
                >
                  {todo.title}
                </Typography>
                <Fab
                  color="primary"
                  aria-label="add"
                  onClick={() => {
                    setCurrentTodoId(todo._id);
                    setDialogOpen(true);
                  }}
                >
                  <AddIcon />
                </Fab>
                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                  <DialogTitle>Add Tag</DialogTitle>
                  <DialogContent>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="tag"
                      label="Tag"
                      type="text"
                      fullWidth
                      onChange={(e) => setTagsInput(e.target.value)}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => setDialogOpen(false)}
                      color="primary"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleAddTag(todo._id)}
                      color="primary"
                    >
                      Add
                    </Button>
                  </DialogActions>
                </Dialog>

                {todo.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    variant="outlined"
                    onDelete={() => handleTagDelete(tag, todo._id)}
                  />
                ))}
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
              </ListItem>
            );
          })}
      </List>
    </Container>
  );
}

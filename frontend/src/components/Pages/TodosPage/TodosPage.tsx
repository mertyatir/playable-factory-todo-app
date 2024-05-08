"use client";

import { Container } from "@mui/material";

import { useEffect, useState } from "react";
import styles from "./styles.module.css";

import { useDebounce } from "use-debounce";

import { TodosListHeader } from "@/components/Pages/TodosPage/TodosPage/TodoListHeader";
import { TodosList } from "@/components/Pages/TodosPage/TodosPage/TodosList";

import { Todo } from "@/types/Todo";

import { getToken, getBaseUrl } from "@/utils/utils";

const token = getToken();
const base_url = getBaseUrl();

export default function ToDoPage() {
  const [inputVal, setInputVal] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isEdited, setIsEdited] = useState(false);
  const [editedId, setEditedId] = useState<number | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagsInput, setTagsInput] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [debouncedSearch] = useDebounce(search, 300);
  const [currentTodoId, setCurrentTodoId] = useState<number | null>(null);

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
        const promises = data.map((todo: Todo) => {
          if (todo.image) {
            return fetch(
              `${base_url}/todos/${todo._id}/download/image`,

              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
              .then((response) => response.blob())
              .then((blob) => {
                const url = URL.createObjectURL(blob);
                return { ...todo, imageUrl: url };
              });
          } else {
            return Promise.resolve(todo);
          }
        });

        Promise.all(promises).then((todosWithImages) => {
          setTodos(todosWithImages);
        });
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
        .then((data) => {
          const promises = data.map((todo: Todo) => {
            if (todo.image) {
              return fetch(`${base_url}/todos/${todo._id}/download/image`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
                .then((response) => response.blob())
                .then((blob) => {
                  const url = URL.createObjectURL(blob);
                  return { ...todo, imageUrl: url };
                });
            } else {
              return Promise.resolve(todo);
            }
          });

          Promise.all(promises).then((todosWithImages) => {
            setFilteredTodos(todosWithImages);
          });
        })
        .catch((error) => console.error("Error:", error));
    } else {
      setFilteredTodos(todos);
    }
  }, [debouncedSearch, todos]);

  useEffect(() => {
    const allTags = todos.reduce((tags: string[], todo: Todo) => {
      return [...tags, ...todo.tags];
    }, []);

    const uniqueTags = Array.from(new Set(allTags));
    setTags(uniqueTags);
  }, [todos]);

  return (
    <Container component="main" className={styles.container}>
      <TodosListHeader
        tags={tags}
        todos={todos}
        setTodos={setTodos}
        editedId={editedId}
        search={search}
        setSearch={setSearch}
        inputVal={inputVal}
        setInputVal={setInputVal}
        isEdited={isEdited}
        setIsEdited={setIsEdited}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
      />
      <TodosList
        todos={filteredTodos}
        setTodos={setTodos}
        setEditedId={setEditedId}
        currentTodoId={currentTodoId}
        setCurrentTodoId={setCurrentTodoId}
        tagsInput={tagsInput}
        setTagsInput={setTagsInput}
        selectedTag={selectedTag}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        setInputVal={setInputVal}
        setIsEdited={setIsEdited}
        filteredTodos={filteredTodos}
      />
    </Container>
  );
}

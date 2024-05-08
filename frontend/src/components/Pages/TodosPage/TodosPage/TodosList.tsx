import React, { useState } from "react";
import { List } from "@mui/material";

import { TodosListItem } from "@/components/Pages/TodosPage/TodosPage/TodosList/TodosListItem";
import { TodosListProps } from "@/types/ComponentProps";

export const TodosList: React.FC<TodosListProps> = ({
  todos,
  setTodos,
  setIsEdited,
  setEditedId,
  tagsInput,
  setTagsInput,
  selectedTag,
  dialogOpen,
  setDialogOpen,
  filteredTodos,
  currentTodoId,
  setCurrentTodoId,
  setInputVal,
}) => {
  return (
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
            <TodosListItem
              key={todo._id}
              todo={todo}
              setCurrentTodoId={setCurrentTodoId}
              setDialogOpen={setDialogOpen}
              setTagsInput={setTagsInput}
              dialogOpen={dialogOpen}
              setTodos={setTodos}
              todos={todos}
              setEditedId={setEditedId}
              setInputVal={setInputVal}
              setIsEdited={setIsEdited}
              tagsInput={tagsInput}
              currentTodoId={currentTodoId}
            />
          );
        })}
    </List>
  );
};

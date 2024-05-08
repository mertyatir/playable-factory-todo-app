import { Todo } from "./Todo";

export type TodosListProps = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setIsEdited: React.Dispatch<React.SetStateAction<boolean>>;
  setEditedId: React.Dispatch<React.SetStateAction<number | null>>;
  tagsInput: string;
  setTagsInput: React.Dispatch<React.SetStateAction<string>>;
  selectedTag: string | null;
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  filteredTodos: Todo[];
  currentTodoId: number | null;
  setCurrentTodoId: React.Dispatch<React.SetStateAction<number | null>>;
  setInputVal: React.Dispatch<React.SetStateAction<string>>;
};

export type TodosListItemProps = {
  todo: Todo;
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTagsInput: React.Dispatch<React.SetStateAction<string>>;
  setCurrentTodoId: (id: number) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setEditedId: React.Dispatch<React.SetStateAction<number | null>>;
  setInputVal: React.Dispatch<React.SetStateAction<string>>;
  setIsEdited: React.Dispatch<React.SetStateAction<boolean>>;
  tagsInput: string;
  currentTodoId: number | null;
  todos: Todo[];
};

export type TodoImageUploadProps = {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  todo: Todo;
};

export type TodoTagsProps = {
  todo: Todo;
  setCurrentTodoId: (id: number) => void;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export type TodoFileUploadProps = {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  todo: Todo;
};

export type AddTagDialogProps = {
  todo: Todo;
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTagsInput: React.Dispatch<React.SetStateAction<string>>;
  handleAddTag: (todoId: number) => void;
};

export type EditDeleteButtonsProps = {
  todo: Todo;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  todos: Todo[];
  setEditedId: React.Dispatch<React.SetStateAction<number | null>>;
  setInputVal: React.Dispatch<React.SetStateAction<string>>;
  setIsEdited: React.Dispatch<React.SetStateAction<boolean>>;
};

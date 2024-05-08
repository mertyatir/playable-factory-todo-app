import React from "react";

import { getToken, getBaseUrl } from "@/utils/utils";

import { TodoFileUploadProps } from "@/types/ComponentProps";

const token = getToken();
const base_url = getBaseUrl();

export const TodoFileUpload: React.FC<TodoFileUploadProps> = ({
  setTodos,
  todo,
}) => {
  const handleFileUpload = (id: number) => async (e: any) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    fetch(`${base_url}/todos/${id}/file`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo._id === id ? { ...todo, file: data.url } : todo
          )
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleFileDownload = (id: number) => {
    fetch(`${base_url}/todos/${id}/download/file`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "file";
        a.click();
      });
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload(todo._id)} />
      {todo.file && (
        <button onClick={() => handleFileDownload(todo._id)}>Download</button>
      )}
    </div>
  );
};

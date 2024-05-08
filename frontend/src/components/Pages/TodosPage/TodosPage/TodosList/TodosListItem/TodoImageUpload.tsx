import React from "react";
import Image from "next/image";
import { Avatar } from "@mui/material";
import { getToken, getBaseUrl } from "@/utils/utils";
import styles from "./styles.module.css";
import { TodoImageUploadProps } from "@/types/ComponentProps";

const token = getToken();
const base_url = getBaseUrl();

export const TodoImageUpload: React.FC<TodoImageUploadProps> = ({
  setTodos,
  todo,
}) => {
  const handleImageUpload = (id: number) => async (e: any) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    fetch(`${base_url}/todos/${id}/image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then(async (data) => {
        // Fetch the image as a blob
        const response = await fetch(`${base_url}/todos/${id}/download/image`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const blob = await response.blob();
        // Create an object URL from the blob
        const url = URL.createObjectURL(blob);
        // Set this URL as the imageUrl property of the todo
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo._id === id ? { ...todo, imageUrl: url } : todo
          )
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  return (
    <label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageUpload(todo._id)(e)}
        style={{ display: "none" }}
      />
      {todo.imageUrl ? (
        <Image
          className={styles.avatar}
          src={todo.imageUrl}
          alt="Todo image"
          width={100}
          height={100}
        />
      ) : (
        <Avatar className={styles.avatar} variant="square" />
      )}
    </label>
  );
};

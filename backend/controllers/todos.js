import Todo from "../models/Todo.js";

import path from "path";

const getAllTodos = async (req, res) => {
  const todos = await Todo.getAllTodos(req.user.userId).catch((error) => {
    return res.status(400).json({ message: error.message });
  });
  res.json(todos);
};

const createTodo = async (req, res) => {
  const todo = await Todo.createTodo(req.user.userId, req.body.title).catch(
    (error) => {
      return res.status(400).json({ message: error.message });
    }
  );

  res.status(201).json(todo);
};

const getTodoById = async (req, res) => {
  if (req.params.id === "null") {
    return res.status(400).json({ message: "Invalid id" });
  }
  const todo = await Todo.getTodoById(req.params.id, req.user.userId).catch(
    (error) => {
      return res.status(400).json({ message: error.message });
    }
  );

  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }
  res.json(todo);
};

const updateTodo = async (req, res) => {
  // allowed updates to fields
  const updates = {
    title: req.body.title,
    completed: req.body.completed,
    tags: req.body.tags,
  };
  // if unallowed fields are sent in the request body we want to return an error
  const allowedUpdates = Object.keys(updates);
  const isValidOperation = Object.keys(req.body).every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).json({ message: "Invalid updates" });
  }

  const todo = await Todo.updateTodo(
    req.params.id,
    req.user.userId,
    updates
  ).catch((error) => {
    return res.status(400).json({ message: error.message });
  });

  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  res.json(todo);
};

const deleteTodo = async (req, res) => {
  const todo = await Todo.deleteTodo(req.params.id, req.user.userId).catch(
    (error) => {
      return res.status(400).json({ message: error.message });
    }
  );

  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }
  try {
    res.json(todo);
  } catch (error) {
    console.log(error);
  }
};

const uploadImage = async (req, res) => {
  // Check if the uploaded file is an image
  if (!req.file.mimetype.startsWith("image/")) {
    return res
      .status(400)
      .json({ message: "Invalid file type. Only images are allowed." });
  }

  const todo = await Todo.uploadImage(
    req.params.id,
    req.user.userId,
    req.file.path
  ).catch((error) => {
    return res.status(400).json({ message: error.message });
  });

  try {
    res.json(todo);
  } catch (error) {
    console.log(error);
  }
};

const uploadFile = async (req, res) => {
  const todo = await Todo.uploadFile(
    req.params.id,
    req.user.userId,
    req.file.path
  ).catch((error) => {
    return res.status(400).json({ message: error.message });
  });
  res.json(todo);
};

const getTodosByTag = async (req, res) => {
  if (!req.body.tags) {
    return res
      .status(400)
      .json({ message: "No tags provided in the request body" });
  }

  const todos = await Todo.getTodosByTag(req.body.tags, req.user.userId).catch(
    (error) => {
      return res.status(400).json({ message: error.message });
    }
  );
  res.json(todos);
};

// Add a tag to a specific ToDo item
const addTag = async (req, res) => {
  // Check if the tag is provided in the request body
  if (!req.body.tag) {
    return res.status(400).json({ message: "No tag provided in the request" });
  }
  const todo = await Todo.addTag(req.params.id, req.user.userId, req.body.tag);
  res.json(todo);
};

// Remove a tag from a specific ToDo item
const removeTag = async (req, res) => {
  // Check if the tag is provided in the request body
  if (!req.body.tag) {
    return res.status(400).json({ message: "No tag provided in the request" });
  }
  const todo = await Todo.removeTag(
    req.params.id,
    req.user.userId,
    req.body.tag
  );
  res.json(todo);
};

const searchTodos = async (req, res) => {
  const todos = await Todo.searchTodos(req.query.q, req.user.userId);
  res.json(todos);
};

const downloadFile = async (req, res) => {
  if (req.params.id === "null") {
    return res.status(400).json({ message: "Invalid id" });
  }
  const filePath = await Todo.downloadFile(
    req.params.id,
    req.user.userId
  ).catch((error) => {
    return res.status(404).json({ message: error.message });
  });

  // Set the headers to instruct the browser to download the file
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${path.basename(filePath)}`
  );
  res.setHeader("Content-Transfer-Encoding", "binary");
  res.setHeader("Content-Type", "application/octet-stream");

  // Send the file as a response
  res.download(filePath);
};

const downloadImage = async (req, res) => {
  if (req.params.id === "null") {
    return res.status(400).json({ message: "Invalid id" });
  }
  const filePath = await Todo.downloadImage(
    req.params.id,
    req.user.userId
  ).catch((error) => {
    return res.status(404).json({ message: error.message });
  });

  // Set the headers to instruct the browser to download the file
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${path.basename(filePath)}`
  );
  res.setHeader("Content-Transfer-Encoding", "binary");
  res.setHeader("Content-Type", "application/octet-stream");

  // Send the file as a response
  res.download(filePath);
};

export default {
  getAllTodos,
  createTodo,
  getTodoById,
  updateTodo,
  deleteTodo,
  uploadImage,
  uploadFile,
  getTodosByTag,
  addTag,
  removeTag,
  searchTodos,
  downloadFile,
  downloadImage,
};

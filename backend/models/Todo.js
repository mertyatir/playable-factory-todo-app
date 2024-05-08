import mongoose from "mongoose";
import fs from "fs";
import util from "util";
import path from "path";

const unlink = util.promisify(fs.unlink);

const todoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
    },
    file: {
      type: String,
    },
    tags: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const Todo = mongoose.model("Todo", todoSchema);

const getAllTodos = async (userId) => {
  const todos = await Todo.find({ user: userId });
  return todos;
};

const createTodo = async (user, title) => {
  // check if the body of the request contains a title
  if (!title) {
    throw new Error("Title is required");
  }

  const todo = new Todo({
    user,
    title,
  });

  await todo.save();
  return todo;
};

const getTodoById = async (id, user) => {
  const todo = await Todo.findOne({ _id: id, user });
  return todo;
};

const updateTodo = async (id, user, data) => {
  const todo = await Todo.findOneAndUpdate({ _id: id, user }, data, {
    new: true,
  });
  return todo;
};

const deleteTodo = async (id, user) => {
  let todo = await Todo.findOne({ _id: id, user });
  if (!todo) {
    throw new Error("Todo not found");
  }

  try {
    // Delete the image and file if they exist
    if (todo.image) {
      const imagePath = path.resolve(todo.image);
      await unlink(imagePath);
    }
    if (todo.file) {
      const filePath = path.resolve(todo.file);
      await unlink(filePath);
    }
  } catch (error) {
    console.log(error);
  }

  todo = await Todo.findOneAndDelete({ _id: id, user });
  return todo;
};

const uploadImage = async (id, user, imagePath) => {
  let todo = await Todo.findOne({ _id: id, user });
  if (!todo) {
    throw new Error("Todo not found");
  }
  // Delete the image if it exists before updating the new image
  if (todo.image) {
    const imagePath = path.resolve(todo.image);
    await unlink(imagePath);
  }
  todo = await Todo.findOneAndUpdate(
    { _id: id, user },
    { image: imagePath },
    { new: true }
  );
  return todo;
};

const uploadFile = async (id, user, filePath) => {
  let todo = await Todo.findOne({ _id: id, user });
  if (!todo) {
    throw new Error("Todo not found");
  }

  // Delete the file if it exists before updating the new file
  if (todo.file) {
    const filePath = path.resolve(todo.file);
    await unlink(filePath);
  }

  todo = await Todo.findOneAndUpdate(
    { _id: id, user },
    { file: filePath },
    { new: true }
  );
  return todo;
};

const getTodosByTag = async (tags, user) => {
  const todos = await Todo.find({ tags: { $in: tags }, user });
  return todos;
};

// Add a tag to a specific ToDo item
const addTag = async (id, user, tag) => {
  const todo = await Todo.findOne({ _id: id, user });
  if (!todo) {
    throw new Error("Todo not found");
  }
  if (!todo.tags.includes(tag)) {
    todo.tags.push(tag);
    await todo.save();
  }
  return todo;
};

// Remove a tag from a specific ToDo item
const removeTag = async (id, user, tag) => {
  const todo = await Todo.findOne({ _id: id, user }).catch((error) => {
    throw new Error(error.message);
  });
  if (!todo) {
    throw new Error("Todo not found");
  }
  if (todo.tags.includes(tag)) {
    todo.tags = todo.tags.filter((t) => t !== tag);
    await todo.save();
  }
  return todo;
};

// Search todos
const searchTodos = async (query, user) => {
  const regex = new RegExp(query, "i"); // 'i' makes it case insensitive
  const todos = await Todo.find({
    user,
    $or: [{ title: regex }, { tags: regex }],
  });
  return todos;
};

const downloadFile = async (id, userId) => {
  const todo = await Todo.findOne({
    _id: id,
    user: userId,
  });
  if (!todo || !todo.file) {
    throw new Error("File not found");
  }
  const filePath = path.resolve(todo.file);
  return filePath;
};

const downloadImage = async (id, userId) => {
  const todo = await Todo.findOne({
    _id: id,
    user: userId,
  });
  if (!todo || !todo.image) {
    throw new Error("File not found");
  }
  const filePath = path.resolve(todo.image);
  return filePath;
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

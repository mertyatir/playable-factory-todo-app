import express from "express";
import controllers from "../controllers/index.js";
import authenticate from "../middlewares/authenticate.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const router = express.Router();

// Get all ToDo items for the authenticated user
router.get("/", authenticate, controllers.todos.getAllTodos);

// Create a new ToDo item for the authenticated user
router.post("/", authenticate, controllers.todos.createTodo);

// Get all ToDo items for specific tags
router.get("/tag", authenticate, controllers.todos.getTodosByTag);

// Search todos
router.get("/search", authenticate, controllers.todos.searchTodos);

// Get a specific ToDo item by its ID
router.get("/:id", authenticate, controllers.todos.getTodoById);

// Update a specific ToDo item by its ID
router.put("/:id", authenticate, controllers.todos.updateTodo);

// Delete a specific ToDo item by its ID
router.delete("/:id", authenticate, controllers.todos.deleteTodo);

// Upload an image for a specific ToDo item by its ID
router.post(
  "/:id/image",
  authenticate,
  upload.single("image"),
  controllers.todos.uploadImage
);

// Upload a file for a specific ToDo item by its ID
router.post(
  "/:id/file",
  authenticate,
  upload.single("file"),
  controllers.todos.uploadFile
);

// Add a tag to a specific ToDo item by its ID
router.put("/:id/addTag", authenticate, controllers.todos.addTag);

// Remove a tag from a specific ToDo item by its ID
router.put("/:id/removeTag", authenticate, controllers.todos.removeTag);

export default router;

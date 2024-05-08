import express from "express";
import controllers from "../controllers/index.js";
const router = express.Router();

router.post("/register", controllers.auth.register);
router.post("/login", controllers.auth.login);

export default router;

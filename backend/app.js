import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import routes from "./routes/index.js";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 7000;
const MONGOURL = process.env.MONGO_URL;

mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.log("Error occurred while connecting to database", error);
  });

app.use("/auth", routes.auth);
app.use("/todos", routes.todos);

app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running,  and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});

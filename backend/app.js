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

//enable CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
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

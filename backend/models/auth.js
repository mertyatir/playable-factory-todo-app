import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Schema for the user
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 12);
});

const User = mongoose.model("User", userSchema);

const register = async (email, password) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const user = new User({ email, password });
  await user.save();

  // Generate a JWT
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return { token };
};

const login = async (email, password) => {
  // Find the user
  const user = await User.findOne({ email });

  // If the user doesn't exist, throw an error
  if (!user) {
    throw new Error("User not found");
  }

  // Compare the passwords
  const isMatch = await bcrypt.compare(password, user.password);

  // If the passwords don't match, throw an error
  if (!isMatch) {
    throw new Error("Invalid password");
  }

  // Generate a JWT
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return { token };
};

export default { register, login };

import Auth from "../models/auth.js";

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Auth.register(email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Auth.login(email, password);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  register,
  login,
};

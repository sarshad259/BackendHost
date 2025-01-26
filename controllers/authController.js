const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

// Register User
const registerUser = async (req, res) => {
  const { name, email, password, cnic } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      cnic,
    });

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      cnic: user.cnic,
      token: generateToken(user.id, process.env.JWT_SECRET),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if ((!email, !password)) {
    return res.send({ message: "email and password is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      cnic: user.cnic,
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Validation schema using Joi
const validateUser = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    cnic: Joi.string().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

module.exports = { registerUser, loginUser, validateUser };

//

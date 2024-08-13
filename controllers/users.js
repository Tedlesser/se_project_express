const User = require("../models/user");
const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !password) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: ERROR_MESSAGES.BAD_REQUEST });
  }

  if (!emailRegex.test(email)) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: "Invalid email format" });
  }

  try {
    // Check for existing user via email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(ERROR_CODES.EMAIL_EXISTS)
        .send({ message: `${ERROR_MESSAGES.EMAIL_EXISTS}` });
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create the user with hashed password
    const newUser = await User.create({
      name,
      avatar,
      email,
      password: hashPassword,
    });
    console.log(newUser);
    return res.status(201).send({ name, avatar, email });
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .send({ message: ERROR_MESSAGES.BAD_REQUEST });
    }
    // Handle MondoDB duplicate error
    if (err.code === 11000) {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .send({ message: ERROR_MESSAGES.BAD_REQUEST });
    }
    // Handle server error
    return res
      .status(ERROR_CODES.SERVER_ERROR)
      .send({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

const getCurrentUser = (req, res) => {
  // the id comes from req.user._id
  const userId = req.user._id;
  console.log(userId);
  User.findById(userId)
    .select("-password")
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.BAD_REQUEST });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: ERROR_MESSAGES.NOT_FOUND });
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: ERROR_MESSAGES.BAD_REQUEST });
  }

  if (!validator.isEmail(email)) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: "Invalid email format" });
  }

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log(user);
    console.log(token);
    res.status(200).send({ token });
  } catch (err) {
    console.log(err);
    // console.error(`Error during login: ${err.message}`);
    if (err.message === "Incorrect email or password") {
      return res
        .status(ERROR_CODES.AUTHORIZATION_ERROR)
        .send({ message: ERROR_MESSAGES.AUTHORIZATION_ERROR });
    }
    res
      .status(ERROR_CODES.SERVER_ERROR)
      .send({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

const updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  const updates = {};
  if (name) updates.name = name;
  if (avatar) updates.avatar = avatar;

  User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODES.NOT_FOUND).json({
          status: "error",
          message: ERROR_MESSAGES.NOT_FOUND,
        });
      }
      return res.status(200).json({
        data: user,
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_CODES.BAD_REQUEST).json({
          status: "error",
          message: "Validation Error",
          errors: err.errors,
        });
      }
      return res.status(ERROR_CODES.SERVER_ERROR).json({
        status: "error",
        message: ERROR_MESSAGES.SERVER_ERROR,
      });
    });
};

module.exports = { createUser, login, getCurrentUser, updateUser };

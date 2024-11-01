const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const { BadRequestError } = require("../utils/BadRequestError");
const { UnauthorizedError } = require("../utils/UnauthorizedError");
const { NotFoundError } = require("../utils/NotFoundError");
const { ConflictError } = require("../utils/ConflictError");

const createUser = async (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !password) {
    return next(new BadRequestError("Incorrect email or password"));
  }

  if (!emailRegex.test(email)) {
    return next(new BadRequestError("Invalid email format"));
  }

  try {
    // Check for existing user via email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new ConflictError("Email already exists"));
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create the user with hashed password
    await User.create({
      name,
      avatar,
      email,
      password: hashPassword,
    });

    return res.status(201).send({ name, avatar, email });
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid data"));
    }
    if (err.name === "MongoServerError" || err.code === 11001) {
      return next(new ConflictError(err.message));
    }
    return next(err);
  }
};

const getCurrentUser = (req, res, next) => {
  // the id comes from req.user._id
  const userId = req.user._id;

  User.findById(userId)
    .select("-password")
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("No user with matching ID found"));
      } else if (err.name === "CastError") {
        next(new BadRequestError("The name string is in an invalid format"));
      } else {
        next(err);
      }
    });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("The name string is in an invalid format"));
  }

  if (!validator.isEmail(email)) {
    return next(new BadRequestError("No user with matching ID found"));
  }

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).send({ token });
  } catch (err) {
    console.error(err);
    if (err.message === "Incorrect email or password") {
      return next(new UnauthorizedError("Incorrect email or password"));
    }
    return next(err); // Ensure a return statement here
  }
};

const updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;
  console.log(userId);

  const updates = {};
  if (name) updates.name = name;
  if (avatar) updates.avatar = avatar;

  User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError("No user with matching ID found");
      }
      return res.status(200).json({
        data: user,
      });
    })
    .catch((err ) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError("The name string is in an invalid format"));
      } else {
        next(err);
      }
    });
};
module.exports = { createUser, login, getCurrentUser, updateUser };

import userRepository from "../repositories/userRepository.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ApiError from "../utils/errorHandler.js";

// Secret key for JWT
const SECRET = process.env.JWT_SECRET || "secret";

const getProfile = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return next(new ApiError("Users not found", 404, { user: "Users not found" }));
    }

    res.status(200).json(user);
  } catch (error) {
    next(new ApiError("Error getting Profile user", 500, error.message));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userRepository.findUserByEmail(email);

    if (!user) {
      return next(new ApiError("User not found", 404, { email: "User not found" }));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return next(new ApiError("Invalid password", 401, { password: "Invalid password" }));
    }

    const token = jwt.sign(
      { id: user.id, user: user.name, email: user.email },
      SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "User logged in successfully",
      token,
    });
  } catch (error) {
    next(new ApiError("Error logging in", 400, error.message));
  }
};

const signUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await userRepository.findUserByEmail(email);

    if (user) {
      return next(new ApiError("User already exists", 400, { email: "User already exists" }));
    }

    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS) || 10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userRepository.insertUser({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    next(new ApiError("Error creating user", 400, error.message));
  }
};

export default {
  getProfile,
  login,
  signUp,
};

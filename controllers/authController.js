import userRepository from "../repositories/userRepository.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ApiError from "../utils/errorHandler.js";

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
    const { email, senha } = req.body;

    const user = await userRepository.findUserByEmail(email);

    if (!user) {
      return next(new ApiError("User not found", 404, { email: "User not found" }));
    }

    const issenhaValid = await bcrypt.compare(senha, user.senha);

    if (!issenhaValid) {
      return next(new ApiError("Invalid senha", 401, { senha: "Invalid senha" }));
    }

    const token = jwt.sign(
      { id: user.id, user: user.nome, email: user.email },
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
    const { nome, email, senha } = req.body;

    const user = await userRepository.findUserByEmail(email);

    if (user) {
      return next(new Error("User already exists"));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedsenha = await bcrypt.hash(senha, salt);

    const newUser = await userRepository.insertUser({
      nome,
      email,
      senha: hashedsenha,
    });

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
};


export default {
  getProfile,
  login,
  signUp,
};

import { z } from "zod";
import userRepository from "../repositories/usuariosRepository.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ApiError from "../utils/errorHandler.js";


const SECRET = process.env.JWT_SECRET || "secret";

const signUpSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  senha: z.string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(/[a-z]/, "Senha deve conter letra minúscula")
    .regex(/[A-Z]/, "Senha deve conter letra maiúscula")
    .regex(/[0-9]/, "Senha deve conter número")
    .regex(/[\W_]/, "Senha deve conter caractere especial"),
});

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
      acess_token: token,
    });
  } catch (error) {
     error = new Error("User not found");
    error.status = 404;
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const { nome, email, senha } = signUpSchema.parse(req.body);

    const user = await userRepository.findUserByEmail(email);

    if (user) {
      return next(new Error("User already exists"));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedSenha = await bcrypt.hash(senha, salt);

    const newUser = await userRepository.insertUser({
      nome,
      email,
      senha: hashedSenha,
    });

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  res.status(200).json({
    message: "Logout realizado com sucesso. Remova o token do cliente."
  });
};

const DELETE = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);

    if (req.user.id !== userId) {
      return res.status(403).json({ error: "Você não pode deletar outro usuário" });
    }

    await userRepository.deleteUser(userId);

    res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    next(error);
  }
};


export default {
  getProfile,
  login,
  register,
  signUpSchema,
  logout,
  DELETE
};

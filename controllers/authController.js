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
      return res.status(404).json({ error: "User not found" });
    }

    const isSenhaValid = await bcrypt.compare(senha, user.senha);
    if (!isSenhaValid) {
      return res.status(401).json({ error: "Invalid senha" });
    }

    const token = jwt.sign(
      { id: user.id, nome: user.nome, email: user.email },
      SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ access_token: token });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

const register = async (req, res, next) => {
  try {
    const { nome, email, senha } = signUpSchema.parse(req.body);

    const user = await userRepository.findUserByEmail(email);

    if (user) {
    return res.status(400).json({ message: "Email já está em uso" });
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
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
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

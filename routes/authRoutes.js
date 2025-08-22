import express from "express";
import authController from "../controllers/authController.js";
import validateSchema from "../middlewares/authMiddleware.js";
//import { signUpSchema, loginSchema } from "../schemas/authSchema.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Autenticação
 *  description: Rotas de login e registro de usuários
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar um novo usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignUp'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 */
router.post("/register", authController.signUp);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Fazer login do usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso, retorna token JWT
 */
router.post("/login", authController.login);

export default router;

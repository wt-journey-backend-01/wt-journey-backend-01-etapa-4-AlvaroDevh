import express from "express";
const app = express();
const port = 3000;

import authMiddleware from "./middlewares/authMiddleware.js";

import agentesRoutes from "./routes/agentesRoutes.js";
import casosRoutes from "./routes/casosRoutes.js";
import authRoutes from "./routes/authRoutes.js";


import setupSwagger from "./docs/swagger.js";
import errorHandler from "./utils/errorHandler.js";


app.use(express.json()); 

setupSwagger(app);

app.use("/casos",  authMiddleware , casosRoutes);
app.use( "/agentes", authMiddleware, agentesRoutes);
app.use("/auth", authRoutes);


app.use(errorHandler);


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

import jwt from "jsonwebtoken";

function authMiddleware(req, res, next) {
  try {
    const tokenHeader = req.headers.authorization;
    const token = tokenHeader && tokenHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: true, message: "Token not found" });
    }

    jwt.verify(token, process.env.JWT_SECRET || "secret", (error, decoded) => {
      if (error) {
        return res.status(401).json({ error: true, message: "Invalid token" });
      }

      req.user = decoded; 
      next();
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Error authenticating user" });
  }
}

export default authMiddleware;

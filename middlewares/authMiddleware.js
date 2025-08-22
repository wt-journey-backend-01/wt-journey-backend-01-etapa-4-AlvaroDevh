import jwt from "jsonwebtoken";
import ApiError from "../utils/errorHandler.js";

function authMiddleware(req, res, next) {
  try {
    const tokenHeader = req.headers.authorization;

    const token = tokenHeader && tokenHeader.split(" ")[1];

    if (!token) {
      return next(
        new ApiError("Token not found", 401, { token: "Token not found" })
      );
    }

    jwt.verify(token, process.env.JWT_SECRET || "secret", (error, decoded) => {
      if (error) {
        return next(
          new ApiError("Error authenticating user", 401, error.message)
        );
      }
      req.user = decoded;

      next();
    });
  } catch (error) {
    return next(new ApiError("Error authenticating user", 401, error.message));
  }
}

export default authMiddleware;
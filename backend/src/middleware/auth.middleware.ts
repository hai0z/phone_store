import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check for token in headers
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
      }

      // Get token from header
      const token = authHeader.split(" ")[1];

      // Verify token
      const authService = new AuthService();
      const user = await authService.validateToken(token);

      // Check if user has required role
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          message: "You do not have permission to access this resource",
        });
      }

      // Attach user to request object
      req.user = user;
      next();
    } catch (error: any) {
      if (error.message === "Invalid token") {
        return res.status(401).json({ message: "Invalid or expired token" });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  };
};

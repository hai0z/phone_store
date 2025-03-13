import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  adminLogin = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          message: "Username and password are required",
        });
      }

      const result = await this.authService.adminLogin(username, password);
      return res.status(200).json(result);
    } catch (error: any) {
      if (error.message === "Invalid credentials") {
        return res.status(401).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  customerLogin = async (req: Request, res: Response) => {
    try {
      const { emailOrPhone, password } = req.body;

      if (!emailOrPhone || !password) {
        return res.status(400).json({
          message: "Email/Phone and password are required",
        });
      }

      const result = await this.authService.customerLogin(
        emailOrPhone,
        password
      );
      return res.status(200).json(result);
    } catch (error: any) {
      if (error.message === "Invalid credentials") {
        return res.status(401).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  customerRegister = async (req: Request, res: Response) => {
    try {
      const { full_name, email, phone, password } = req.body;

      if (!full_name || !email || !phone || !password) {
        return res.status(400).json({
          message: "Full name, email, phone, and password are required",
        });
      }

      const result = await this.authService.customerRegister({
        full_name,
        email,
        phone,
        password,
      });
      return res.status(200).json(result);
    } catch (error: any) {
      if (error.message === "Email or phone number already registered") {
        return res.status(409).json({ message: error.message });
      }
      return res
        .status(500)
        .json({ message: "Internal server error" + error.message });
    }
  };

  validateToken = async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
      }

      const token = authHeader.split(" ")[1];
      const user = await this.authService.validateToken(token);
      return res.status(200).json(user);
    } catch (error: any) {
      if (error.message === "Invalid token") {
        return res.status(401).json({ message: "Invalid or expired token" });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}
const authController = new AuthController();

export default authController;

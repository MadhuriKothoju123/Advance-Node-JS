import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const authenticate: RequestHandler = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Invalid token format" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded; // attach user payload
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

export function authorize(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as any;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    if (!allowedRoles.includes(user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied: insufficient role" });
    }

    next();
  };
}

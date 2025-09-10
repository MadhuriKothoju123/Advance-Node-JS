import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function generateToken(user: {
  id: any;
  email: string;
  role: any;
}): string {
  const payload = { id: user.id, email: user.email, role: user.role };

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = jwt.sign(payload, secret, {
    expiresIn: "1h",
  });

  return token;
}

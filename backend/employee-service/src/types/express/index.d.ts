// src/types/express/index.d.ts
import { Request } from 'express';

declare global {
  namespace Express {
    interface User {
      id: string;
      role: string;
    }

    interface Request {
      user?: User;
    }
  }
}

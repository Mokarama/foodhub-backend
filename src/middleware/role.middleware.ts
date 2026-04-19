import { Request, Response, NextFunction } from "express";

const roleMiddleware = (...roles: string[]) => {
  return (req: any, res: Response, next: NextFunction): any => {
    try {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Forbidden: Access denied",
        });
      }

      next();
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  };
};

export default roleMiddleware;
import { Request, Response, NextFunction } from "express";

// Define the error middleware with proper typing
const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
};

export default errorMiddleware;

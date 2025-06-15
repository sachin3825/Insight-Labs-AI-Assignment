import { Request, Response, NextFunction } from "express";
import { generateId } from "../utils/helper";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err);

  res.status(500).json({
    id: generateId(),
    role: "bot",
    timestamp: new Date().toISOString(),
    content: [
      {
        type: "text",
        data: "⚠️ **Server Error**\n\nSomething went wrong on our end. Please try again!",
      },
    ],
  });
};

import { Request, Response, NextFunction } from "express";
import { constants } from "../utils/constants";

export const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await new Promise((resolve) =>
    setTimeout(resolve, constants.RATE_LIMIT_DELAY)
  );
  next();
};

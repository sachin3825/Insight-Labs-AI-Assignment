import express, { Request, Response } from "express";
import cors from "cors";
import chatRouter from "./routes/chat.route";
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.get("/", (_req: Request, res: Response) => {
  res.send("Welcome to the backend server!");
});

app.use("/api", chatRouter);

app.all("/{*any}", (req: Request, res: Response, next) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Not found",
    message: `Route ${req.method} ${req.path} not found`,
  });
});

export default app;

import express, { Request, Response, NextFunction } from "express";
import menuRouter from "./routes/menu.routes";
import orderRouter from "./routes/order.routes";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/menu", menuRouter);
app.use("/api/orders", orderRouter);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Global error-handling middleware — catches unhandled errors from route handlers
// and sends a proper JSON response instead of crashing the container.
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    message: "Internal server error",
    error: err.message,
  });
});

export default app;

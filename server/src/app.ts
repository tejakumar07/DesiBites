import express from "express";
import menuRouter from "./routes/menu.routes";
import orderRouter from "./routes/order.routes";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/menu", menuRouter);
app.use("/api/orders", orderRouter);

export default app;

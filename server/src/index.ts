import app from "./app";
import { prisma } from "./config/prisma";

const PORT = process.env.PORT || 8080;

// Warm up the Prisma/PG connection before accepting requests
// This prevents cold-start timeouts on the first real request.
prisma
  .$connect()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`App is Listening on PORT ${PORT}`);
    });
  })
  .catch((err: unknown) => {
    console.error("Failed to connect to database:", err);
    // Start the server anyway so health checks don't fail,
    // but log the error so Cloud Run logs show the problem.
    app.listen(PORT, () => {
      console.log(`App is Listening on PORT ${PORT} (DB connection failed)`);
    });
  });

// Prevent silent crashes that cause HTTP/2 stream errors
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

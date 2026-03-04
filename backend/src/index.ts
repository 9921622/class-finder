import env from "./env";
import cors from "cors";

import express, { Application } from "express";
import healthRoutes from "./routes/health";
import userRoutes from "./routes/user";

const app: Application = express();

app.use(
  cors({
    origin: env.FRONTEND_API,
  })
);
app.use("/health", healthRoutes);
app.use("/api/users", userRoutes);

app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
});

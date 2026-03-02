import env from "./env";
import cors from "cors";

import express, { Application } from "express";
import userRoutes from "./routes/user";

const app: Application = express();

app.use(
  cors({
    origin: env.FRONTEND_API,
  })
);
app.use("/api/users", userRoutes);

app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
});

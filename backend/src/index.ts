import env from "./env";
import cors from "cors";

import express, { Application } from "express";

import GenerateData from "./models/GenerateData";

import healthRoutes from "./routes/health";
import userRoutes from "./routes/user";
import mapRoutes from "./routes/map";

const app: Application = express();


// ROUTES
app.use(
  cors({
    origin: env.FRONTEND_API,
  })
);
app.use("/health", healthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/map", mapRoutes);
app.use("/static", express.static("public"));
app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
});


// generate dummy data
GenerateData();

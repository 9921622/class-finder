import env from "./env";
import express, { Application } from "express";
import userRoutes from "./routes/user";

const app: Application = express();

app.use("/api/user", userRoutes);

app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
});

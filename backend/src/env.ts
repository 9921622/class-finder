// https://www.creatures.sh/blog/env-type-safety-and-validation/

import path from "path";
import dotenv from "dotenv";
import { z } from "zod";

// check if dev
const NODE_ENV = process.env.NODE_ENV || "development";


// load .envs 
const base_env = dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});
const add_env = dotenv.config({
  path: path.resolve(__dirname, `../.env.${NODE_ENV}`),
});

if (base_env.error) {
  throw new Error("ERROR: .env file not found");
}
if (add_env.error) {
  throw new Error(`ERROR: .env file for {NODE_ENV} not found`);
}

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().min(1).max(65535),
  FRONTEND_API: z.string(),
})
const env = envSchema.parse(process.env)
export default env

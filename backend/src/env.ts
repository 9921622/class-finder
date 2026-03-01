// https://www.creatures.sh/blog/env-type-safety-and-validation/

import path from "path";
import dotenv from "dotenv";
import { z } from "zod";

const result = dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});
if (result.error) {
  throw new Error("ERROR: .env file not found");
}

const envSchema = z.object({
  PORT: z.coerce.number().min(1).max(65535)
})
const env = envSchema.parse(process.env)
export default env

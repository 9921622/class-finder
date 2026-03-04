import { Router, Request, Response } from "express";
import { getAllClasses } from "../models/Class";
const router = Router();



router.get("/1/classes", (req: Request, res: Response) => {
  res.json(getAllClasses());
});

export default router;
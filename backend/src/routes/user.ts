import { Router, Request, Response } from "express";
import { Class } from "../models/Class";
const router = Router();



router.get("/1/classes", (req: Request, res: Response) => {
  // simulate GET route for user's classes
  const classes : Class[] = [
    new Class(
      "CSC 110",
      "Engineering Lab Wing",
      "Room 108",
      "09:00",
      "10:20"
    ),
    new Class(
      "Math 200",
      "Elliott Building",
      "Room 167",
      "11:30",
      "12:50"
    ),
    new Class(
      "SENG 265",
      "ECS Building",
      "Room 124",
      "13:00",
      "14:20"
    ),
    new Class(
      "STAT 260",
      "Cornett Building",
      "Room A120",
      "15:30",
      "16:50"
    ),
  ]
  res.json(classes);
});

export default router;
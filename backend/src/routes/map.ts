import { Router, Request, Response } from "express";
import { mergeLocationNodeArrays, getLocationNodeById, 
    getLocationNodeByName, getAllLocationNodes, LocationNode } from "../models/LocationNode";
const router = Router();



router.get("/node", (req: Request, res: Response) => {
    const sid = req.query.id as number | undefined;
    const name = req.query.name as string | undefined;

    // validate query fields
    if (!sid && !name)
        // should return all nodes if queries are empty
        return res.json(getAllLocationNodes());

    const id = sid ? Number(sid) : undefined;
    if (id !== undefined && isNaN(id))
        return res.status(400).json({ error: "Error: id not a number" });


    // query nodes based on id and name
    const nodeQueries : LocationNode[][] = [];
    if (id !== undefined)
        nodeQueries.push(getLocationNodeById(id));
    if (name !== undefined)
        nodeQueries.push(getLocationNodeByName(name));

    // response
    const query = mergeLocationNodeArrays(nodeQueries);
    res.json(query);
});

export default router;

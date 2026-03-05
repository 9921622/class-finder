import { Router, Request, Response } from "express";
import path from "path";
import fs from "fs";
import { intersectLocationNodeArrays, 
    getLocationNodeById, 
    getLocationNodeByName, 
    getLocationNodeByTags,
    getAllLocationNodes, 
    LocationNode } from "../models/LocationNode";
const router = Router();

router.get("/node", (req: Request, res: Response) => {
    const sid = req.query.id as number | undefined;
    const name = req.query.name as string | undefined;
    const stags = req.query.tags as string | undefined;  // tag1,tag2,tag3

    // validate query fields
    if (!sid && !name && !stags)
        // should return all nodes if queries are empty
        return res.json(getAllLocationNodes());

    // validate id
    const id = sid ? Number(sid) : undefined;
    if (id !== undefined && isNaN(id))
        return res.status(400).json({ error: "Error: id not a number" });

    // validate tags
    let tags: string[] | undefined;
    if (stags) {
        tags = stags.split(",").map(t => t.trim()).filter(t => t.length > 0);
        if (tags.length === 0) tags = undefined;
    }

    // query nodes based on id and name
    const nodeQueries : LocationNode[][] = [];
    if (id !== undefined) nodeQueries.push(getLocationNodeById(id));
    if (name !== undefined) nodeQueries.push(getLocationNodeByName(name));
    if (tags) nodeQueries.push(getLocationNodeByTags(tags));

    // response
    const query = intersectLocationNodeArrays(nodeQueries);
    res.json(query);
});

router.get("/tile/:b/:z/:x/:y.png", (req: Request, res: Response) => {
    const building = String(req.params.b);
    const z = Number(req.params.z);
    const x = Number(req.params.x);
    const y = Number(req.params.y);

    if ([z, x, y].some(n => isNaN(n)))
        return res.status(400).send("ERROR: must be numbers");

    const tpath = path.join(
        process.cwd(), "assets", "map-tiles", building,
        String(z), String(x), `${y}.png`);

    if (!fs.existsSync(tpath))
        return res.status(404).send("ERROR: tile not found");
    res.sendFile(tpath);
});

export default router;

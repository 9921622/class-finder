import { Router, Request, Response } from "express";
const router = Router();

/*
    THIS IS A MANDATORY ROUTE FOR RAILWAY TO USE FOR HEALTH CHECKS
    https://docs.railway.com/deployments/healthchecks

    To configure a healthcheck:
        1. Ensure your webserver has an endpoint (e.g. /health) that will return an 
        HTTP status code of 200 when the application is live and ready.

        2. Under your service settings, input your health endpoint. Railway will wait 
        for this endpoint to serve a 200 status code before switching traffic to 
        your new endpoint.
*/


router.get("", (req: Request, res: Response) => {
    res.sendStatus(200)
});

export default router;
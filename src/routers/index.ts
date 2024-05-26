import express from "express";
import ping from "src/controllers/ping";

import review from "./review";

const router = express.Router();

router.get("/ping", ping);

router.use("/api/review", review);

export default router;

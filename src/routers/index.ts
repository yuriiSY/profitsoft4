import express from "express";
import ping from "src/controllers/ping";
import groups from "./groups";
import students from "./students";
import review from "./review";

const router = express.Router();

router.get("/ping", ping);

router.use("/groups", groups);
router.use("/students", students);
router.use("/api/review", review);

export default router;

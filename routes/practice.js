import { attemptsGetter, attemptsSync } from "../controllers/practice.js";
import express from "express";

const router = express.Router();

router.post("/sync", attemptsSync);
router.get("/sync", attemptsGetter);

export default router;
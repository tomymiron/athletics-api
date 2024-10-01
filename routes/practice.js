import { attemptsGetter, attemptsSync, rankingBasics, rankingGlobal, rankingGlobalPos, rankingMonthly } from "../controllers/practice.js";
import express from "express";

const router = express.Router();

router.post("/sync", attemptsSync);
router.get("/sync", attemptsGetter);

router.get("/ranking/global/pos", rankingGlobalPos);
router.get("/ranking/monthly", rankingMonthly);
router.get("/ranking/global", rankingGlobal);
router.get("/ranking", rankingBasics);

export default router;
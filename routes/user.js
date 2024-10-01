import { emailCheck, usernameChange, usernameCheck } from "../controllers/user.js";
import express from "express";

const router = express.Router();

router.get("/username/check", usernameCheck);
router.post("/username", usernameChange);
router.get("/email/check", emailCheck);

export default router;
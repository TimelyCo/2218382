import express from "express";
import { createShortURL, redirectURL, getURLStats } from "../controllers/urlController.js";

const router = express.Router();

router.post("/shorturls", createShortURL);
router.get("/:shortcode", redirectURL);
router.get("/shorturls/:shortcode", getURLStats);

export default router;

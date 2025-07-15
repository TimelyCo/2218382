import dayjs from "dayjs";
import generateShortCode from "../utils/shortener.js";
import { urlMap } from "../data/store.js";
import log from "../utils/logger.js";

const HOST = "http://localhost:3000";
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhbm1vbHJhdHVyaTI0NkBnbWFpbC5jb20iLCJleHAiOjE3NTI1NTYwNzYsImlhdCI6MTc1MjU1NTE3NiwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjFhOTBiMmMzLTA3OTQtNDM3YS05ZmQzLWY1MGNiZmM5YzNkNSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImFubW9sIHJhdHVyaSIsInN1YiI6IjM5MWEzYjQxLTA2Y2MtNGI5Mi1iMjY2LTcxOTBjZDg5OTgwZiJ9LCJlbWFpbCI6ImFubW9scmF0dXJpMjQ2QGdtYWlsLmNvbSIsIm5hbWUiOiJhbm1vbCByYXR1cmkiLCJyb2xsTm8iOiIyMjE4MzgyIiwiYWNjZXNzQ29kZSI6IlFBaERVciIsImNsaWVudElEIjoiMzkxYTNiNDEtMDZjYy00YjkyLWIyNjYtNzE5MGNkODk5ODBmIiwiY2xpZW50U2VjcmV0IjoieWtIVENKamN1dXVYY3dFbSJ9.r9WbtnU869S10yImoW_DYmoYViQ5rcwtja6aOV_8d_A";
export const createShortURL = async (req, res) => {
  const { url, validity = 30, shortcode } = req.body;

  try {
    new URL(url);
  } catch (err) {
    await log("backend", "error", "handler", "Invalid URL format", ACCESS_TOKEN);
    return res.status(400).json({ error: "Invalid URL" });
  }

  let code = shortcode || generateShortCode();

  if (urlMap.has(code)) {
    await log("backend", "warn", "handler", "Shortcode already exists", ACCESS_TOKEN);
    return res.status(409).json({ error: "Shortcode already in use" });
  }

  const createdAt = new Date();
  const expiry = new Date(Date.now() + validity * 60 * 1000);

  urlMap.set(code, {
    originalUrl: url,
    createdAt,
    expiry,
    clickStats: [],
  });

  await log("backend", "info", "service", `Created short URL: ${code}`, ACCESS_TOKEN);

  return res.status(201).json({
    shortLink: `${HOST}/${code}`,
    expiry: expiry.toISOString(),
  });
};

export const redirectURL = async (req, res) => {
  const shortcode = req.params.shortcode;
  const data = urlMap.get(shortcode);

  if (!data) {
    await log("backend", "error", "handler", `Shortcode ${shortcode} not found`, ACCESS_TOKEN);
    return res.status(404).json({ error: "Shortcode not found" });
  }

  const now = new Date();
  if (now > data.expiry) {
    await log("backend", "warn", "handler", `Shortcode ${shortcode} expired`, ACCESS_TOKEN);
    return res.status(410).json({ error: "Shortcode has expired" });
  }

  const click = {
    timestamp: now.toISOString(),
    referrer: req.get("Referer") || "unknown",
    region: "India", // Simulated
  };

  data.clickStats.push(click);

  await log("backend", "info", "service", `Redirected to ${data.originalUrl}`, ACCESS_TOKEN);
  res.redirect(data.originalUrl);
};

export const getURLStats = async (req, res) => {
  const shortcode = req.params.shortcode;
  const data = urlMap.get(shortcode);

  if (!data) {
    await log("backend", "error", "handler", `Stats for ${shortcode} not found`, ACCESS_TOKEN);
    return res.status(404).json({ error: "Shortcode not found" });
  }

  const stats = {
    originalUrl: data.originalUrl,
    createdAt: data.createdAt.toISOString(),
    expiry: data.expiry.toISOString(),
    clicks: data.clickStats.length,
    clickStats: data.clickStats,
  };

  await log("backend", "info", "service", `Fetched stats for ${shortcode}`, ACCESS_TOKEN);
  res.json(stats);
};

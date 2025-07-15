import express from "express";
import cors from "cors";
import urlRoutes from "./routes/urlRoutes.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/", urlRoutes);

app.listen(PORT, () => {
  console.log(`Server running on : http://localhost:${PORT}`);
});

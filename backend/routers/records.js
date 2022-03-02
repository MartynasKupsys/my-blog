import * as express from "express";
import { writeFile as wf, readFile, access } from "fs";
import * as path from "path";

const target = path.join("./", "database", "data.json");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

export default router;

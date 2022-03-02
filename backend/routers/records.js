import * as express from "express";
import { writeFile as wf, readFile, access } from "fs";
import * as path from "path";

const target = path.join("./", "database", "data.json");

const router = express.Router();

router.get("/", (req, res) => {
  access(target, (err) => {
    if (err) {
      res.json({ response: false, message: `File with data don't exist!!` });
    } else {
      res.json({ response: true, message: "Hello World" });
    }
  });
});

export default router;

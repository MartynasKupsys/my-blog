import * as express from "express";
import { writeFile as wf, readFile, access, unlink } from "fs";
import * as path from "path";
import multer from "multer";

// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./pictures");
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage: storage });

const target = path.join("./", "database", "data.json");
const router = express.Router();

// GET router get all data from data.json
router.get("/", (req, res) => {
  access(target, (err) => {
    if (err) {
      res.json({ response: false, message: `Prasome prideti pirmaji irasa` });
    } else {
      readFile(target, "utf8", (err, data) => {
        if (err) throw err;
        if (data.length === 0) {
          res.json({ response: false, message: `Prasome prideti pirmaji irasa` });
        } else {
          res.json({ response: true, message: "Nuskaityta", data: data });
        }
      });
    }
  });
});

// POST router new record
router.post("/irasyti", upload.single("failas"), (req, res) => {
  console.log(req.body);
  console.log(req.file);
  let imageObj = req.file;
  let image;

  if (imageObj !== undefined) {
    image = "/pictures/" + imageObj.filename;
    req.body.image = image;
  }

  req.body.data = new Date().toISOString().slice(0, 10);
  const postData = req.body;

  if (postData.pavadinimas.length === 0) {
    res.json({ message: "Pavadinimo laukelis negali buti tuscias" });
    return;
  }

  if (postData.aprasymas.length === 0) {
    res.json({ message: "Aprasymo laukelis negali buti tuscias" });
    return;
  }

  access(target, (err) => {
    if (err) {
      const arrayData = [];
      postData.id = Date.now();
      arrayData.push(postData);
      wf(target, JSON.stringify(arrayData), (err) => {
        if (err) {
          res.json({ response: false, message: `Failed to write file: ${err}` });
        } else {
          res.json({ response: true, message: `Record entered`, data: JSON.stringify(arrayData) });
        }
      });
    } else {
      readFile(target, "utf8", (err, data) => {
        if (err) throw err;
        let oldData = JSON.parse(data);
        postData.id = Date.now();
        oldData.push(postData);
        wf(target, JSON.stringify(oldData), (err) => {
          if (err) {
            res.json({ response: false, message: `Failed to write file: ${err}` });
          } else {
            res.json({ response: true, message: `Record entered`, data: JSON.stringify(oldData) });
          }
        });
      });
    }
  });
});

router.post("/irasyti/:id", (req, res) => {
  console.log(req.params.id);
  console.log(req.body);
  res.json(req.body);
});

// DELETE router to delete selected record
router.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  readFile(target, "utf8", (err, data) => {
    if (err) {
      res.json({ response: false, message: `Can't read file` });
      return;
    }

    const duomenys = JSON.parse(data);
    const findData = duomenys.find((el, index, arr) => {
      if (el.id === parseInt(id)) {
        return arr.splice(index, 1);
      }
    });

    const imgLink = findData.image;

    unlink(`.${imgLink}`, (err) => {
      if (err) throw err;
      console.log(`${imgLink} was deleted`);
      wf(target, JSON.stringify(duomenys), (err) => {
        if (err) {
          res.json({ response: false, message: `Failed to update file: ${err}` });
        } else {
          res.json({ response: true, message: `Record deleted`, data: JSON.stringify(duomenys) });
        }
      });
    });
  });
});

// GET router to get one selected record
router.get("/record-one/:id", (req, res) => {
  let id = req.params.id;
  readFile(target, "utf8", (err, data) => {
    if (err) {
      res.json({ response: false, message: `Can't read file` });
      return;
    }

    const duomenys = JSON.parse(data);
    const findData = duomenys.find((el) => el.id === parseInt(id));

    res.json({ response: true, data: JSON.stringify(findData) });
  });
});

export default router;

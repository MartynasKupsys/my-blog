import * as express from "express";
import { writeFile as wf, readFile, access, writeFile, lchown } from "fs";
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
console.log(target);
const router = express.Router();

router.get("/", (req, res) => {
  access(target, (err) => {
    if (err) {
      // res.json({ response: false, message: `File with data don't exist!!` });
      res.json({ response: false, message: `Prasome prideti pirmaji irasa` });
    } else {
      readFile(target, "utf8", (err, data) => {
        if (data.length === 0) {
          res.json({ response: false, message: `Prasome prideti pirmaji irasa` });
        } else {
          res.json({ response: true, message: "Nuskaityta", data: data });
        }
      });
      // res.json({ response: true, message: "Hello World" });
    }
  });
});

router.post("/irasyti", upload.single("failas"), (req, res) => {
  // console.log(req.body);
  // console.log(req.file);
  let imageObj = req.file;
  let image;
  if (imageObj !== undefined) {
    image = "/pictures/" + imageObj.filename;
    req.body.image = image;
  }
  console.log(image);
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

  console.log(postData);
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
        // console.log(data);
        let oldData = JSON.parse(data);
        // postData.id = oldData[oldData.length - 1].id + 1;
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

router.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);
  readFile(target, "utf8", (err, data) => {
    if (err) {
      res.json({ response });
    }
  });
  res.json({ id });
  // access(target, (err) => {
  //   if (err) {
  //     // res.json({ response: false, message: `File with data don't exist!!` });
  //     res.json({ response: false, message: `Prasome prideti pirmaji irasa` });
  //   } else {
  //     readFile(target, "utf8", (err, data) => {
  //       if (data.length === 0) {
  //         res.json({ response: false, message: `Prasome prideti pirmaji irasa` });
  //       } else {
  //         res.json({ response: true, message: "Nuskaityta", data: data });
  //       }
  //     });
  //     // res.json({ response: true, message: "Hello World" });
  //   }
  // });
});

export default router;

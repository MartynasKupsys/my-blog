import express from "express";
import cors from "cors";
import router from "./routers/records.js";

const app = express();
const port = 5000;

app.use(cors());

app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use("/pictures", express.static("pictures"));
app.use(express.json());

// middlewares
app.use("/", router);
app.use("/irasyti", router);
app.use("/delete", router);
app.use("/record-one", router);
// app.use("/atnaujinti", router);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

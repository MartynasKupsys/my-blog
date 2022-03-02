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

app.use(express.json());

// middlewares
app.use("/", router);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const productRouter = require("./routes/product");
const userRouter = require("./routes/user");

const app = express();
// connection with mongoose
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(bodyParser.json());
app.use("/product", productRouter);
app.use("/user", userRouter);
app.get("/", (req, res) => {
  res.send("Cart CRUD");
});

app.listen(3001);

const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const productRouter = require("./routes/product");
const cartRouter = require("./routes/cart");
const ordersRouter = require("./routes/order");
const userRouter = require("./routes/user");

const app = express();
// connection with mongoose
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
app.use(cors());
app.use(bodyParser.json());
app.use("/product", productRouter);
app.use("/cart", cartRouter);
app.use("/orders", ordersRouter);
app.use("/user", userRouter);
app.get("/", (req, res) => {
  res.send("Cart CRUD");
});

app.listen(3001);

const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const productRouter = require("./routes/product");
const cartRouter = require("./routes/cart");
const ordersRouter = require("./routes/order");
const userRouter = require("./routes/user");
const path = require('path')

const app = express();
// connection with mongoose
mongoose.connect("mongodb+srv://akshay:akshay@cluster0.hj3jxmp.mongodb.net", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// app.use(express.static("uploads"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

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
  res.send("Cart CRUD 3001");
});

app.listen(3001);

const mongoose = require("mongoose");

const { Schema } = mongoose;

const addressSchema = new Schema({
  landmark: {
    type: String,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  pinCode: {
    type: String,
  },
  near: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  district: {
    type: String,
  },
  taluko: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;

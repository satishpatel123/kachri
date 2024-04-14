const mongoose = require("mongoose");

const { Schema } = mongoose;

const addressSchema = new Schema({
  city: {
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
  state: {
    type: String,
  },
  address: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;

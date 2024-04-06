const mongoose = require("mongoose");

const { Schema } = mongoose;

const addressSchema = new Schema({
  city: {
    type: String,
  },
  customerName: {
    type: String,
  },
  mobile: {
    type: String,
  },
  pincode: {
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
    ref: 'User'
  },
});

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;

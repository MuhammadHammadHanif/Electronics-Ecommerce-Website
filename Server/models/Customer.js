const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  likedproducts: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "sellers"
      }
    }
  ],
  purchaseproducts: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "sellers"
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      },
      status: {
        type: String,
        default: "Pending"
      },
      date: {
        type: Date,
        default: Date.now()
      }
    }
  ]
});

module.exports = Customer = mongoose.model("customers", customerSchema);

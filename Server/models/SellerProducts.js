const mongosse = require("mongoose");
const Schema = mongosse.Schema;

const SellerProductsSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  productname: {
    type: String,
    required: true,
    trim: true
  },
  sellername: {
    type: String,
    trim: true
  },
  productcode: {
    type: String,
    trim: true,
    required: true
  },
  images: {
    type: [String],
    required: true
  },
  colors: {
    type: [String]
  },
  sizes: {
    type: [String]
  },
  categories: {
    type: [String],
    required: true
  },
  price: {
    type: String,
    required: true
  },
  discount: {
    type: String
  },
  description: {
    type: String
  },
  additionalinformation: {
    weight: {
      type: String
    },
    dimention: {
      type: String
    },
    material: {
      type: String
    }
  },
  reviews: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      email: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now()
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = Seller = mongosse.model("sellers", SellerProductsSchema);

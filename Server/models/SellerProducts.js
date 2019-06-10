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
    trim: true,
    required: true
  },
  productcode: {
    type: String,
    trim: true,
    required: true
  },
  quantity: {
    type: String,
    required: true
  },
  images: {
    type: [Buffer],
    required: true
  },
  colors: {
    type: [String],
    required: true
  },
  sizes: {
    type: [String],
    required: true
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
    type: String,
    required: true
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
  productstatus: [
    {
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
  ],
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
        type: String
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

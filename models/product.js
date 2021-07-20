const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

module.exports = model("Product", productSchema);

// const { getDb } = require("../util/database");
//
// const { ObjectId } = require("mongodb");
//
// class Product {
//   constructor(title, imageUrl, description, price, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id ? new ObjectId(id) : null;
//     this.userId = userId;
//   }
//
//   save() {
//     const db = getDb();
//     if (this._id) {
//       return db
//         .collection("products")
//         .updateOne({ _id: this._id }, { $set: this })
//         .then((result) => {
//           console.log(result);
//         })
//         .catch((e) => console.log(e));
//     }
//     return db
//       .collection("products")
//       .insertOne(this)
//       .then((result) => {
//         console.log(result);
//       })
//       .catch((e) => console.log(e));
//   }
//
//   static fetchAll() {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find()
//       .toArray()
//       .then((products) => {
//         return products;
//       })
//       .catch((e) => console.log(e));
//   }
//
//   static findById(productId) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find({ _id: new ObjectId(productId) })
//       .next()
//       .then((product) => {
//         return product;
//       })
//       .catch((e) => {
//         console.log(e);
//       });
//   }
//
//   static deleteById(productId) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .deleteOne({ _id: new ObjectId(productId) })
//       .then((result) => console.log("deleted"))
//       .catch((e) => console.log(e));
//   }
// }
//
// module.exports = Product;

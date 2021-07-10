const { getDb } = require("../util/database");
const { ObjectId } = require("mongodb");

class User {
  constructor(username, email, cart) {
    this.username = username;
    this.email = email;
    this.cart = cart; // {items: []}
  }

  save() {
    const db = getDb();

    return db.collection("users").insertOne(this);
  }

  addToCart(product) {
    // const cartProducts = this.cart.items.findIndex((cp) => {
    //   return cp._id === product._id;
    // });
    product.quantity = 1;
    const updatedCart = { items: [product] };
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) })
      .then((result) => {
        console.log(result);
        return result;
      })
      .catch((e) => console.log(e));
  }
}

module.exports = User;

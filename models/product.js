const { getDb } = require("../util/database");

class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  save() {
    const db = getDb();
    return db
      .collection("products")
      .insertOne(this)
      .then((result) => {
        console.log(result);
      })
      .catch((e) => console.log(e));
  }

  static fetchAll() {
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        console.log(products);
        return products;
      })
      .catch((e) => console.log(e));
  }
}

module.exports = Product;

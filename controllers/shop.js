const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/product-list", {
        products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((e) => console.log(e));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/index", {
        products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((e) => console.log(e));
};

exports.getCart = (req, res, next) => {
  const { user } = req;

  user
    .getCart()
    .then((cart) => {
      return cart
        .getProducts()
        .then((products) => {
          res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Your Cart",
            products,
          });
        })
        .catch((e) => console.log(e));
    })
    .catch((e) => console.log(e));
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  const { user } = req;
  let fetchedCart;
  let newQuantity = 1;

  user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(productId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((e) => console.log(e));
};

exports.postDeleteCartItem = (req, res, next) => {
  const { productId } = req.body;
  const { user } = req;

  user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((e) => console.log(e));
};

exports.getOrders = (req, res, next) => {
  const { user } = req;

  user
    .getOrders({ include: ["Products"] })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders,
      });
    })
    .catch((e) => console.log(e));
};

exports.getProductDetails = (req, res) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      console.log(product);
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((e) => console.log(e));
};

exports.postOrder = (req, res) => {
  const { user } = req;
  let fetchCart = null;

  user
    .getCart()
    .then((cart) => {
      fetchCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return user
        .createOrder()
        .then((order) => {
          return order.addProducts(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .then((result) => {
          return fetchCart.setProducts(null);
        })
        .then((result) => {
          res.redirect("/orders");
        })
        .catch((e) => console.log(e));
    })
    .catch((e) => console.log(e));
};

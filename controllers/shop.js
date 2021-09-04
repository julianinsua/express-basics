const Product = require("../models/product");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((e) => {
      const error = new Error(e);
      error.httpStatusCode = 500;

      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((e) => {
      const error = new Error(e);
      error.httpStatusCode = 500;

      return next(error);
    });
};

exports.getCart = (req, res, next) => {
  const { user } = req;

  user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products,
      });
    })
    .catch((e) => {
      const error = new Error(e);
      error.httpStatusCode = 500;

      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((e) => {
      const error = new Error(e);
      error.httpStatusCode = 500;

      return next(error);
    });
};

exports.postDeleteCartItem = (req, res, next) => {
  const { productId } = req.body;
  const { user } = req;

  user
    .removeFromCart(productId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((e) => {
      const error = new Error(e);
      error.httpStatusCode = 500;

      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  const { user } = req;
  Order.find({ "user.userId": user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders,
      });
    })
    .catch((e) => {
      const error = new Error(e);
      error.httpStatusCode = 500;

      return next(error);
    });
};

exports.getProductDetails = (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((e) => {
      const error = new Error(e);
      error.httpStatusCode = 500;

      return next(error);
    });
};

exports.postOrder = (req, res) => {
  const { user } = req;
  user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        products,
        user: { email: req.user.email, userId: req.user },
      });
      return order.save();
    })
    .then((result) => {
      return user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((e) => console.log(e));
};

const CartModel = require("../models/CartModel");

module.exports = {
  addToCartInfo: async (req, res) => {
    const { productId, quantity = 1 } = req.body;

    try {
      let cart = await CartModel.findOne({ userId: req.userId });

      if (!cart) {
        cart = new CartModel({ userId: req.userId, items: [] });
      }

      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }

      await cart.save();
      await cart.populate({
        path: "items.productId",
        select: "name price image stock",
      });

      res.status(200).json(cart);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  updateToCartInfo: async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;

    try {
      const cart = await CartModel.findOne({ userId: req.userId });
      if (!cart) return res.status(404).json({ message: "Cart not found" });

      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex === -1) {
        return res.status(404).json({ message: "Item not found in cart" });
      }

      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }

      await cart.save();
      await cart.populate({
        path: "items.productId",
        select: "name price image stock",
      });

      res.json(cart);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  // DELETE - Remove specific item from cart
  removeFromCart: async (req, res) => {
    const { productId } = req.params;

    try {
      const cart = await CartModel.findOne({ userId: req.userId });
      if (!cart) return res.status(404).json({ message: "Cart not found" });

      cart.items = cart.items.filter(
        (item) => item.productId.toString() !== productId
      );

      await cart.save();
      await cart.populate({
        path: "items.productId",
        select: "name price image stock",
      });

      res.json(cart);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  // DELETE - Clear entire cart
  clearCart: async (req, res) => {
    try {
      await CartModel.findOneAndUpdate({ userId: req.userId }, { items: [] });
      res.json({ message: "Cart cleared successfully", items: [] });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = {
  addProduct: (req, res) => {
    const { name, description, old_price, new_price, category, quantity } =
      req.body;
    let id;
    const products = ProductModel.find();
    if (products.length > 0) {
      let lastProduct = products[products.length - 1];
      id = lastProduct.id + 1;
    } else {
      id = 1;
    }
    const data = ProductModel.create({
      id,
      name,
      description,
      old_price,
      new_price,
      category,
      quantity,
      image: req.file.path,
    });
    return res
      .status(200)
      .json({ message: "Product Added successfully", data });
  },
  getProduct: () => {
    const data = ProductModel.find();
    return res.status(200).json({ message: "Get Product List", data });
  },
  updateProduct: (req, res) => {
    const { name, description, old_price, new_price, category, quantity } =
      req.body;
    const data = ProductModel.findByIdAndUpdate(
      req.params.productId,
      {
        $set: {
          name,
          description,
          old_price,
          new_price,
          category,
          quantity,
          image: req.file.path,
        },
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Product Updated successfully", data });
  },
  updateProductByStatus: (req, res) => {
    const data = ProductModel.findByIdAndUpdate(
      req.params.productId,
      { $set: req.body },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Product Updated successfully", data });
  },
  deleteProduct: (req, res) => {
    const data = ProductModel.findByIdAndDelete(req.params.productId);
    return res
      .status(200)
      .json({ message: "Product Deleted successfully", data });
  },
};

import productModel from "../../../dao/models/product.model.js";

export const getProductsManager = async (req, res) => {
  const productId = req.params.productId;
  const user = req.user;

  try {
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).send("Product not found");
    }

    switch (true) {
      case product.owner === user.email:
        return res.render("updateProducts", product);
        
      case product.owner == user.role:
        return res.render("updateProducts", product);

      default:
        res.render("errors/update-error");
    }

  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Error fetching product");
  }
};

import productModel from "../dao/models/product.model.js";
import logger from "../utils/logger.js";

export const createProduct = async function createProduct(
  productData,
  ownerEmail
) {
  const {
    title,
    description,
    price,
    status,
    code,
    stock,
    category,
    thumbnail,
  } = productData;

  const codeExists = await productModel.exists({ code });

  if (codeExists) {
    logger.error(`
    The product code already exists.
      ${err.stack}  
    `);
  }

  const product = new productModel({
    title,
    description,
    price,
    status,
    code,
    stock,
    category,
    thumbnail,
    owner: ownerEmail,
  });

  await product.save();
  return product;
};

export const getProducts = async function getProducts() {
  const products = await productModel.find();
  return products;
};

export const updateProduct = async function updateProduct(productId, newData) {
  const product = await productModel.findByIdAndUpdate(productId, newData, {
    new: true,
  });
  return product;
};

export const deleteProduct = async function deleteProduct(productId) {
  const product = await productModel.findByIdAndDelete(productId);
  return product;
};

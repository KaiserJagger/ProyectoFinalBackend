import productManager from "../dao/manager/products.manager.js";
import productModel from "../dao/models/product.model.js";
import logger from "../utils/logger.js";

export const getProductsService = async (
  page = 1,
  limit = 10,
  sort = 1,
  query = ""
) => {
  try {
    const filter = query
      ? {
          $or: [
            { title: { $regex: query, $options: "i" } },
            { category: { $regex: query, $options: "i" } },
          ],
        }
      : {};

    const options = {
      page,
      limit,
      sort: { price: sort },
      lean: true,
    };

    const products = await productModel.paginate(filter, options);
    return products;
  } catch (err) {
    logger.error(`
    An error occurred when obtaining products.
    ${err.stack}  
  `)}
};

export const createProductService = async (productData, ownerEmail) => {
  try {
    const product = await productManager.createProduct(productData, ownerEmail);
    return product;
  } catch (err) {
    logger.error(`
    An error occurred while creating the product
    ${err.stack}  
  `)}
};

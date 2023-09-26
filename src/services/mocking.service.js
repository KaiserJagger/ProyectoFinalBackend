import MockingModel from "../dao/models/mocking.model.js";
import logger from "../utils/logger.js";

export const getMockingService = async (
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

    const mockingProduct = await MockingModel.paginate(filter, options);
    return mockingProduct;
  } catch (err) {
    logger.error(`
      An error occurred when obtaining the mocking products.
      ${err.stack}  
    `)}
};

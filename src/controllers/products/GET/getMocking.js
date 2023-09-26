import { getMockingService } from "../../../services/mocking.service.js";
import logger from "../../../utils/logger.js";

export const getMocking = async (req, res) => {
  const user = req.user;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort === "desc" ? -1 : 1;
  const query = req.query.query || "";

  logger.http("GET /api/products/mockingproducts");

  try {
    const mockingProducts = await getMockingService(page, limit, sort, query);

    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < mockingProducts.totalPages ? page + 1 : null;

    const data = {
      mockingProducts,
      query,
      limit,
      sort,
      prevPage,
      nextPage,
      userEmail: user.email,
      userRole: user.role,
    };

    Object.assign(data, req.query);

    res.status(201).render("mocking", data);
  } catch (err) {
    logger.error(`
      An error occurred while getting the products
      ${err.stack}  
    `);
    res
      .status(500)
      .json({ err: "An error occurred while getting the products" });
  }
};

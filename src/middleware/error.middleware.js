import EErros from "../services/errors/enums.js";

export default (error, req, res, next) => {
  console.log(error.cause);

  switch (error.code) {
    case EErros.INVALID_TYPES_ERROR:
      res.code(400).send({ status: "error", error: error.name });
      break;

    case EErros.ERROR_GET_CARTS:
      res.code(500).send({ status: "error", error: error.name });
      break;

    case EErros.ERROR_POST_CARTS:
      res.code(500).send({ status: "error", error: error.name });
      break;

    case EErros.ERROR_ADD_TO_CART:
      res.code(500).send({ status: "error", error: error.name });

    default:
      res.send({ status: "error", error: "Unhandled error" });
      break;
  }
};

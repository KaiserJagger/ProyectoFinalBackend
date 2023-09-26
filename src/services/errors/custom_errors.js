export const CustomError = ({ name = "Error", cause, message, code }) => {
  const error = new Error(message, { cause });
  error.name = name;
  error.code = code;
  return error;
};
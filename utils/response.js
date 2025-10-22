const successResponse = (res, message, data = {}) => {
    return res.status(200).json({
      success: true,
      message,
      data
    });
  };
  
const errorResponse = (res, message, data = {}, code = 400) => {
  console.log("errorResponse args:", { message, data, code });
  return res.status(code).json({
    success: false,
    message,
    data,
  });
};

  
  module.exports = { successResponse, errorResponse };
  
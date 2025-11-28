const ErrorHandler = ({ error, message, code, res, req }) => {
  console.log(error);
  console.log("route", req.originalUrl);
  console.log("req.body", req.body);

  if (error.code === 11000) {
    return res.status(code).json({
      success: false,
      message: message,
      error: error.keyValue,
    });

    //   setTimeout(() => {
    //     process.exit(1);
    //   }, 1000);
    //   return;
  }

  return res.status(code).json({
    success: false,
    message: message,
    error: error,
  });

  //   setTimeout(() => {
  //     process.exit(1);
  //   }, 1000);

  //   return;
};

module.exports = ErrorHandler;

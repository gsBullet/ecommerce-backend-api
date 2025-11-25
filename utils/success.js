const successHandler = ({ data, message, code, res, req }) => {
  console.log("route", req.originalUrl);
  console.log("req.body", req.body);
  console.log("req.files", req.files);

  return res.status(code).json({
    success: true,
    data,
    message: message,
  });

  //   setTimeout(() => {
  //     process.exit(1);
  //   }, 1000);
  //   return;

  // return res.status(code).json({
  //   success: false,
  //   message: message,
  // });

  //   setTimeout(() => {
  //     process.exit(1);
  //   }, 1000);

  //   return;
};

module.exports = successHandler;

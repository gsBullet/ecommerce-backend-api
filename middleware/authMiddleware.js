const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/error");

const jwtSecret = "842a2780-bb8e-482c-b22c-823084e1f054";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    // console.log( req);

    // No authorization header
    if (!authHeader) {
      return ErrorHandler({
        error: "Unauthorized",
        message: "Authorization header missing",
        code: 401,
        res,
        req,
      });
    }

    // Header format must be: "Bearer token"
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "EcomToken") {
      return ErrorHandler({
        error: "Unauthorized",
        message: "Invalid Authorization format",
        code: 401,
        res,
        req,
      });
    }

    const token = parts[1];

    // Verify token
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        return ErrorHandler({
          error: err.message,
          message:
            err.name === "TokenExpiredError"
              ? "Token expired"
              : "Invalid token",
          code: 401,
          res,
          req,
        });
      }

      // Valid token
      req.userData = decoded;
      next();
    });
  } catch (error) {
    return ErrorHandler({
      error,
      message: "Authentication failed",
      code: 500,
      res,
      req,
    });
  }
};

module.exports = authMiddleware;

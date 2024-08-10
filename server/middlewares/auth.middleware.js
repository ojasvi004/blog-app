import jwt from "jsonwebtoken";

const secret = "askdjhfkajhdfkaepworixcmvnlsdjfh";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }
  jwt.verify(token, secret, (error, user) => {
    if (error) {
      return res.status(500).json({msg: error});
    }
    req.user = user;
    next();
  });
};
import jwt from 'jsonwebtoken';

const secret = 'askdjhfkajhdfkaepworixcmvnlsdjfh';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }
  jwt.verify(token, secret, (error, user) => {
    if (error) {
      return res.status(500).json({ msg: error.message });
    }
    req.user = user;
    next();
  });
};

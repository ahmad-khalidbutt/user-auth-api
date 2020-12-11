const jwt = require('express-jwt');
const { secret } = require('../config/config.json');
const db = require('../helpers/db');
const jwtDecode = require('jwt-decode');

module.exports = authorize;

/**
 * Authorize the request & find the user
 */

function authorize() {
  return [
    // authenticate JWT token and attached decoded token to request as req.user
    jwt({ secret, algorithms: ['HS256'] }),

    // attach user record to request object
    async (req, res, next) => {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwtDecode(token);
      console.log(req.user);
      const user = await db.User.findByPk(req.user.sub);

      if (!user) return res.status(401).json({ message: 'Unauthorized' });

      req.user = user.get();
      next();
    },
  ];
}

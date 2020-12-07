const jwt = require("express-jwt");
const { secret } = require("../config/config.json");
const db = require("../helpers/db");

module.exports = authorize;

/**
 * Authorize the request & find the user
 */

function authorize() {
  return [
    // authenticate JWT token and attached decoded token to request as req.user
    jwt({ secret, algorithms: ["HS256"] }),

    // attach user record to request object
    async (req, res, next) => {
      const user = await db.User.findByPk(req.user.sub);

      if (!user) return res.status(401).json({ message: "Unauthorized" });

      req.user = user.get();
      next();
    },
  ];
}

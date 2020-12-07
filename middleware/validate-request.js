module.exports = validateRequest;

/**
 * 
 * @param {object} req 
 * @param {function} next 
 * @param {object} schema
 * validates the request body according to the defined schema
 * throws error if not validated 
 */
function validateRequest(req, next, schema) {
  const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown properties
    stripUnknown: true, // remove unknown properties
  };
  const { error, value } = schema.validate(req.body, options);
  if (error) {
    next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
  } else {
    req.body = value;
    next();
  }
}

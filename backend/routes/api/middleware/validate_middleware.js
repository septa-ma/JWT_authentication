const { validationResult } = require('express-validator');

const validateRequestSchema = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = []
  errors.array({ onlyFirstError: true }).map(err => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
}

module.exports = {
  validateRequestSchema
}
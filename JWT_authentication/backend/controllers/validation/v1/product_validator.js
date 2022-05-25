const { check } = require('express-validator');
const { validate } = require(`${config.path.middleware}/input_middleware`);

// Nahalito
exports.registerValidationRulesHP = [ 
   validate('first_name,last_name,phone_number,national_code,project_name,code,user_name'), 
   // write the validation for create inputs:
   check('first_name','First Name is required').isString().not().isEmpty(),
   check('last_name','Last Name is required').isString().not().isEmpty(),
   check('phone_number','phone Number is required').isNumeric().isString().not().isEmpty(),
   check('national_code','National code is required').isNumeric().not().isEmpty(),
   check('project_name','Project Name is required').isString().not().isEmpty(), 
   check('code','code is required').isNumeric().not().isEmpty(),         
]



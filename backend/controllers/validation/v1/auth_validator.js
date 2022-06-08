const { check } = require('express-validator');
const { validate } = require(`${config.path.middleware}/input_middleware`);

exports.registerValidation = [ 
   validate('name, family, phone, userName'), 
    // write the validation for create inputs:
   check('name','name is required').isString().not().isEmpty(),
   check('family','family is required').isString().not().isEmpty(),
   check('phone').isNumeric().not().withMessage('phone Number is required').isEmpty().isLength({min: 10, max:11}).withMessage('طول شماره تلفن حداقل 10 رقم می باشد').matches(/^(09|\+639)\d{9}$/).withMessage('شماره اشتباه وارد شده است'),
   check('userName','User Name is required').isString().not().isEmpty(), 
]

exports.loginValidation = [ 
   validate('phone, userName'),
   // write the validation for create inputs:
   check('phone').isNumeric().not().withMessage('phone Number is required').isEmpty().isLength({min: 10, max:11}).withMessage('طول شماره تلفن حداقل 10 رقم می باشد').matches(/^(09|\+639)\d{9}$/).withMessage('شماره اشتباه وارد شده است'),
   check('userName','User Name is required').isString().not().isEmpty(),
]

exports.verifyEmailValidation = [ 
   validate('token'),
   // write the validation for create inputs:
   check('token','Token is required').isString().not().isEmpty(),
]


const { check } = require('express-validator');
const { validate } = require(`${config.path.middleware}/input_middleware`);

exports.registerValidationCodeHP = [ 
   validate('first_name, last_name, phone_number, national_code, project_name, code, user_name, password'), 
    // write the validation for create inputs:
   check('first_name','First Name is required').isString().not().isEmpty(),
   check('last_name','Last Name is required').isString().not().isEmpty(),
   check('phone_number').isNumeric().not().withMessage('phone Number is required').isEmpty().isLength({min: 10, max:11}).withMessage('طول شماره تلفن حداقل 10 رقم می باشد').matches(/^(09|\+639)\d{9}$/).withMessage('شماره اشتباه وارد شده است'),
   check('project_name','Project Name is required').isString().not().isEmpty(), 
   check('code','code is required').isNumeric().not().isEmpty(),         
]

exports.registerValidatioCodeGp = [ 
   validate('first_name, last_name, phone_number, user_name, project_name, code, password'), 
   // write the validation for create inputs:
   check('first_name','First Name is required').isString().not().isEmpty(),
   check('last_name','Last Name is required').isString().not().isEmpty(),
   check('phone_number').isNumeric().not().withMessage('phone Number is required').isEmpty().isLength({min: 10, max:11}).withMessage('طول شماره تلفن  حداقل 10 رقم می باشد').matches(/^(09|\+639)\d{9}$/).withMessage('شماره اشتباه وارد شده است'),
   check('project_name','Project Name is required').isString().not().isEmpty(),  
   check('user_name','User Name is required').isString().not().isEmpty(),
   check('code','code is required').isNumeric().not().isEmpty(),          
]

exports.loginValidationCode = [ 
   validate('phone_number, project_name, code'),
   // write the validation for create inputs:
   check('phone_number').isNumeric().not().withMessage('phone Number is required').isEmpty().isLength({min: 10, max:11}).withMessage('طول شماره تلفن حداقل 10 رقم می باشد').matches(/^(09|\+639)\d{9}$/).withMessage('شماره اشتباه وارد شده است'),
   check('project_name','Project Name is required').isString().not().isEmpty(),
   check('code','code is required').isNumeric().not().isEmpty(),  
]

exports.SMSValidation = [
   validate('phone_number, project_name'),
   // write the validation for update inputs:
   check('phone_number').isNumeric().not().withMessage('phone Number is required').isEmpty().isLength({min: 10, max: 11}).withMessage('طول شماره تلفن حداقل 10 رقم می باشد').matches(/^(09|\+639)\d{9}$/).withMessage('شماره اشتباه وارد شده است'),
   check('project_name','Project Name is required').isString().not().isEmpty()  
]

exports.verifyCodeValidation = [ 
   validate('phone_number, project_name, code'),
   // write the validation for create inputs:
   check('phone_number').isNumeric().not().withMessage('phone Number is required').isEmpty().isLength({min: 10, max:11}).withMessage('طول شماره تلفن حداقل 10 رقم می باشد').matches(/^(09|\+639)\d{9}$/).withMessage('شماره اشتباه وارد شده است'),
   check('project_name','Project Name is required').isString().not().isEmpty(),
   check('code','code is required').isNumeric().not().isEmpty(),   
]

exports.registerValidationHP = [ 
   validate('first_name, last_name, phone_number, national_code, project_name'), 
    // write the validation for create inputs:
   check('first_name','First Name is required').isString().not().isEmpty(),
   check('last_name','Last Name is required').isString().not().isEmpty(),
   check('phone_number').isNumeric().not().withMessage('phone Number is required').isEmpty().isLength({min: 10, max:11}).withMessage('طول شماره تلفن حداقل 10 رقم می باشد').matches(/^(09|\+639)\d{9}$/).withMessage('شماره اشتباه وارد شده است'),
   check('project_name','Project Name is required').isString().not().isEmpty(),  
   check('national_code','National Code is required').isString().not().isEmpty(),       
]

exports.registerValidationGP = [ 
   validate('first_name, last_name, phone_number, project_name, user_name,'), 
    // write the validation for create inputs:
   check('first_name','First Name is required').isString().not().isEmpty(),
   check('last_name','Last Name is required').isString().not().isEmpty(),
   check('phone_number').isNumeric().not().withMessage('phone Number is required').isEmpty().isLength({min: 10, max:11}).withMessage('طول شماره تلفن حداقل 10 رقم می باشد').matches(/^(09|\+639)\d{9}$/).withMessage('شماره اشتباه وارد شده است'),
   check('project_name','Project Name is required').isString().not().isEmpty(), 
   check('user_name','user name is required').isString().not().isEmpty(),       
]

exports.loginValidation = [
   validate('phone_number, project_name'),
   // write the validation for update inputs:
   check('phone_number').isNumeric().not().withMessage('phone Number is required').isEmpty().isLength({min: 10, max: 11}).withMessage('طول شماره تلفن حداقل 10 رقم می باشد').matches(/^(09|\+639)\d{9}$/).withMessage('شماره اشتباه وارد شده است'),
   check('project_name','Project Name is required').isString().not().isEmpty()  
]



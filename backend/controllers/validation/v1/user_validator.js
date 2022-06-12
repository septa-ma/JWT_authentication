const { check } = require('express-validator');
const { validate } = require(`${config.path.middleware}/input_middleware`);

exports.updateValidation =  [ 
    validate('first_name, last_name, userName, phone_number, email'),
    // write the validation for create inputs:
    check('userName','User Name is required').isString().not().isEmpty(),               
] 

exports.simpleValidation =  [ 
    validate('userName'),
    // write the validation for create inputs:
    check('userName','User Name is required').isString().not().isEmpty(),               
]  
    
exports.addLocValidation =  [ 
    validate('userName, detail, locations'),
    // write the validation for create inputs:
    check('userName','User Name is required').isString().not().isEmpty(),               
    check('locations','locations is required').isString().not().isEmpty(),                     
] 

      


  








      
    
 













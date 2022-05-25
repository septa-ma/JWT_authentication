const { check } = require('express-validator');
const { validate } = require(`${config.path.middleware}/input_middleware`);

exports.getInfoUserWithNcodeValidation =  [ 
    validate('national_code'),
    // write the validation for create inputs:
    check('national_code','national code is required').isNumeric().not().isEmpty(),           
]

exports.getOneUserWithQRValidation =  [ 
    validate('QR'),
    // write the validation for create inputs:
    check('QR','QR is required').not().isEmpty(),          
]

exports.updatePerInfoOneUserValidation =  [ 
    validate('QR, first_name, last_name, user_name, phone_number, national_code'),
    // write the validation for create inputs:
    check('QR','QR is required').not().isEmpty(),                 
]

exports.updatePerAndAddInfoOneUserValidation =  [ 
    validate('QR, storeId, first_name, last_name, user_name, phone_number, national_code, city, state, postal_code, detail, locations, email, telphone'),
    // write the validation for create inputs:
    check('QR','QR is required').not().isEmpty(),
    check('storeId','storeId is required').isNumeric().not().isEmpty(),            
]   

exports.destroyValidation =  [ 
    validate('phone_number'),
    // write the validation for create inputs:
    check('phone_number','phone Number is required').isNumeric().not().isEmpty(),            
]  

exports.deleteUserValidation =  [ 
    validate('phone_number'),
    // write the validation for create inputs:
    check('phone_number','phone Number is required').isNumeric().not().isEmpty(),              
]  
    
exports.addAddressesValidation =  [ 
    validate('phone_number, storeId, city, state,postal_code, detail, locations, email, telphone'),
    // write the validation for create inputs:
    check('phone_number','phone Number is required').isNumeric().not().isEmpty(),
    check('storeId','storeId is required').isNumeric().not().isEmpty(),
    check('locations','locations is required').isString().not().isEmpty(),                     
] 
    
exports.updateAddressValidation =  [ 
    validate('QR, storeId, city, state, postal_code, detail, locations, email, telphone'),
    // write the validation for create inputs:
    check('QR','QR is required').not().isEmpty(),  
    check('storeId','storeId is required').isNumeric().not().isEmpty(),                
]  

exports.removeAddressValidation =  [ 
    validate('phone_number, storeId'),
    // write the validation for create inputs:
    check('phone_number','phone Number is required').isNumeric().not().isEmpty(),
    check('storeId','storeId is required').isNumeric().not().isEmpty(),           
]    

      


  








      
    
 













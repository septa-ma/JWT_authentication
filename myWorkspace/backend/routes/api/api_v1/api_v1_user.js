
const express = require('express');
const router = express.Router();

/******************************************************************************/
                                /* MIDDLEWARES */
/*****************************************************************************/
//middlewares
const apiAuth = require('../middleware/api_auth.js');
const { uploadImages } = require('../middleware/multiFileUpload_Middleware');
const { validateRequestSchema } = require('../middleware/validate_middleware');
const inputImagesUser = [{ name: 'personal_pic', maxCount: 1 }, { name: 'birth_certificate', maxCount: 1}, { name: 'national_card', maxCount: 1}, { name: 'uni_certificate', maxCount: 1}]

/*******************************************************************************/
                                /* CONTROLLER */
/*******************************************************************************/
// includes all Controllers
const { api : controllerApi, valid : controllerValid } = config.path.controllers;

// user Controllers
const UserController = require(`${controllerApi}/v1/user_controller`);


/*********************************************************************************************/
                                   /*  validation controllers */
/*********************************************************************************************/
const { getOneUserWithQRValidation, updatePerInfoOneUserValidation,updatePerAndAddInfoOneUserValidation,destroyValidation,deleteUserValidation, addAddressesValidation, updateAddressValidation, removeAddressValidation} = require(`${controllerValid}/v1/user_validator`);

/********************************* USER ROUTE ***************************************/

router.get('/user', apiAuth, UserController.index.bind(UserController));
router.post('/user/image', apiAuth, uploadImages.fields(inputImagesUser), UserController.uploadMultiImage.bind(UserController));
router.post('/userQR', apiAuth, getOneUserWithQRValidation, validateRequestSchema,UserController.getOneUserWithQR.bind(UserController));
router.post('/updateInfoUser', apiAuth, updatePerInfoOneUserValidation, validateRequestSchema,UserController.updatePerInfoOneUser.bind(UserController));
router.post('/updateInfoAndAddUser', apiAuth, updatePerAndAddInfoOneUserValidation,validateRequestSchema,UserController.updatePerAndAddInfoOneUser.bind(UserController));
router.post('/removeUser', apiAuth, destroyValidation,validateRequestSchema,UserController.destroy.bind(UserController));
router.post('/deleteUser', apiAuth, deleteUserValidation, validateRequestSchema,UserController.deleteUser.bind(UserController));
router.post('/addLocationUser', addAddressesValidation, validateRequestSchema ,UserController.addAddresses.bind(UserController)); 
router.post('/updateLocationUser', updateAddressValidation,validateRequestSchema,UserController.updateAddress.bind(UserController)); 
router.delete('/removeLocationUser',removeAddressValidation,validateRequestSchema,UserController.removeAddress.bind(UserController));
router.post('/checkPhoneNumber',UserController.checkPhoneNumber.bind(UserController));  



module.exports = router;

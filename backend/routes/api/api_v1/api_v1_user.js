
const express = require('express');
const router = express.Router();

/******************************************************************************/
                                /* MIDDLEWARES */
/*****************************************************************************/
//middlewares
const apiAuth = require('../middleware/api_auth.js');
const { uploadImage } = require('../middleware/upload_middleware');
const { validateRequestSchema } = require('../middleware/validate_middleware');

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
const { updateValidation, simpleValidation, addLocValidation } = require(`${controllerValid}/v1/user_validator`);

/********************************* USER ROUTE ***************************************/
router.post('/users', UserController.showAll.bind(UserController));
router.post('/user', apiAuth, simpleValidation, validateRequestSchema, UserController.showOne.bind(UserController));
router.post('/delete', apiAuth, simpleValidation,validateRequestSchema, UserController.deleteUser.bind(UserController));
router.post('/update', updateValidation, validateRequestSchema,UserController.updateUser.bind(UserController));
router.post('/user/image', apiAuth, uploadImage.single('image'), UserController.uploadImage.bind(UserController));
// router.post('/location', addLocValidation, validateRequestSchema ,UserController.addLocation.bind(UserController)); 

module.exports = router;

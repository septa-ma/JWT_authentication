const express = require('express');
const router = express.Router();


/******************************************************************************/
                                /* MIDDLEWARES */
/*****************************************************************************/
const { validateRequestSchema } = require('../middleware/validate_middleware');


/*******************************************************************************/
                                /* AUTH CONTROLLER */
/*******************************************************************************/
const { api : controllerApi, valid : controllerValid } = config.path.controllers;


/*******************************************************************************/
                                /* AUTH CONTROLLER */
/*******************************************************************************/

// const AuthLoginController = require(`${controllerApi}/v1/Authentication/auth_login_controller`);
const AuthRegisterController = require(`${controllerApi}/v1/Authentication/auth_register_controller`);

/*********************************************************************************************/
                                   /*  validation controllers */
/*********************************************************************************************/
       
const { registerValidation, /*verifyEmailValidation, loginValidation */} = require(`${controllerValid}/v1/auth_validator`);

/********************************* AUTH route ***************************************/

// router.post('/login', loginValidation,validateRequestSchema, AuthLoginController.login.bind(AuthLoginController));
router.post('/register', registerValidation,validateRequestSchema, AuthRegisterController.register.bind(AuthRegisterController)); 
// router.post('/verify', verifyEmailValidation,validateRequestSchema, AuthRegisterController.verify.bind(AuthRegisterController));

module.exports = router;

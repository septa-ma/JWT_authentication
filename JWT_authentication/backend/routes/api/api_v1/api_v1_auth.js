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

const AuthLoginController = require(`${controllerApi}/v1/Authentication/auth_login_controller`);
const AuthLoginWithCodeController = require(`${controllerApi}/v1/Authentication/auth_login_with_code_controller`);
const AuthRegisterController = require(`${controllerApi}/v1/Authentication/auth_register_controller`);
const AuthRegisterWithCodeController = require(`${controllerApi}/v1/Authentication/auth_register_with_code_controller`);

/*********************************************************************************************/
                                   /*  validation controllers */
/*********************************************************************************************/
       
const { registerValidationCodeHP, registerValidatioCodeGp, loginValidationCode, registerValidationHP, registerValidationGP, loginValidation } = require(`${controllerValid}/v1/auth_validator`);


/********************************* AUTH route ***************************************/

router.post('/login', loginValidation,validateRequestSchema, AuthLoginController.login.bind(AuthLoginController)); // hp-app, nahalito, hp-web, gargot-app use this.
router.post('/registerHP', registerValidationHP,validateRequestSchema, AuthRegisterController.registerHP.bind(AuthRegisterController)); // hp-app, hp-web use this cause need national-code for registering.
router.post('/register', registerValidationGP,validateRequestSchema, AuthRegisterController.register.bind(AuthRegisterController)); // nahalito, gargot-app use this cause need user-name for registering.



module.exports = router;

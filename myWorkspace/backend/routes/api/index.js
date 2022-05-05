const express = require('express');
const router = express.Router();

// routes
const api_v1_auth = require('./api_v1/api_v1_auth');
const api_v1_user = require('./api_v1/api_v1_user');

router.use('/v1', api_v1_auth);
router.use('/v1', api_v1_user);

module.exports = router;
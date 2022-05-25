const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.json('wellcome to home page');
});

router.get('/about', (req, res) => {
    res.json('wellcome to about page');
});

module.exports = router;
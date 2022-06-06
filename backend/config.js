const path = require('path');

module.exports = {
    secret : 'majkhfjkshdkjf@#$%jhkjshkd)(*)((*^*&%&^#!#@!#@$dsgsy54654dsg6sdfgdsf4g56df4g6df4%$&%*^&#$%#',
    path : {
        controllers : { 
            api : path.resolve('./backend/controllers/api'),
            web : path.resolve('./backend/controllers/web'),
            valid : path.resolve('./backend/controllers/validation')
        },
        model : path.resolve('./backend/models/v1'),
        controller : path.resolve('./backend/controllers'),
        transform : path.resolve('./backend/transforms/v1'),
        middleware : path.resolve('./backend/routes/api/middleware'),
        config : path.resolve('./backend/configs')
    }
} 
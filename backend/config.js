const path = require('path');

module.exports = {
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
        utils : path.resolve('./backend/utils')
    }
} 
const jwt = require('jsonwebtoken');
const user = require(`${config.path.model}/user`);

module.exports = (req, res, next) => {
    let token = req.body.token || req.query.token || req.headers['x-access-token'];
    // console.log(token);
    if(token) {
        return jwt.verify(token, config.secret, (err, decoded) => {
            if(err) {
                return res.json({
                    success: false,
                    data: 'Failed to authentication token.'
                })
            }
            user.findById(decoded.user_id, (err, user) => {
                if(err) throw err;
                if(user) {
                    // console.log(user);
                    user.token = token;
                    req.user = user;
                    next();
                } else {
                    return res.json({
                        success: false,
                        data: 'user not found'
                    });
                }
            })
        })
    }
    return res.status(403).json({
        data: 'no token available',
        success: false
    })
}
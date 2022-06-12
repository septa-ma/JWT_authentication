const transform = require('../transform');
const jwt = require('jsonwebtoken');
const qr = require('qrcode');

module.exports = class UserAuthTransform extends transform {

    transform(item, createToken = false) {
        this.createToken = createToken;

        // generating QRCode for a user.
        const QRCode =  qr.toString(JSON.stringify(item.email), function (err, code) {
            if(err) return console.log("error occurred")
            return code;
        })

        return {
            'full name': item.first_name + " " + item.last_name,
            'user name': item.email,
            'phone number': item.phone_number,
            'QRCode': QRCode,   
            ...this.withToken(item)
        }
    }
    
    withToken(item){

        if(item.token){
            return { token : item.token }
        }

        if(this.createToken) {
            let token = jwt.sign({user_id : item._id}, process.env.USER_LOGIN_SECRET, {
                expiresIn: '7d',
                algorithm: 'HS512'
            });
            return {token}
        }
        return {};
    }

}

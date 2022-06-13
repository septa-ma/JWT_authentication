const transform = require('../transform');
const jwt = require('jsonwebtoken');
const qr = require('qrcode');

module.exports = class UserTransform extends transform {

    user(item) {
        // generating QRCode for a user.
        const QRCode =  qr.toString(JSON.stringify(item.email), function (err, code) {
            if(err) return console.log("error occurred")
            return code;
        })
        return {
            'full name': item.first_name + " " + item.last_name,
            'user name': item.email,
            'phone number': item.phone_number,
            'location': item.location,
            'location detail': item.address,
            'QR code': QRCode
        }
    }

    users(item) {
        let UserList = []; // when can initialize variable use const
        for(var i=0; i < item.length; i++){
            const userList = [{
                'full name': item[i].first_name + " " + item[i].last_name,
                'user name': item[i].email,
                'location': item[i].location,
                'phone number': item[i].phone_number
            }];
            UserList = UserList.concat(userList); 
        }
        return UserList;
    }

}

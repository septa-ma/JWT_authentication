const transform = require('./../transform');
const jwt = require('jsonwebtoken');

module.exports = class UserTransform extends transform {

    transform(item, createToken = false) {
        this.createToken = createToken;
        return {
            'QR': item.qrcode,
            'first_name': item.personal_info.first_name,
            'last_name': item.personal_info.last_name,
            'user_name': item.personal_info.user_name,
            'phone_number': item.address_info.phone_number,   
            ...this.withToken(item)
        }
    }

    infoPersonalUser(item) {
        let UserList = []; // when can initialize variable use const
        for(var i=0; i < item.length; i++){
            const userList = [{
                'QR': item[i].qrcode,
                'first_name': item[i].personal_info.first_name,
                'last_name': item[i].personal_info.last_name,
                'user_name': item[i].personal_info.user_name,
                'national_code:': item[i].personal_info.national_code,
                'phone_number': item[i].address_info.phone_number,
            }];
            UserList = UserList.concat(userList); 
            // console.log(reqList);
        }
        return UserList;
    }

    infoPersonalUsers(item) {
        let userList = []; // when can initialize variable use const
        for(var i=0; i < item.length; i++){
            const userList = [{
                'fullName': item[i].personal_info.first_name + ' ' + item[i].personal_info.last_name, 
            }];
            userList = userList.concat(userList); 
            // console.log(reqList);
        }
        return userList;
    }
    
    withToken(item){

        if(item.token){
            return { token : item.token }
        }

        if(this.createToken) {

            let token = jwt.sign({user_id : item._id}, config.secret, {
                expiresIn: '672h',
                algorithm: 'HS512'
            });

            return {token}
        }
        return {};
    }

}

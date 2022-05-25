const controller = require(`${config.path.controller}/controller`);
const userTransform = require(`${config.path.transform}/user_transform`);
const bcrypt = require('bcryptjs');
const rsa = require('node-rsa');

module.exports = new class AuthLoginController extends controller {
    async login (req, res) {
        const { phone_number, code, project_name } = req.body;
        const userFilter = { 'personal_info.phone_number': phone_number };
        if ( project_name == 'my_workspace' ) {            
            const user = await this.model.user.findOne(userFilter);
            if (user == null) {
                return res.status(422).json({
                    data : 'اطلاعات وارد شده صحیح نیست',
                    success : false
                });
            } else {
                const newDate =  new Date();
                const oldDate =  user.verifyCode.createdAt;    
                const secondBetweenTwoDate = (newDate - oldDate) / 60000;
                const correntCode = user.verifyCode.code;  
                const cCode = correntCode != code; // correntCodeCon     
                const cTime = secondBetweenTwoDate > 2; // correntTimeCon
                if ((cCode == 1 && cTime == 1) || (cCode == 0 && cTime == 1) || (cCode == 1 && cTime == 0)) {
                    return res.status(422).json({
                        data : 'به دلیل اشتباه بودن کد یا اتمام زمان ارسال کد نا موفق بود ',
                        success : false
                    });              
                } else {
                    res.json({
                        data : new userTransform().transform(user, true),
                        success : true
                    }); 
                }
            }                     
        } else {
            res.json({
                data : 'wrong project!',
                success : false
            })
        }
    }
}


const controller = require(`${config.path.controller}/controller`);
const userTransform = require(`${config.path.transform}/user_transform`);
const bcrypt = require('bcryptjs');
const rsa = require('node-rsa');
const axios = require('axios');


module.exports = new class AuthLoginController extends controller {
    
    async sendloginCode (req, res){
        const { phone_number, project_name } = req.body;
        
        if( (phone_number === null || project_name === null) /*|| (phone_number == undefined || project_name == undefined)*/ ) {
            res.json({
                data : 'check your inputs.',
                success : false
            })            
        } else if(( (project_name == 'gargot_web') || (project_name == 'gargot_app')  || (project_name == 'HP_app') || (project_name == 'HP_web') )) {  
            
            this.model.user.findOne({ 'personal_info.phone_number': phone_number } , (err, user) => {
                // console.log(user)
                if (err) throw err;
                if (user == null) {
                    return res.status(422).json({
                        data : 'اطلاعات وارد شده صحیح نیست',
                        success : false
                    });
                } else {  
                    const randomCode = Math.floor(Math.random()*(10000000 - 100000) + 100000);
                    const time = new Date(); 
                    user.verifyCode.code = randomCode;
                    user.verifyCode.createdAt = time;
                    user.save(function(saveerr, saveresult) {
                        if (!saveerr) {
                            axios.post(`https://api.kavenegar.com/v1/687176565938433253777741444C77455276326A5457307A6F46697A324F712B3353704249674E6B5239733D/verify/lookup`,{}, {
                                params: {
                                receptor: phone_number,
                                token: randomCode,
                                template:'userlogin',
                        }}).then(resp => resp.data);
                    res.json({
                       success : "کد ارسال شد"
                    }); 
                        } else {
                          res.status(400).send(saveerr.message);
                        }
                    });

                }
            })
        } else {
            res.json({
                data : 'wrong project!',
                success : false
            })
        }
    }


    async login (req, res) {
        const { phone_number, code, project_name } = req.body;
        const userFilter = { 'personal_info.phone_number': phone_number };
        
        if( (phone_number === null || project_name === null) /*|| (phone_number == undefined || project_name == undefined)*/ ) {
            res.json({
                data : 'check your inputs.',
                success : false
            })            
        } else if(( (project_name == 'gargot_web') || (project_name == 'gargot_app')  || (project_name == 'HP_app') || (project_name == 'HP_web') )) {  
            
            this.model.user.findOne(userFilter , async (err, user) => {
                // console.log(user)
                if (err) throw err;
                if (user == null) {
                    return res.status(422).json({
                        data : 'اطلاعات وارد شده صحیح نیست',
                        success : false
                    });
                } else  {
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
            })                            
       } else {
            res.json({
                data : 'wrong project!',
                success : false
            })
        }
    }

}


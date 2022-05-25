const controller = require(`${config.path.controller}/controller`);
const bcrypt = require('bcryptjs');
const rsa = require('node-rsa');
const axios = require('axios');
const cronJob = require(`${config.path.controllers.cronjob}/cron_job`);

// const qs = require('qs');

module.exports = new class AuthRegisterController extends controller {
    
    async sendRegisterCode (req, res) {
        const { phone_number, project_name } = req.body;
        const userFilter = {'personal_info.phone_number': phone_number};
        
        if( (phone_number === null || project_name === null) /*|| (phone_number == undefined || project_name == undefined)*/ ) {
            return res.json({
                data : 'check your inputs.',
                success : false
            })
            
        } else if(( (project_name == 'gargot_web') || (project_name == 'gargot_app')  || (project_name == 'HP_app') || (project_name == 'HP_web') || (project_name == 'Nahalito'))) {        
            // check unique value phoneNumber
            const phoneNumberExists = await this.model.user.findOne(userFilter);
                if (phoneNumberExists) {
                    return res
                        .status(400)
                        .json({ message: 'A User is available with this phoneNumber' }); 
                }  
            // send random Code for verify Phone 
            const randomCode = Math.floor(Math.random()*(1000000 - 10000) + 10000);
            const time = new Date(); 


            //delete One User After 1 minute
            new cronJob().cronDeleteUser();
        
            // register user
            let register = new this.model.user({
                qrcode : phone_number, 
                verifyCode : {
                    code : randomCode,
                    time : time   
                },
                delete_key : 12,
                personal_info:{
                    phone_number : phone_number,
                }
                }).save (err => {
                    if(err) throw err;
                    axios.post(`https://api.kavenegar.com/v1/687176565938433253777741444C77455276326A5457307A6F46697A324F712B3353704249674E6B5239733D/verify/lookup`,{}, {
                        params: {
                          receptor: phone_number,
                           token: randomCode,
                           template:'userlogin',
   
                            }})
                         .then(resp => resp.data);
   
                       res.json({
                           success : "کد ارسال شد"
                       }); 
                });      
           
        } else {
          return  res.json({
                data : 'wrong project!',
                success : false
            })
        }
    // })
    }
    
    async registerHP(req, res){
        const { project_name, first_name, last_name, phone_number, national_code , code} = req.body;
        const userFilter = { 'personal_info.phone_number': phone_number , 'delete_key' : 12};
        let pass;
        let proType;

        if(( (project_name == 'HP_app') || (project_name == 'HP_web') )) {  
            
                this.model.user.findOne(userFilter , async (err, user) => {
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
                            data : 'به دلیل اشتباه بودن کد یا اتمام زمان ثبت نام نا موفق بود ',
                            success : false
                        });
                
                    } else {
                        
                        const salt = await bcrypt.genSalt(10);
            
                        if(national_code != null){
                            pass = await bcrypt.hash(national_code, salt);
                        } else {
                            pass = await bcrypt.hash(user_name, salt);
                        }
                        // make pair key for wallet.
                        var testKey = await bcrypt.hash(phone_number, salt);
                        var publicKey =  testKey.slice(0,32); // key.exportKey("public");
                        var privateKey =  testKey; // key.exportKey("private");
                
                        // make new wallet
                        var contName = 'هرمز پی';
                        var walletDoc = {
                            walletKey: privateKey,
                            contract_name: contName,
                            wallet_type: 'user',
                            user_contract_credit: 0
                        };
                                
                        // checking project name and set a code for.
                        if(project_name == 'HP_app'){
                            proType = 8161;
                        } else if (project_name == 'HP_web') {
                            proType = 81623;
                        } else if (project_name == 'HP_admin') {
                            proType = 81614;
                        } else {
                            res.json({
                                data : 'wrong project!',
                                success : false
                            })
                        }    
                        user.qrcode = publicKey;  
                        user.delete_key = 10; 
                        user.personal_info = {
                             phone_number : phone_number,
                             first_name : first_name,
                             last_name : last_name,
                             national_code : national_code,
                             password : pass ,
                             project_type : proType
                        }
                        user.save(err => {
                            if(err) throw err;
                            setTimeout(() => {  
                                // make wallet - new wallet
                                axios.post('https://fazaarz.ir/wallet/create', walletDoc)
                                .then((response) => {
                                    console.log(response.data);
                                    console.log('test register from : '+project_name);
                                    return res.status(200).json({
                                        data : 'succesfully registered.',
                                        success : true
                                    });
                                });
                            }, 2000);
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


    async registerGargot(req, res){
    
    
        const { project_name, first_name, last_name, phone_number, user_name , code} = req.body;
        const userFilter = { 'personal_info.phone_number': phone_number , 'delete_key' : 12};
        let pass;
        let proType;

        if(( (project_name == 'gargot_app') || (project_name == 'gargot_web') )) {  
            
            this.model.user.findOne(userFilter , async (err, user) => {
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
                            data : 'به دلیل اشتباه بودن کد یا اتمام زمان ثبت نام نا موفق بود ',
                            success : false
                        });
                
                    } else {
                        
                        const salt = await bcrypt.genSalt(10);
            
                        if(user_name != null){
                            pass = await bcrypt.hash(user_name, salt);
                        }
                        // make pair key for wallet.
                        var testKey = await bcrypt.hash(phone_number, salt);
                        var publicKey =  testKey.slice(0,32); // key.exportKey("public");
                        var privateKey =  testKey; // key.exportKey("private");
                
                        // make new wallet
                        var contName = 'هرمز پی';
                        var walletDoc = {
                            walletKey: privateKey,
                            contract_name: contName,
                            wallet_type: 'user',
                            user_contract_credit: 0
                        };
                                
                       // checking project name and set a code for.
                        if (project_name == 'gargot_app') {
                             proType = 77;
                        } else if (project_name == 'gargot_web') {
                                proType = 723;
                        } else {
                                res.json({
                                    data : 'wrong project!',
                                    success : false
                            })
                        }
                        user.qrcode = publicKey;  
                        user.delete_key = 10; 
                        user.personal_info = {
                            phone_number : phone_number,
                            first_name : first_name,
                            last_name : last_name,
                            user_name : user_name,
                            password : pass ,
                            project_type : proType
                        }
                        user.save(err => {
                            if(err) throw err;
                            setTimeout(() => {  
                                // make wallet - new wallet
                                axios.post('https://fazaarz.ir/wallet/create', walletDoc)
                                .then((response) => {
                                    console.log(response.data);
                                    console.log('test register from : '+project_name);
                                    return res.status(200).json({
                                        data : 'succesfully registered.',
                                        success : true
                                    });
                                });
                            }, 2000);
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


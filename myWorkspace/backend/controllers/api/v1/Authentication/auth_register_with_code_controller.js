const controller = require(`${config.path.controller}/controller`);
const bcrypt = require('bcryptjs');
const rsa = require('node-rsa');
const axios = require('axios');
// const qs = require('qs');

module.exports = new class AuthRegisterController extends controller {
        
    async registerHP(req, res){
        const { project_name, first_name, last_name, phone_number, national_code , code} = req.body;
        const existUserFilter = { 'personal_info.phone_number': phone_number , 'delete_key' : 10, 'personal_info.national_code':national_code };            
        const userFilter = { 'personal_info.phone_number': phone_number , 'delete_key' : 12};   
        let pass;
        let proType;

        if(( (project_name == 'HP_app') || (project_name == 'HP_web') || (project_name == 'nahalito_app') )) {  
            // Check available user information 
            const existUser = await this.model.user.findOne(existUserFilter);
            if (existUser) {
                return res.status(400).json({ message: 'قبلا اطلاعات شما ثبت شده است' });
            }
            // find user
            let user = await this.model.user.findOne(userFilter);
            // Not find user
            if (!user) {
                return res.status(422).json({
                    data : 'کاربری یافت نشد',
                    success : false
                });
            }      
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
            }              
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
            }else if (project_name == 'nahalito_app') {
                proType = 1401;
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
            let register = await user.save(err => {
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
        } else {
            res.json({
                data : 'wrong project!',
                success : false
            })
        }
    }

    async registerGargot(req, res){
        const {project_name, first_name, last_name, phone_number, user_name, code} = req.body;
        const existUserFilter = {'personal_info.phone_number': phone_number, 'delete_key' : 10, 'personal_info.user_name':user_name};            
        const userFilter = {'personal_info.phone_number': phone_number, 'delete_key' : 12};
        const userNameFilter = {'personal_info.user_name': user_name };       
        let pass;
        let proType;
        if(( (project_name == 'gargot_app') || (project_name == 'gargot_web') )) {  
            // Check available user information 
            const existUser = await this.model.user.findOne(existUserFilter);
            if ( existUser) {
                return res.status(400).json({ message: 'قبلا اطلاعات شما ثبت شده است' });
            }
            //unique username
            const existUserName = await this.model.user.findOne(userNameFilter);
            if (existUserName) {
                return res.status(400).json({ message: 'نام کاربری تکراری میباشد' });
            }
            // find user
            let user = await this.model.user.findOne(userFilter);
            // Not find user
            if (!user) {
                return res.status(422).json({
                    data : 'کاربری یافت نشد',
                    success : false
                });
            }                
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
            }              
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
            let register = await user.save(err => {
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
        } else {
            res.json({
                data : 'wrong project!',
                success : false
            })
        }
    }
}


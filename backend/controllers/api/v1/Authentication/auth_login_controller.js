const controller = require(`${config.path.controller}/controller`);
const userTransform = require(`${config.path.transform}/user_transform`);
const bcrypt = require('bcrypt');
const rsa = require('node-rsa');
const axios = require('axios');
const nodemailer = require('nodemailer');

module.exports = new class AuthLoginController extends controller {
    
    login(req, res){
        const { phone, userName } = req.body;

        if( (phone_number === null || project_name === null) /*|| (phone_number == undefined || project_name == undefined)*/ ) {
            res.json({
                data : 'check your inputs.',
                success : false
            })
        } else if(( (project_name == 'gargot_web') || (project_name == 'gargot_app')  || (project_name == 'HP_app') || (project_name == 'HP_web') )) {  
            
            this.model.user.findOne({ 'address_info.phone_number': phone_number }/*.populate('organ_id')*/ , (err, user) => {
                if (err) throw err;
                if (user == null) {
                    return res.status(422).json({
                        data : 'اطلاعات وارد شده صحیح نیست',
                        success : false
                    });
                } else {  
                    console.log('test login from : '+project_name+', at: '+Date.now());
                    res.json({
                        data : new userTransform().transform(user, true),
                        success : true
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
    
}
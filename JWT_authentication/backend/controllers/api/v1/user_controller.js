const controller = require(`${config.path.controller}/controller`);
const userTransform = require(`${config.path.transform}/user_transform`);


module.exports = new class UserController extends controller {

    async index(req, res) {
        const user = await this.model.user.find({});
        return res.status(200).json({
            data: new userTransform().infoPersonalUser(user),
            success: true
        })
    }

    uploadImage(req, res) {

        const { project_name } = req.body;

        if ( project_name == 'my_workspace' ) {
            
            if (req.file) {
                return res.json({
                    msgEn: 'successfully uploaded',
                    msgFa: 'با موفقیت آپلود شد',
                    data: {
                        imagePath: 'http://localhost:3000/'+req.file.path.replace(/\\/g, '/')
                    },
                    success: true
                })
            } else {
                return res.json ({
                    msgEn: 'unsuccessful',
                    msgFa: 'آپلود ناموفق',
                    success: false
                })
            }
        } else {
            return res.status(422).json({
                msgEn: 'wrong project!',
                msgFa: 'نام پروژه اشتباه است',
                success: false
            });
        }    
    }

    uploadMultiImage(req, res) {  

        const { phone_number, project_name } = req.body;

        if ( project_name == 'my_workspace' ) {       

            const intPhoneNumber = +phone_number;
            const userFilter ={ $or:[{"personal_info.phone_number": phone_number},{'address_info': {"$elemMatch": {'phone_number':intPhoneNumber}} }] }

            this.model.user.findOneAndUpdate(userFilter, { $push: { pictures_info : {
                personal_pic: req.files.personal_pic[0].path,
                birth_certificate: req.files.birth_certificate[0].path,
                national_card: req.files.national_card[0].path,
                uni_certificate: req.files.uni_certificate[0].path
            }
            }} ,(err, user) => {
                if(err) throw err;
                if (user) {
                    return res.status(200).json({
                        msgEn: 'successfully uploaded',
                        msgFa: 'با موفقیت آپلود شد',
                        data: {
                            personal_pic: 'http://localhost:3000/'+req.files.personal_pic[0].path.replace(/\\/g, '/'),
                            birth_certificate: 'http://localhost:3000/'+req.files.birth_certificate[0].path.replace(/\\/g, '/'),
                            national_card: 'http://localhost:3000/'+req.files.national_card[0].path.replace(/\\/g, '/'),
                            uni_certificate: 'http://localhost:3000/'+req.files.uni_certificate[0].path.replace(/\\/g, '/'),
                        },
                        success: true
                    })
                } else {
                    return res.status(404).json({
                        msgEn: 'user not found!',
                        msgFa: 'کاربر پیدا نشد',
                        success: false
                    })
                }
            });
        } else {
            return res.status(422).json({
                msgEn: 'wrong project!',
                msgFa: 'نام پروژه اشتباه است',
                success: false
            });
        }
       
    }

    // update personal_info user
    async updatePerInfoOneUser(req, res) {

        const { QR, project_name } = req.body;

        if ( project_name == 'my_workspace' ) {

            const userFilter = { 'qrcode': QR };
            const temp = req.body;
            let updateParams = {};
            let key
            // dynamic object attribute in personal information
            for(key in temp) {
                if(temp[key] != "undefined") {
                    updateParams[`personal_info.${key}`] = temp[key];
                } 
            }      
            // update  
            this.model.user.findOneAndUpdate(userFilter, { $set: updateParams }, (err,user) => {
                if (err) {
                    res.status(400).send(err.message);
                };
                if (user) {
                    user.personal_info = req.body;
                    return res.status(200).json({
                        msgEn: 'updated successfully',
                        msgFa: 'بروزرسانی انجام شد',
                        success: true
                    })
                } else {
                    return res.status(404).json({
                        msgEn: 'user not found!',
                        msgFa: 'کاربر پیدا نشد',
                        success: false
                    })
                }
            });
        } else {
            return res.status(422).json({
                msgEn: 'wrong project!',
                msgFa: 'نام پروژه اشتباه است',
                success: false
            });
        }
    }

    // update personal_info and address_info one user
    async updatePerAndAddInfoOneUser(req, res) {

        const { QR, storeId, project_name } = req.body;

        if ( project_name == 'my_workspace' ) {

            const userFilter = { "qrcode": QR , "address_info.store_id": storeId }
            const temp = req.body;
            let updateParams = {};
            let key
            // dynamic object attribute in personal information
            for(key in temp) {
                if(temp[key] != "undefined"){
                    updateParams[`personal_info.${key}`] = temp[key];
                } 
            }
            // dynamic object attribute in address information 
            for(key in temp) {
                if(temp[key] != "undefined"){
                    updateParams[`address_info.$.${key}`] = temp[key];
                } 
            }    
            //update
            this.model.user.findOneAndUpdate(userFilter, { $set: updateParams }, (err,user)=>{
                if(err) {
                    res.status(400).send(err.message);
                };
                if (user) {
                    user.personal_info = req.body
                    return res.status(200).json ({
                        msgEn: 'updated successfully.',
                        msgFa: 'برروزرسانی انجام شد',
                        success: true
                    })
                } else {
                    return res.status(404).json({
                        msgEn: 'user not found!',
                        msgFa: 'کاربر پیدا نشد',
                        success: false
                    })
                }
            });
        } else {
            return res.status(422).json({
                msgEn: 'wrong project!',
                msgFa: 'نام پروژه اشتباه است',
                success: false
            });
        }    
    }

    //delete one user
    destroy (req, res) {

        const { phone_number, project_name } = req.body;

        if ( project_name == 'my_workspace' ) {   

            const intPhoneNumber = +phone_number;
            const userFilter ={ $or:[{"personal_info.phone_number": phone_number},{'address_info': {"$elemMatch": {'phone_number':intPhoneNumber}} }] }
            // find by phone#
            this.model.user.findOne(userFilter, (err, user) => {
                // console.log(user)
                if (err) throw err;
                if (user) {
                    const userId = user._id;
                    this.model.user.findById(userId, (err, user) => {
                        if (err) throw err;
                        user.remove();
                        return res.status(200).json ({
                            msgEn: 'successfully removed',
                            msgFa: 'کاربر حذف شد',
                            success: true
                        })
                    });
                } else {
                    return res.status(404).json({
                        msgEn: 'user not found!',
                        msgFa: 'کاربر پیدا نشد',
                        success: false
                    })
                }
            });
        } else {
            return res.status(404).json({
                msgEn: 'user not found!',
                msgFa: 'کاربر پیدا نشد',
                success: false
            })
        }     
    }

    async deleteUser (req, res) {

        const { phone_number, project_name } = req.body;

        if ( project_name == 'my_workspace' ) {   

            const intPhoneNumber = +phone_number;
            const userFilter ={ $or:[{'personal_info.phone_number': phone_number, "delete_key": 10},{'address_info': {"$elemMatch": {'phone_number':intPhoneNumber}} }] }
            const updateData = { 'delete_key': 11}

            this.model.user.findOneAndUpdate(userFilter, updateData, async (err, user) => {                
                if (err) throw err;
                if ( user ) {
                    var userId = user._id;
                    await this.model.organ.updateMany(
                        { "user_id": userId },
                        { "$pull": { "user_id": userId } },
                    );
                    return res.status(200).json ({
                        msgEn: 'successfully deleted',
                        msgFa: 'کاربر حذف شد',
                        success: true
                    }) 
                } else {
                    return res.status(404).json({
                        msgEn: 'user not found!',
                        msgFa: 'کاربر پیدا نشد',
                        success: false
                    })
                } 
            }); 
        } else {
            return res.status(404).json({
                msgEn: 'user not found!',
                msgFa: 'کاربر پیدا نشد',
                success: false
            })
        }   
    } 

    // get all users QRs
    getAllQRs (req, res){
        let QRsList = [];
        this.model.user.find({}, (err, users) => {
            if (err) throw err;
            for(var i =0; i < users.length; i++){
                const QRs = [{
                    'id': i+1,
                    'QR': users[i].qrcode,
                    'name': users[i].personal_info,
                    'type': 'user'
                }];
                QRsList = QRsList.concat(QRs);
            }
            return res.json(QRsList);
        });
    }
    
    //insert Address
    async addAddresses  (req, res) {

        const { phone_number, project_name, locations, city, state, detail, email, postal_code, telphone } = req.body;

        if ( project_name == 'my_workspace' ) {

            const intPhoneNumber = +phone_number;
            const userFilter ={ $or:[{"personal_info.phone_number": phone_number, delete_key: 10},{'address_info': {"$elemMatch": {'phone_number':intPhoneNumber}} }] }
            // check unique locations
            const currentLocation = await this.model.user.findOne({ 'address_info.locations': locations });
            if (currentLocation) {
                return res.status(400).json({ message: 'A address is available with this locations' });
            }        
            //find and update  
            let user = await this.model.user.findOne(userFilter)
            if (!user){
                return res.status(404).json({
                    msgEn: 'user not found!',
                    msgFa: 'کاربر پیدا نشد',
                    success: false
                })
            }
            // 
            let store_ids = [];
            for(var i = 0; i < user.address_info.length ; i++) {
                store_ids.push(user.address_info[i].store_id)
            }
            var max = Math.max(...store_ids);
            var store_id = 0;
            if (user.address_info.length === 0) {
                store_id = user.address_info.length + 1; 
            } else {
                store_id = max + 1;
            }
            user.address_info.push({
                store_id: store_id,
                city: city,
                state: state,
                detail: detail,
                locations: locations,
                postal_code: postal_code,
                email: email,
                telphone: telphone
            });
            user.markModified('address_info'); 
            user.save(function(err, result) {
                if (!err) {
                    return res.status(200).json({
                        msgEn: 'inserted Address',
                        msgFa: 'آدرس جدید اضافه شد',
                        success: true
                    }) 
                } else {
                    res.status(400).send(err.message);
                }
            }); 
        } else {
            return res.status(404).json({
                msgEn: 'user not found!',
                msgFa: 'کاربر پیدا نشد',
                success: false
            })
        }                             
    }

    //update Address 
    updateAddress (req, res) {
        
        const { QR, storeId, project_name } = req.body;

        if ( project_name == 'my_workspace' ) {

            const userFilter = {"qrcode": QR , "address_info.store_id": storeId};
            const temp = req.body;
            let updateParams = {};
            let key
            // dynamic object attribute in address information 
            for(key in temp) {
                if(temp[key] != "undefined"){
                    updateParams[`address_info.$.${key}`] = temp[key];
                } 
            }
            //update                  
            this.model.user.findOneAndUpdate(userFilter, { $set : updateParams }, (err,user)=>{
                if (err) {
                    res.status(400).send(err.message);
                }
                if (user) {
                    user.personal_info = req.body
                    return res.status(200).json ({
                        msgEn: 'updated successfully.',
                        msgFa: 'بروزرسانی با موفقیت انجام شد',
                        success: true
                    })
                } else {
                    return res.status(404).json({
                        msgEn: 'user not found!',
                        msgFa: 'کاربر پیدا نشد',
                        success: false
                    })
                }
            });
        } else {
            return res.status(404).json({
                msgEn: 'user not found!',
                msgFa: 'کاربر پیدا نشد',
                success: false
            })
        }   
    };

    removeAddress (req, res) {

        const { project_name, phone_number, storeId } = req.body;

        if ( project_name == 'my_workspace' ) {

            const intPhoneNumber = +phone_number;
            const userFilter ={ $or:[{"personal_info.phone_number": phone_number},{'address_info': {"$elemMatch": {'phone_number':intPhoneNumber}} }] }

            this.model.user.findOne(userFilter, function(err, user) {
                if (!err) {
                    if (!user){
                        return res.status(404).json({
                            msgEn: 'user not found!',
                            msgFa: 'کاربر پیدا نشد',
                            success: false
                        })
                    } else {
                        const addrUpd= result.address_info.findIndex(f => f.store_id == storeId)  ////find index array location 
                        user.address_info.splice(addrUpd , 1)
                        user.save( function (err) {
                            if (!err) {
                                return res.json ({
                                    msgEn: "deleted address successfully",
                                    msgFa: 'آدرس با موفقیت حذف شد',
                                    success: true
                                })
                            } else {
                                res.status(400).send(err.message);
                            }
                        });
                    }
                } else {
                    res.status(400).send(err.message);
                }          
            }); 
        } else {
            return res.status(404).json({
                msgEn: 'user not found!',
                msgFa: 'کاربر پیدا نشد',
                success: false
            })
        }        
    }  
    
    async checkPhoneNumber (req, res) {

        const { phone_number, project_name } = req.body;

        if ( project_name == 'my_workspace' ) {

            const intPhoneNumber = +phone_number;
            const userFilter ={ $or:[{"personal_info.phone_number": phone_number},{'address_info': {"$elemMatch": {'phone_number':intPhoneNumber}} }] }

            const user = await this.model.user.find(userFilter);
            if (!user) {
                return res.status(404).json({
                    msgEn: 'user not found!',
                    msgFa: 'کاربر پیدا نشد',
                    success: false
                })
            } else {
                return res.status(200).json({
                    data: new userTransform().infoPersonalUsers(user),
                    msgFa: 'این کاربر موجود می باشد',
                    success: true
                })
            }
        } else {
            return res.status(404).json({
                msgEn: 'user not found!',
                msgFa: 'کاربر پیدا نشد',
                success: false
            })
        } 
    }  
}







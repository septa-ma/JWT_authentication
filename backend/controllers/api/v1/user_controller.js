const controller = require(`${config.path.controller}/controller`);
const userTransform = require(`${config.path.transform}/user_transform`);

module.exports = new class UserController extends controller {

    async showAll(req, res) {
        const user = await this.model.user.find({});
        return res.status(200).json({
            data: new userTransform().users(user),
            success: true
        })
    }

    async showOne(req, res) {
        const { userName } = req.body;
        const userFilter = { 'email': userName };

        const user = await this.model.user.findOne(userFilter);
        if (!user) {
            return res.status(404).json({
                msgEn: 'user not found!',
                msgFa: 'کاربر پیدا نشد',
                success: false
            })
        }
        return res.status(200).json({
            data: new userTransform().user(user),
            success: true
        })
    }

    //delete one user
    async deleteUser (req, res) {

        const { userName } = req.body;
        const userFilter = { "email": userName }

        const user = await this.model.user.findOne(userFilter);
        if (!user) {
            return res.status(404).json({
                msgEn: 'user not found!',
                msgFa: 'کاربر پیدا نشد',
                success: false
            })
        }
        user.remove();
        return res.status(200).json ({
            msgEn: 'successfully removed',
            msgFa: 'کاربر حذف شد',
            success: true
        })  
    } 

    uploadImage(req, res) {
        
        if (req.file) {
            console.log('1')
            return res.json({
                msgEn: 'successfully uploaded',
                msgFa: 'با موفقیت آپلود شد',
                data: {
                    imagePath: 'http://localhost:3030/'+req.file.path.replace(/\\/g, '/')
                },
                success: true
            })
        } else {
            console.log(2)
            return res.json ({
                msgEn: 'unsuccessful',
                msgFa: 'آپلود ناموفق',
                success: false
            })
        }  
    }

    // update user
    async updateUser(req, res) {

        const { userName } = req.body;
        const userFilter = { 'email': userName };
        const temp = req.body;
        let updateParams = {};
        let key

        // dynamic object attribute in personal information
        for(key in temp) {
            if(temp[key] != "undefined") {
                updateParams[`${key}`] = temp[key];
            } 
        }      
        // update  
        let user = await this.model.user.findOneAndUpdate(userFilter, {$set: updateParams })
        if (!user) {
            return res.status(404).json({
                msgEn: 'user not found!',
                msgFa: 'کاربر پیدا نشد',
                success: false
            })
        }
        user = req.body;
        return res.status(200).json({
            msgEn: 'updated successfully',
            msgFa: 'بروزرسانی انجام شد',
            success: true
        })
    }
    
    //insert Address
    async addLocation  (req, res) {

        const { userName, locations, detail } = req.body;

        const userFilter = { "email": userName }
              
        //find and update  
        let user = await this.model.user.findOne(userFilter)
        if (!user){
            return res.status(404).json({
                msgEn: 'user not found!',
                msgFa: 'کاربر پیدا نشد',
                success: false
            })
        }
        
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
                                    
    }      
    
}







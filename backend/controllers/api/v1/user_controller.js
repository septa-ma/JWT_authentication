const controller = require(`${config.path.controller}/controller`);
const userTransform = require(`${config.path.transform}/user_transform`);
const geocoder = require(`${config.path.utils}/geocoder`);

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
    
    //add Location
    async addLocation  (req, res) {

        const { userName, locations } = req.body;
        const userFilter = { "email": userName }
        //find user
        let user = await this.model.user.findOne(userFilter)
        if (!user){
            return res.status(404).json({
                msgEn: 'user not found!',
                msgFa: 'کاربر پیدا نشد',
                success: false
            })
        }
        // geocode and add location
        const loc = await geocoder.geocode(locations);
        user.address = locations;
        user.location = {
            type: 'Point',
            coordinates: [loc[0].longitude, loc[0].latitude],
            formattedAddress: loc[0].formattedAddress
        }
        // update the user model
        const result = await user.save();
        if (!result) {
            return res.status(200).json({
                msgEn: 'there is some error',
                msgFa: 'موقعیت جغرافیایی اضافه نشد',
                success: false
            }) 
        }   
        return res.status(200).json({
            msgEn: 'inserted location',
            msgFa: 'موقعیت جغرافیایی اضافه شد',
            success: true
        })                                 
    }      
    
}







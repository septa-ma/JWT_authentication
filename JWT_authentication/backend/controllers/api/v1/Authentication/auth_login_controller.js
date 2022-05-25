const controller = require(`${config.path.controller}/controller`);
const userTransform = require(`${config.path.transform}/user_transform`);

module.exports = new class AuthLoginController extends controller {
    async login (req, res) {
        const { project_name, phone_number } = req.body;
        
        const intPhoneNumber = +phone_number;
        const userFilter = { $or:[{ "personal_info.phone_number": phone_number, 'delete_key': 10 }, { 'address_info': {"$elemMatch": {'phone_number':intPhoneNumber}}, delete_key: 10 }] }
        if ( project_name == 'my_workspace' ) {            
            const user = await this.model.user.findOne(userFilter);
            if (!user) {
                return res.status(422).json({
                    msgEn: 'go to register',
                    msgFa: 'ثبت نام انجام شود',
                    success: false
                });
            }
            if( user.delete_key == 10 ) {
                return res.json({
                    data : new userTransform().transform(user, true),
                    success : true
                });      
            }
        }
    }
}


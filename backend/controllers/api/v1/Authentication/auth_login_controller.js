const controller = require(`${config.path.controller}/controller`);
const userTransform = require(`${config.path.transform}/user_transform`);

module.exports = new class AuthLoginController extends controller {
    
    login(req, res){
        const { userName } = req.body;

        try{
            const userFilter = { 'email': userName, 'email_verified': true } 
            this.model.user.findOne(userFilter, (err, user) => {
                if (err) throw err;
                if (user == null) {
                    return res.status(422).json({
                        data : 'اطلاعات وارد شده صحیح نیست',
                        success : false
                    });
                } else {  
                    return res.status(200).json({
                        data : new userTransform().transform(user, true),
                        success : true
                    }); 
                }
            })
        } catch(err) {
            return res.status(500).send(err);
        }
    }
}
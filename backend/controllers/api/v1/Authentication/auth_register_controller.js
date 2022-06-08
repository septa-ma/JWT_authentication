const controller = require(`${config.path.controller}/controller`);
const transporter = require('./email_transport');

module.exports = new class AuthRegisterController extends controller {
    
    register(req, res) {
        const { name, family, phone, about, userName } = req.body;

        try{ 
            // Step 1 - Save user's info
            let newUser = new this.model.user({
                first_name : name,
                last_name : family,
                phone_number : phone,
                bio : about,
                email : userName // it is user's user_name
            })
            let register = newUser.save ();

            // Step 2 - Generate a verification token with the user's ID and a unique verification link
            const verificationToken = newUser.generateVerificationToken();
            const url = `http://localhost:3030/api/v1/verify/${verificationToken}`

            // Step 3 - Email the user 
            const sendEmail = async (emailOptions) => {
                let emailTransporter = await transporter.createTransporter();
                await emailTransporter.sendMail(emailOptions);
            };
            sendEmail({
                subject: 'Verify Account',
                html: `Click <a href = '${url}'>here</a> to confirm your email.`,
                to: userName,
                from: process.env.EMAIL_USERNAME
            });

            return res.status(201).send({
                message: `Sent a verification email to ${userName}`
            });

        } catch (err) {
            console.log('err' + err);
            res.status(500).send(err);
        }
    }
    
}
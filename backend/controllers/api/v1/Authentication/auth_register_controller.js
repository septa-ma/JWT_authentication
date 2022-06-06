const controller = require(`${config.path.controller}/controller`);
const nodemailer = require('nodemailer');

module.exports = new class AuthRegisterController extends controller {
    
    async register(req, res) {
        const { name, family, phone, about, userName } = req.body;

        const transporter = nodemailer.createTransport({
            host: 'smtp.mailtrap.io',
            port: 2525,
            auth: {
               user: process.env.EMAIL_USERNAME,
               pass: process.env.EMAIL_PASSWORD,
            },
        });

        try{ 
            let newUser = new this.model.user({
                first_name : name,
                last_name : family,
                phone_number : phone,
                bio : about,
                email : userName // it is user's user_name
            })
            let register = await newUser.save ();

            // Step 2 - Generate a verification token with the user's ID
            const verificationToken = newUser.generateVerificationToken();

            // Step 3 - Email the user a unique verification link
            const url = `http://localhost:3030/api/verify/${verificationToken}`
            transporter.sendMail({
                to: userName,
                subject: 'Verify Account',
                html: `Click <a href = '${url}'>here</a> to confirm your email.`
            })
            return res.status(201).send({
                message: `Sent a verification email to ${userName}`
            });

        } catch (err) {
            console.log('err' + err);
            res.status(500).send(err);
        }
    }
    
}
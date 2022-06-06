const controller = require(`${config.path.controller}/controller`);
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

module.exports = new class AuthRegisterController extends controller {
    
    register(req, res) {
        const { name, family, phone, about, userName } = req.body;

        const createTransporter = async () => {
            const oauth2Client = new OAuth2(
              process.env.CLIENT_ID,
              process.env.CLIENT_SECRET,
              "https://developers.google.com/oauthplayground"
            );
          
            oauth2Client.setCredentials({
              refresh_token: process.env.REFRESH_TOKEN
            });
        
            const accessToken = await new Promise((resolve, reject) => {
                oauth2Client.getAccessToken((err, token) => {
                if (err) {
                    reject("Failed to create access token :(");
                }
                resolve(token);
                });
            });

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                type: "OAuth2",
                user: process.env.EMAIL_USERNAME,
                accessToken,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN
                }
            });

            return transporter;
        };

        try{ 
            let newUser = new this.model.user({
                first_name : name,
                last_name : family,
                phone_number : phone,
                bio : about,
                email : userName // it is user's user_name
            })
            let register = newUser.save ();

            // Step 2 - Generate a verification token with the user's ID
            const verificationToken = newUser.generateVerificationToken();
            // Step 3 - Email the user a unique verification link
            const url = `http://localhost:3030/api/verify/${verificationToken}`

            const sendEmail = async (emailOptions) => {
                let emailTransporter = await createTransporter();
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
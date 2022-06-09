const controller = require(`${config.path.controller}/controller`);
const jwt = require('jsonwebtoken');

module.exports = new class VerificationController extends controller {

   verify (req, res) {
      const { token } = req.params
   
      // Step 1 -  Verify the token from the URL
      let payload = jwt.verify( token, process.env.USER_VERIFICATION_TOKEN_SECRET );
      
      try{
         // Step 2 - Find user with matching ID
         this.model.user.findOne({ _id: payload.ID }, (err, user) => {
            if (err) throw err;
            if (user && !user.email_verified ) {
               // Step 3 - Update user verification status to true
               user.email_verified = true;
               user.save();
               return res.status(200).send({
                  message: "Account Verified"
               });
            } else {
               return res.status(404).send({
                  message: "User does not  exists" 
               });
            }
         });
      } catch (err) {
         return res.status(500).send(err);
      }
   }

}
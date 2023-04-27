
let User = require('../../models/user.model');

let { genPassword, validPassword } = require('../../util/passwordUtils')
const jwt = require('jsonwebtoken');
const responses = require("./user.responses");
const responseHandler = new (require('../../util/baseResponse'))(responses);
const { signToken, emailVerifierTokenCreator } = require('../../util/jwtUtil');


module.exports = class userService {

    constructor() {

    }

    async signUp(formData) {

        let isEmailExists = User.find({ email: formData.email });
        let isUsernameExists = User.find({ username: formData.username });
        let isMobilenoExists = User.find({ mobile_no: formData.mobile_no });
        let credentialExists = await Promise.all([isEmailExists, isUsernameExists, isMobilenoExists]);

        let isCredExistsError = [];
        // {[] ., [] , [] }
        credentialExists.forEach((value, id) => {
            if (value.length > 0) {

                switch (id) {
                    case 0:
                        isCredExistsError.push("Email already exists")
                        break;
                    case 1:
                        isCredExistsError.push("Username already exists")
                        break;
                    case 2:
                        isCredExistsError.push("Mobile number already exists")
                        break;
                    default:
                        break;
                }
            }
        })

        if (isCredExistsError.length > 0) {
            return responseHandler.failure("credentail_exist", isCredExistsError);
        }

        // check if the email is verified or not. 

        let hashedPassword = genPassword(formData.password);
        formData.password = hashedPassword;
        delete formData.password_confirmation;

        try {
            let newUser = await new User(formData).save();
            // passsword  confirm 

            // we will create a jwt token with payload as user_id with 15 minute expiration time and 
            // will email user with the link if we get this token inside email id 
            // we will set the user password and make them active 
            // else we will make the user inactive 


            return responseHandler.success("user_created");
        }
        catch (error) {
            return responseHandler.failure("user_created_failed");
        }

    }


    async logIn(formData) {

        let user = await User.find({ email: formData.email });
        if (user.length == 0) {
            return responseHandler.failure("email_donst_exists");
        }
        // check if formData.password and confirmPassword exists 
        let isPasswordCorrect = validPassword(formData.password, user[0].password);
        if (!isPasswordCorrect) {
            return responseHandler.failure("password_not_matched");
        }
        // creating user data and token and sending them. 
        const payload = {
            id: user[0]._id,
            username: user[0].username,
            email: user[0].email,
            role_type: user[0].role_type,
            status: user[0].status
        }


        const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: `${60 * 60 * 24 * 2}s` });
        delete user[0]._doc.password;
        return responseHandler.success("user_loggedIn_success", {
            token: token,
            userData: {
                ...user[0]._doc
            }
        })


    }


    /**
     * 
     * @param {*} userId id of the user inserted in db but email not verified
     * @param {*} email email of the user
     */
    confirmEmail(userId, email) {
        return new Promise(async (resolve, reject) => {
            try {
                let emailVerifierToken = await emailVerifierTokenCreator(userId);
                // sending email to the user 
                // jwt token 15 expiry 
                // email token 
                // link 

            } catch (error) {
                reject(error);

            }

        });
    }



}





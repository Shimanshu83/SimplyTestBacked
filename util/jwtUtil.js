const jwt = require("jsonwebtoken");


function signToken(payload, secretKey, expiresIn) {
    return new Promise((resolve, reject) => {
        const options = {
            expiresIn: expiresIn,
            issuer: 'auth',
        };

        jwt.sign(payload, secretKey, options, (err, token) => {
            if (err) {
                reject({ isError: true, message: 'Invalid operation!' });
            } else {
                resolve(token);
            }
        })
    });
}


function emailVerifierTokenCreator(userId) {
    return signToken(userId, process.env.ACCESS_TOKEN_SECRET, '900s');
}


module.exports = {
    signToken,
    emailVerifierTokenCreator
}
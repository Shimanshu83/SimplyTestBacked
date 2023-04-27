const Validator = require('validatorjs');
let User = require('../../models/user.model');
let { genPassword, validPassword } = require('../../util/passwordUtils')
const jwt = require('jsonwebtoken');
const responses = require("./user.responses");
const responseHandler = new (require('../../util/baseResponse'))(responses);
const userService = new (require('./user.service'))()

// const userService = new (require("./user.service"))();

module.exports = class userController {
    constructor() {

    }
    async signUp(req, res, next) {
        try {

            let returnResponse = {};

            let formData = {
                username: req.body.username,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                mobile_no: req.body.mobile_no,
                country_code: req.body.country_code,
                password: req.body.password,
                password_confirmation: req.body.password_confirmation,
                role_type: req.body.role_type,
                status: 0
            };

            let rules = {
                username: "required|between:3,30",
                firstName: "required|between:3,30",
                lastName: "required|between:3,30",
                email: "required|email",
                mobile_no: ["required"],
                country_code: "required|numeric",
                // Minimum eight characters, at least one letter and one number:
                password: ["required", 'confirmed'],
                password_confirmation: ["required"],
                role_type: ["required"],
                status: ["boolean"]
            }

            let validation = new Validator(formData, rules);
            if (validation.passes() && !validation.fails()) {
                returnResponse = await userService.signUp(formData);
            }
            else {
                returnResponse = responseHandler.failure("request_body_incorrect", validation.errors.errors);
            }
            return res.json(returnResponse);
        } catch (error) {
            next(responseHandler.catch_error(error));
        }

    }


    async logIn(req, res, next) {

        try {
            let returnResponse = {};
            let formData = {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            };
            let rules = {
                username: "required|between:3,30",
                email: "required|email",
                password: ["required"]
            }

            let validation = new Validator(formData, rules);

            if (validation.passes() && !validation.fails()) {
                returnResponse = userService.logIn(formData)
                return res.json(returnResponse);
            }
            else {
                returnResponse = responseHandler.failure("request_body_incorrect", validation.errors.errors);
            }
        } catch (error) {
            next(responseHandler.catch_error(error));

        }


    }

    async confirmEmail(req, res, next) {

        // we will implement magic link approach to confirm email we will use jwt token wich expires 
        // token 
    }
}

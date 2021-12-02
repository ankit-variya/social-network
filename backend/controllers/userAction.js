const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { postsValidationSchema } = require("../config/validation");
const { _sendmail } = require('../middleware/mail');
const { EMAIL_EXISTS, LOGIN_FAILED, MOBILE_EXISTS, FAILD_CREATE, REGISTRATION, LOGIN, EMAIL_NOT_FOUND, WRONG_PASSWORD, DATA_NOT_FOUND, MOBILE_NOT_FOUND } = require('../config/errormssages');
const { _errorMassge, _successMassage } = require('../config/commonfunction');

const validate = async (body, res) => {
    //    console.log('--body', body)
    const obj = JSON.parse(JSON.stringify(body)); // req.body = [Object: null prototype] { title: 'product' }

    console.log('obj--', obj); // { title: 'product' }
    //  console.log('typeof validationSchema', validationSchema)
    if (typeof postsValidationSchema != "undefined") {
        const validateData = postsValidationSchema.validate(obj);
        //console.log('validateData======', validateData.error)
        if (validateData.error && validateData.error !== null) {
            console.log('----1111--', validateData.error)
            res.status(400).send(validateData.error);
            // console.log('errorMsg', errorMsg)
            return validateData
        }
        return validateData;
    }
};


const registration = async (req, res, next) => {
    try {

        let body = req.body;
        // const validation = await validate(body, res);


        //   console.log('validation', typeof validation.error)

        //         let msg = validation.error;
        //    //  console.log('validation -msg', ({msg})['toString'] )
        //         if (validation.error) return res.send({ "error": ({msg})['toString'] })

        const findUserByEmail = await User.find({ email: req.body.email });
        if (findUserByEmail.length > 0) return _errorMassge(res, EMAIL_EXISTS)

        const findUserBymobile = await User.find({ mobileNo: req.body.mobileNo });
        if (findUserBymobile.length > 0) return _errorMassge(res, MOBILE_EXISTS)

        const hash = await bcrypt.hash(req.body.password, 10);

        const userObj = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hash,
            gender: req.body.gender,
            mobileNo: req.body.mobileNo,
            profileImage: req.file.path
        }
        const token = jwt.sign(userObj, "abcdefgh", {}); // expiresIn: "1h"
        userObj.remember_token = token;

        const insertUser = await User.create(userObj);
        if (insertUser.length < 1) return _errorMassge(res, FAILD_CREATE)

        const mail = await _sendmail(body.email, token, res)

        return _successMassage(res, token);
    } catch (error) {
        return next(error);
    }

}

const login = async (req, res, next) => {
    try {
        const email = req.body.email;
        const mobileNo = req.body.mobileNo;
        const password = req.body.password;
        let finalUser;

        if (email) {
            const userEmail = await User.find({ email: email });
            if (userEmail.length < 1) return _errorMassge(res, EMAIL_NOT_FOUND)

            const userPassword = await bcrypt.compare(password, userEmail[0].password);
            if (userPassword == false) return _errorMassge(res, WRONG_PASSWORD)

            finalUser = await User.find({ email: email, password: userEmail[0].password });
            if (finalUser.length < 1) return _errorMassge(res, DATA_NOT_FOUND)
        }

        else {
            const userMobile = await User.find({ mobileNo: mobileNo });
            if (userMobile.length < 1) return _errorMassge(res, MOBILE_NOT_FOUND)

            const userPassword = await bcrypt.compare(password, userMobile[0].password);
            if (userPassword == false) return _errorMassge(res, WRONG_PASSWORD)

            finalUser = await User.find({ mobileNo: mobileNo, password: userMobile[0].password });
            if (finalUser.length < 1) return _errorMassge(res, DATA_NOT_FOUND)
        }

        return _successMassage(res, finalUser[0].token);
    } catch (error) {
        return next(error);
    }
}

exports.registration = registration;
exports.login = login;
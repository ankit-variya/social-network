const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { postsValidationSchema } = require("../config/validation");
const { _sendmail } = require('../middleware/mail');

const validate = async (body, res) => {
    console.log('--body', body)
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
        const validation = await validate(body, res);
        console.log('validation', typeof validation.error)
        
        let msg = validation.error;
     console.log('validation -msg', ({msg})['toString'] )
        if (validation.error) return res.send({ "error": ({msg})['toString'] })

        const findUserByEmail = await User.find({ email: req.body.email });
        console.log('findUserByEmail', findUserByEmail.length);
        if (findUserByEmail.length > 0) return res.status(400).send({ "error": "email already exists." })

        const findUserBymobile = await User.find({ mobileNo: req.body.mobileNo });
        if (findUserBymobile.length > 0) return res.status(400).send({ "error": "mobile number already exists." })

        const hash = await bcrypt.hash(req.body.password, 10);
        console.log('hash', hash)

        const userObj = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hash,
            gender: req.body.gender,
            mobileNo: req.body.mobileNo,
            profileImage: req.file.path
        }

        console.log('userObj', userObj)
        const token = jwt.sign(userObj, "abcdefgh", { expiresIn: "1h" });
        console.log("token", token);

        userObj.remember_token = token;

        const insertUser = await User.create(userObj);
        console.log('insertUser', insertUser)
        if (insertUser.length < 1) return res.status(400).send({ "error": "Failed to create." })

        const mail = await _sendmail(body.email, token, res)
        console.log('mail', mail)

        return res.status(200).json({
            message: 'Registration successful',
            token: token
        })
    } catch ({ errors }) {
        console.log('errors', errors)
        res.status(500).json({
            errors: Object.values(errors).map(e => e.message)
        })
    }

}

const login = async (req, res, next) => {
    try {
        console.log('mmm')
        const email = req.body.email;
        const mobileNo = req.body.mobileNo;
        const password = req.body.password;
        console.log('password', password)
        let finalUser;

        if(email) {
          const userEmail = await User.find({ email: email });  
            console.log('userEmail', userEmail[0].password)
            if (userEmail.length < 1) return res.status(400).send({ "error": "Email not found." })

         const userPassword = await bcrypt.compare(password, userEmail[0].password);
          console.log('userPassword', userPassword)
          if(userPassword == false)  return res.status(400).send({ "error": "password is wrong." })

          finalUser =  await User.find({ email: email, password: userEmail[0].password }); 
            console.log('finalUser', finalUser.length)
            if (finalUser.length < 1) return res.status(400).send({ "error": "Not found Data." })
        } 

        else {
            console.log('mobileNo', mobileNo)
            const userMobile = await User.find({ mobileNo: mobileNo });  
            console.log('userEmail', userMobile[0].password)
            if (userMobile.length < 1) return res.status(400).send({ "error": "Mobile number not found." })

         const userPassword = await bcrypt.compare(password, userMobile[0].password);
          console.log('userPassword', userPassword)
          if(userPassword == false)  return res.status(400).send({ "error": "password is wrong." })

          finalUser =  await User.find({ mobileNo: mobileNo, password: userMobile[0].password }); 
            console.log('finalUser', finalUser.length)
            if (finalUser.length < 1) return res.status(400).send({ "error": "Not found Data." })
        } 

        console.log('finalUser==========', finalUser)

        return res.status(200).json({
            message: 'login successful',
            token: finalUser[0].token
        })

    } catch (error) {
        res.status(500).json({
            errors: "data not found"
        })
    }


}

exports.registration = registration;
exports.login = login;
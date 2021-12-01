const express = require('express');
const router = express.Router();
const userAction = require('../controllers/userAction');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/')
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else {
        cb(null, true);
    }
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 500* 500 * 5},
    fileFilter: fileFilter
})

router.post('/registration',  upload.single('profileImage'), userAction.registration);
router.post('/login',  userAction.login);

module.exports = router;
const Post = require('../models/post');
const upload = require('../middleware/upload');
const { _errorMassge, _successMassage } = require('../config/commonfunction');
const { FAILD_CREATE, FAILD_UPDATE, DATA_NOT_FOUND } = require('../config/errormssages');

const createPost = async (req, res, next) => {
    try {
        console.log('req', req.userData._id)
        const body = req.body;
        const postObj = {
            post_title: body.post_title,
            post_description: body.post_description,
            post_image: req.file.path,
            userId: req.userData._id
        }

        const postInsert = await Post.create(postObj);
        console.log('postInsert', postInsert)
        if (postInsert.length < 1) return _errorMassge(res, FAILD_CREATE)
        return _successMassage(res, postInsert)
    } catch (error) {
        return next(error);
    }
}

const listPost = async (req, res, next) => {
    try {
        const postList = await Post.find({}).sort({_id: -1});
        console.log('postList', postList)
        return _successMassage(res, postList)
    } catch (error) {
        return next(error);
    }
}

const updatePost = async (req, res, next) => {
    try {
        const body = req.body;
        const query = req.query;
        const postObj = {
            post_title: body.post_title,
            post_description: body.post_description,
            userId: req.userData._id
        }
        const postUpdate = await Post.findByIdAndUpdate(query._id, postObj);
        if (postUpdate.length < 1) _errorMassge(res, FAILD_UPDATE)

        const postUpdated = await Post.findById(query._id);
        if (postUpdated.length < 1) _errorMassge(res, DATA_NOT_FOUND)

        return _successMassage(res, postUpdated)
    } catch (error) {
        return next(error);
    }
}

const deletePost = async (req, res, next) => {
    try {
        const query = req.query;
        const postDelete = await Post.findByIdAndDelete(query._id);
       
        return _successMassage(res)
    } catch (error) {
        return next(error); 
    }
}

exports.createPost = createPost;
exports.listPost = listPost;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
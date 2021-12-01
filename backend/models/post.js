const mongoose = require('mongoose');
const postSchema = mongoose.Schema({ 
    post_title: { type: String },
    post_description: { type: String },
    post: {
        type: String
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    
})

module.exports = mongoose.model('post', postSchema);
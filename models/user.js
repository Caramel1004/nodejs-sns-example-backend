const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// 유저 스키마
//이메일, 이름, 비밀번호, 상태, 게시물
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'New User!'
    },
    posts: [
        {
            type: Schema.Types.ObjectId,
            reference: 'Post'
        }
    ],
    createdAt: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
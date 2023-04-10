const mongoose = require('mongoose');

// 게시물 스키마
// 현재시간을 가져오기 위해 두번째 인수에 timestamps를 true로 설정함.
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    creator: {
        type: Object,
        required: true
    },
    createAt: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
const express = require('express');

const valid = require('../validator/valid');
const feedController = require('../controller/feed');

const router = express.Router();

//게시물 표시
router.get('/posts', feedController.getPosts);//GET /feed/posts

//게시물 추가
router.post('/post', valid.postValidCheck, feedController.postPost);//POST /feed/post

module.exports = router;
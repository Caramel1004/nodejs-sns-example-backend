const express = require('express');

const valid = require('../validator/valid');
const feedController = require('../controller/feed');

const router = express.Router();

// 게시물 목록 표시
router.get('/posts', feedController.getPostList);//GET /feed/posts

// 게시물 하나의 세부정보
router.get('/posts/:postId', feedController.getPostDetail)//GET /feed/posts

// 게시물 추가
router.post('/post', valid.postValidCheck, feedController.postPost);//POST /feed/post

// 게시물 수정
router.put('/post/:postId', valid.postValidCheck, feedController.updatePost);//PUT /feed/post

//게시물 삭제
router.delete('/post-delete/:postId',feedController.deletePost);// DELETE /feed/post-delete

module.exports = router;
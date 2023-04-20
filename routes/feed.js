const express = require('express');

const valid = require('../validator/valid');
const feedController = require('../controller/feed');

const router = express.Router();

// 게시물 목록 표시
router.get('/posts', valid.hasJsonWebToken, feedController.getPostList);//GET /feed/posts

// 게시물 하나의 세부정보
router.get('/posts/:postId', valid.hasJsonWebToken, feedController.getPostDetail)//GET /feed/posts

// 게시물 추가
// 두번째 인수: 인증토큰 검사, 세번째 인수: 유효성 검사
router.post('/post', valid.hasJsonWebToken, valid.checkValidpost, feedController.postPost);//POST /feed/post

// 게시물 수정
// 두번째 인수: 인증토큰 검사, 세번째 인수: 유효성 검사
router.put('/post/:postId', valid.hasJsonWebToken, valid.checkValidpost, feedController.updatePost);//PUT /feed/post

//게시물 삭제
// 두번째 인수: 인증토큰 검사, 세번째 인수: 유효성 검사
router.delete('/post-delete/:postId', valid.hasJsonWebToken, feedController.deletePost);// DELETE /feed/post-delete

module.exports = router;
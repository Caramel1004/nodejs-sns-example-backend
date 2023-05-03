const express = require('express');
const valid = require('../validator/valid');
const authController = require('../controller/auth');

const router = express.Router();

// 회원가입
router.post('/signup', valid.checkValidUser, authController.postSignUp);//POST /auth/signup

// 로그인
router.post('/login', authController.postLogin);

//유저 상태 확인
router.get('/status', valid.hasJsonWebToken, authController.getStatusOfUser);//GET /auth/status

//유저 상태 업데이트
//put: 리소스의 모든것을 업데이트함 patch: 리소스의 일부분만 업데이트
router.patch('/status-update', valid.hasJsonWebToken, authController.updateStatusOfUser);// PATCH /auth/status

module.exports = router;
const express = require('express');
const valid = require('../validator/valid');
const authController = require('../controller/auth');

const router = express.Router();

// 회원가입
router.post('/signup', valid.userValidCheck, authController.postSignUp);//POST /signup

// 로그인
router.post('/login',authController.postLogin);

// 로그아웃

module.exports = router;
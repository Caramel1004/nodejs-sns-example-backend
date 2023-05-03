const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const jwt = require('jsonwebtoken');


// 유효성 검사 함수
const validResult = (req, res, next) => {
    const errors = validationResult(req);

    // 유효성 검사
    if (!errors.isEmpty()) {
        // 에러객체 생성하고 예외상황 정의
        const error = new Error('유효성 검사 결과: 실패');
        error.statusCode = 422;
        error.data = errors.array();

        // 에러를 던짐
        // 다음 예외상황이나 다음 미들웨어로 이동함
        throw error;

        // return res.status(422).json({
        //     message: '유효성 검사 결과: 실패',
        //     errors: errors.array()
        // })
    } else {
        next();
    }
}

// 이미지 유무 체크 함수
const hasImageFile = (req, res, next) => {
    const imageFile = req.file;
    let imageUrl = req.body.image;

    console.log('imageFile : ', imageFile);
    console.log('imageUrl : ', imageUrl);
    // 이미지 파일 경로 유무
    if (!imageUrl) {
        // 기존 imageUrl가 없으면 유저가 올린 파일 저장
        imageUrl = imageFile.path.replace("\\", "/");
    }

    // 이미지파일 유무
    if (!imageFile && !imageUrl) {
        const error = new Error('이미지 파일이 없습니다.');
        error.statusCode = 422;
        throw error;
    } else {
        next();
    }
}



// 게시물 추가 유효성 검사
exports.checkValidpost = [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
    validResult,
    hasImageFile
]

// 사용자 추가 유효성 검사
exports.checkValidUser = [
    body('email').isEmail().withMessage('이메일이 유효하지 않습니다.')
        .custom((email, { req }) => {
            console.log('value : ', email);
            return User.findOne({ email: email })
                .then(userInfo => {
                    if (userInfo) {
                        return Promise.reject('이미 이메일이 존재 합니다.');
                    }
                })
                .catch(err => {
                    if (!err.statusCode) {
                        err.statusCode = 422;
                        throw err;
                    } else {
                        next(err);
                    }
                })
        })
        .normalizeEmail(),
    body('name').trim().isLength({ min: 5 }),
    body('password').trim().isLength({ min: 5 }),
    validResult
]

// 유저인증 토큰이 있는지 확인
exports.hasJsonWebToken = (req, res, next) => {
    // req.get () 함수는 대소문자를 구분하지 않는 지정된 HTTP 요청 헤더 필드를 반환하며 Referrer 및 Referrer 필드는 상호 교환 가능합니다. 
    const authHeader = req.get('Authorization');
    console.log('authHeader : ',authHeader);
    if (!authHeader) {
        const error = new Error('인증 토큰이 없습니다.');
        error.statusCode = 401;
        throw error;
    } else {
        const token = authHeader.split(' ')[1];
        try{
            const decodedToken = jwt.verify(token, 'caramel');
            req.userId = decodedToken.userId;
            next();
        }catch(err){
            console.log('복호화중 문제가 생겼습니다.',err);
            err.msg = '복호화중 문제가 생겼습니다.'
            err.statusCode = 500;
            throw err;
        }
    }

}
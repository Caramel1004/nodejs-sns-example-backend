const { body, validationResult } = require('express-validator');


// 유효성 검사 함수
const validResult = (req, res, next) => {
    const errors = validationResult(req);

    // 유효성 검사
    if (!errors.isEmpty()) {
        // 에러객체 생성하고 예외상황 정의
        const error = new Error('유효성 검사 결과: 실패');
        error.statusCode = 422;

        // 에러를 던짐
        // 다음 예외상황이나 다음 미들웨어로 이동함
        throw error;

        // return res.status(422).json({
        //     message: '유효성 검사 결과: 실패',
        //     errors: errors.array()
        // })
    }else{
        next();
    }
}

// 게시물 유효성 검사
module.exports.postValidCheck = [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
    validResult
]

// 사용자 유효성 검사


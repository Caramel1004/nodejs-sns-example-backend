const { body, validationResult } = require('express-validator/check');


// 게시물 추가시 유효성 검사
const validResult = (req, res, next) => {
    const errors = validationResult(req);

    // 유효성 검사
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: '유효성 검사 결과: 실패',
            errors: errors.array()
        })
    }
    next();
}

//게시물 유효성 검사
module.exports.postValidCheck = [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
    validResult
]


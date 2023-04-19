const User = require('../models/user');

// 회원 가입
exports.postSignUp = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    const user = new User({
        email: email,
        password: password,
        name: name
    });

    User.save()
        .then(userInfo => {
            res.status(201).json({
                msg: '회원가입 완료 되었습니다.',
                user: userInfo
            })
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            } else {
                next(err);
            }
        });
}

exports.postLogin = (req, res, next) => {

}

exports.postLogout = (req, res, next) => {

}

exports.postNewPassword = (req, res, next) => {

}
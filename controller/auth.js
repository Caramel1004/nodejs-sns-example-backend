const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// 회원 가입
exports.postSignUp = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    bcrypt.hash(password, 12)
        .then(hashPw => {
            const user = new User({
                email: email,
                password: hashPw,
                name: name
            });
            return user.save();
        })
        .then(userInfo => {
            res.status(201).json({
                msg: '회원가입 완료 되었습니다.',
                user: userInfo
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            } else {
                next(err);
            }
        })
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                const error = new Error('사용자 정보가 없습니다.');
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, loadedUser.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('비밀번호가 일치하지 않습니다.');
                error.statusCode = 401;
                throw error;
            }

            const token = jwt.sign({
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            },
            'wpdltmsdnpqxhzms',
            {expiresIn: '0.5h'}
            );

            return token;
        })
        .then(token => {
            console.log('로그인 인증 token: ',token);

            if(!token){
                const error = new Error('토큰이 부여되지 않았습니다!!')
                error.statusCode = 422;
                throw error;
            }else{
                res.status(200).json({
                    token: token,
                    userId: loadedUser._id.toString()
                });
            }

        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            } else {
                next(err);
            }
        })
}

exports.postLogout = (req, res, next) => {

}

exports.postNewPassword = (req, res, next) => {

}
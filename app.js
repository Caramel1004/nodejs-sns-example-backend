const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed');
const app = express();

// app.use(bodyParser.urlencoded({ extended: false }));// x-www-form-urlencoded
app.use(bodyParser.json());// application/json

// 이미지 폴더를 정적으로 사용
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    //cors에러 해결을 위한 헤더설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

app.use('/feed', feedRoutes);

app.use((error, req, res, next) => {
    console.log('app.js error: ', error);
    const statusCode = (!error.statusCode) ? 500 : error.statusCode;
    const msg = error.message;
    res.status(statusCode).json({
        message: msg,
        statusCode: statusCode
    });
})

//몽구스와 연결후 서버 실행
mongoose.connect('mongodb+srv://caramel1004:c6Zr1pGnvzoyFKwV@cluster0.vkqqcqz.mongodb.net/sns?retryWrites=true&w=majority')
    .then(result => {
        app.listen(8080, () => console.log(`server 8080 start!!`));
    }).catch(err => {
        console.log('app.js err:', err);
    });

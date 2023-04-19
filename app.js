const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const app = express();


// 해당 함수들은 파일의 저장 위치와 이름을 어떻게 처리할지를 제어
// CORS오류: windows에서 파일 이름에 날짜 문자열을 포함하면 cors오류가 남
// 해결: uuid패키지 사용
const fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        callback(null, uuidv4());
    }
});

// 파일 확장자 검사
const fileFilter = (req, file, callback) => {
    const fileType = ['image/jpeg', 'image/png', 'image/jpg'];
    const mimeType = fileType.find(fileType => fileType === file.mimetype);
    console.log('file : ', file);
    console.log('mimeType : ', mimeType);
    if (mimeType) {
        callback(null, true);
    } else {
        callback(null, false);
    }
}

// x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));

// application/json
app.use(bodyParser.json());
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
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
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
    console.log('app.js error: ', error);
    const statusCode = (!error.statusCode) ? 500 : error.statusCode;
    const msg = error.message;
    const data = error.data;

    res.status(statusCode).json({
        message: msg,
        statusCode: statusCode,
        data: data
    });
})

//몽구스와 연결후 서버 실행
mongoose.connect('mongodb+srv://caramel1004:iCTMxCjUJzj0HaTA@cluster0.vkqqcqz.mongodb.net/sns?retryWrites=true&w=majority')
    .then(result => {
        app.listen(8080, () => console.log(`server 8080 start!!`));
    }).catch(err => {
        console.log('app.js err:', err);
    });

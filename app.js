const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed');
const app = express();

// app.use(bodyParser.urlencoded({ extended: false }));// x-www-form-urlencoded
app.use(bodyParser.json());// application/json

app.use((req, res, next) => {
    //cors에러 해결을 위한 헤더설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

app.use('/feed', feedRoutes);

//몽구스와 연결후 서버 실행
mongoose.connect('mongodb+srv://caramel1004:7PbtPJngcpjOQ26D@cluster0.vkqqcqz.mongodb.net/sns?retryWrites=true&w=majority')
    .then(result => {
        app.listen(8080, () => console.log(`server 8080 start!!`));
    }).catch(err => {
        console.log('app.js err:',err);
    });

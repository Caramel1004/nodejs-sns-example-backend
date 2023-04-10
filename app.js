const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const feedRoutes = require('./routes/feed');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

// app.use(bodyParser.urlencoded({ extended: false }));// x-www-form-urlencoded
app.use(bodyParser.json());// application/json

//서버 렌더링 하기 --> 테스트
// app.use(router.get('/', (req, res, next) => {
//     console.log('index');
//     res.render('index', {
//         path: '/index',
//         pageTitle: 'Test Server!!'
//     })
// }
// ));

app.use((req, res, next) => {
    //cors에러 해결을 위한 헤더설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

app.use('/feed', feedRoutes);

app.listen(8080, () => console.log(`server 8080 start!!`));

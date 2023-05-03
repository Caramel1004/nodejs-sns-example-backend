# nodejs-sns-example-backend
nodejs로 sns 구축 연습 프로젝트

- RESTful API로 앱 구축
- 요청 및 응답 처리에서 뷰를 사용하지 않고 json 데이터를 사용할 것입니다.
- FrontEnd와 BackEnd를 분리하여 FrontEnd는 React로 작업 BackEnd는 node로 작업

- 프런트에선 fetch api사용하여 데이터를 요청하도록 합니다.
```javascript
// Example POST method implementation:
async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

postData("https://example.com/answer", { answer: 42 }).then((data) => {
  console.log(data); // JSON data parsed by `data.json()` call
});
```

# Error
- cors 오류: 브라우저와 서버의 도메인이 일치하지 않아서 생기는 오류이며 요청이 차단된다.
이 경우 요청 권한을 허락하도록 지정해줘야 한다.
1. nodejs 자체서버 도메인과 클라이언트 도메인이 일치하지 않는 경우
요청 헤더를 세팅해준다.
```javascript
app.use((req, res, next) => {
    //cors에러 해결을 위한 헤더설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})
```

2. 웹 소켓 사용시 소켓에서 나오는 cors오류
option값에 세팅해준다.
```javascript
 const server = app.listen(8080, () => console.log(`Node Server 8080 start!!`));
        const io = SocketIO(server,{
            cors: {
                origin: '*',
            }
        });
        io.on('connection', socket => {
            
```

- port 충돌 오류
```t
node:events:491
      throw er; // Unhandled 'error' event
      ^

Error: listen EADDRINUSE: address already in use :::8080
    at Server.setupListenHandle [as _listen2] (node:net:1463:16)
    at listenInCluster (node:net:1511:12)
    at Server.listen (node:net:1599:7)
    at Function.listen (/Users/cramel/node.js/nodejs-sns-example-backend/node_modules/express/lib/application.js:635:24)
    at /Users/cramel/node.js/nodejs-sns-example-backend/app.js:70:13
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
Emitted 'error' event on Server instance at:
    at emitErrorNT (node:net:1490:8)
    at processTicksAndRejections (node:internal/process/task_queues:83:21) {
  code: 'EADDRINUSE',
  errno: -48,
  syscall: 'listen',
  address: '::',
  port: 8080
}
```
* 해결
mac
- $ lsof -i tcp:8080
  $ kill -9 PID
- 기존의 서버를 먼저 내려주신 후 다시 실행하시면 됩니다 . 맥을 사용하신다면 터미널에서 pkill node를 이용해주시면 됩니다
window
- 윈도우는 제가 찾아본 바로는 현재 백엔드 서버 포트는 8080을 사용하고 있기때문에 해당 포트를 사용하고있는 PID를 찾아서 그걸 내려주면 됩니다. netstat -ano | find "LISTENING" | find "8080" 이걸로 PID를 찾았다면 tasklist /F PID  PID숫자 이렇게 하면 해당 포트의 프로세스가 죽게 됩니다

# 데이터베이스
- 몽고디비 사용
- 몽구스로 스키마 작업

기본적으로 Mongoose는 new Date()현재 시간을 가져오는 데 사용합니다. Mongoose가 현재 시간을 가져오는 데 사용하는 기능을 덮어쓰려면 옵션을 설정할 수 있습니다. timestamps.currentTime. timestamps.currentTime몽구스는 현재 시간을 가져와야 할 때마다 함수를 호출합니다 .

```javascript
// 몽구스 api
const schema = Schema({
  createdAt: Number,
  updatedAt: Number,
  name: String
}, {
  // Make Mongoose use Unix time (seconds since Jan 1, 1970)
  timestamps: { currentTime: () => Math.floor(Date.now() / 1000) }
});
```

- 현재 프로젝트에 적용
1. 유저 스키마
```javascript
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// 유저 스키마
//이메일, 이름, 비밀번호, 상태, 게시물
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    posts: [
        {
            type: Schema.Types.ObjectId,
            reference: 'Post'
        }
    ],
    createdAt: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
```

2. 게시물스키마
```javascript
const mongoose = require('mongoose');

// 게시물 스키마
// 현재시간을 가져오기 위해 두번째 인수에 timestamps를 true로 설정함.
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    creator: {
        type: Object,
        required: true
    },
    createAt: {
        type: Date
    }
}, { timestamps: true });


module.exports = mongoose.model('Post', postSchema);
```


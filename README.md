# nodejs-sns-example-backend
nodejs로 sns 구축 연습 프로젝트

- RESTful API로 앱 구축
- 요청 및 응답 처리에서 뷰를 사용하지 않고 json 데이터를 사용할 것입니다.
- FrontEnd와 BackEnd를 분리하여 FrontEnd는 React로 작업 BackEnd는 node로 작업

*오류*
cors 오류

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

# 데이터베이스
- 몽고디비 사용
- 몽구스로 스키마 작업

기본적으로 Mongoose는 new Date()현재 시간을 가져오는 데 사용합니다. Mongoose가 현재 시간을 가져오는 데 사용하는 기능을 덮어쓰려면 옵션을 설정할 수 있습니다. timestamps.currentTime. timestamps.currentTime몽구스는 현재 시간을 가져와야 할 때마다 함수를 호출합니다 .

```javascript
const schema = Schema({
  createdAt: Number,
  updatedAt: Number,
  name: String
}, {
  // Make Mongoose use Unix time (seconds since Jan 1, 1970)
  timestamps: { currentTime: () => Math.floor(Date.now() / 1000) }
});
```
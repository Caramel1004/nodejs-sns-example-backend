const e = require('express');
const Post = require('../models/post');

//현재 게시물 리스트 
exports.getPosts = (req, res, next) => {
    //더이상 뷰를 렌더링 하지 않을것이므로 데이터 받는 코드 작성
    res.status(200).json({
        posts: [{
            _id: '1',
            title: 'test입니다',
            content: '내용부분입니다.',
            imageUrl: 'images/Ryze.jpg',
            creator: {
                name: 'caramel1004'
            },
            createdAt: new Date()
        }]
    })
}

//게시물 추가
exports.postPost = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;

    const post = new Post({
        title: title,
        content: content,
        imageUrl: 'images/Ryze.jpg',
        creator: {
            name: 'caramel'
        }
    });

    post.save()
        .then(postData => {
            res.status(201).json({
                message: '게시물이 성공적으로 생성되었습니다.',
                post: postData
            });
        }).catch(err => {
            console.log('feed.js controller: ', err);
            // 에러 상태코드 체크
            if (!err.statusCode) {
                err.statusCode = 500;
            } else {
                //비동기 코드 스니펫 내부에 있으므로 error을 throw 하더라도
                // 다음 오류 처리 미들웨어로 넘어갈 수 없습니다
                // 대신 next 함수를 사용하고 여기에 error을 입력해야 합니다.
                next(err);
            }
        });
}
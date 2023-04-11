const express = require('express');
const Post = require('../models/post');

//현재 게시물 리스트 
exports.getPostList = (req, res, next) => {
    Post.find()
        .then(posts => {
            console.log(posts)
            //더이상 뷰를 렌더링 하지 않을것이므로 json형태로 데이터 보냄.
            res.status(200).json({
                msg: '게시물을 불러왔습니다.',
                posts: posts
            })
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            } else {
                next(err);
            }
        });
}


//현재 게시물 하나의 세부정보
exports.getPostDetail = (req, res, next) => {
    const postId = req.params.postId

    Post.findById(postId)
        .then(postDetail => {
            if(postDetail){
                res.status(200).json({
                    msg: '해당게시물을 찾았습니다.',
                    postDetail: postDetail
                })
            }else{
                const error = new Error('해당 게시물을 찾을수가 없습니다.');
                error.statusCode = 404;
                throw error;//catch문으로 전달
            }
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            } else {
                next(err);
            }
        });
}


//게시물 추가
exports.postPost = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.file.path.replace("\\" ,"/");
    console.log(imageUrl);

    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
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

exports.updatePost = (req, res, next) => {
    const imageUrl = req.file.path.replace("\\" ,"/");
}


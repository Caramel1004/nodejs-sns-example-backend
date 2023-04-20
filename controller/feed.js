const path = require('path');
const fs = require('fs');
const Post = require('../models/post');
const User = require('../models/user');

//현재 게시물 리스트 
exports.getPostList = (req, res, next) => {
    const curPage = req.query.page || 1;
    const itemPerPage = 3;
    let postsNum;

    Post.find().countDocuments()
        .then(count => {
            postsNum = count;
            return postsNum;
        })
        .then(postsNum => {
            return Post.find()
                .skip((curPage - 1) * itemPerPage)
                .limit(itemPerPage);
        })
        .then(posts => {
            console.log(posts)
            //더이상 뷰를 렌더링 하지 않을것이므로 json형태로 데이터 보냄.
            res.status(200).json({
                msg: '게시물을 불러왔습니다.',
                posts: posts,
                totalItem: postsNum,
                itemPerPage: itemPerPage
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
            if (postDetail) {
                res.status(200).json({
                    msg: '해당게시물을 찾았습니다.',
                    postDetail: postDetail
                })
            } else {
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
    const imageUrl = req.file.path.replace("\\", "/");
    let creator;
    console.log(imageUrl);

    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: req.userId
    });

    console.log('post: ', post);

    User.findById(req.userId)
        .then(user => {
            creator = user;
            user.posts.push(post);
            return user.save();
        })
        .then(result => {
            console.log('유저가 게시물을 올렸습니다.');
            return post.save();
        })
        .then(postData => {
            res.status(201).json({
                message: '게시판에 글이 올라갔습니다.',
                post: postData,
                creator: {
                    _id: creator._id,
                    name: creator.name
                }
            })
        })
        .catch(err => {
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

// 게시물 수정
exports.updatePost = (req, res, next) => {
    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;

    if (req.file) {
        imageUrl = req.file.path.replace("\\", "/");
    }
    console.log('컨트롤러 imageUrl : ', imageUrl);
    return Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('이미지 파일이 없습니다.');
                error.statusCode = 422;
                throw error;
            }
            if (imageUrl !== post.imageUrl) {
                clearImage(post.imageUrl);
            }
            post.title = title;
            post.content = content;
            post.imageUrl = imageUrl;
            return post.save()
                .then(result => {
                    res.status(200).json({
                        msg: '업데이트 완료했습니다!',
                        post: result
                    });
                })
                .catch(err => {
                    if (!err.statusCode) {
                        err.statusCode = 500;
                    } else {
                        next(err);
                    }
                })
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            } else {
                next(err);
            }
        });

}

// 게시물 삭제
exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    console.log('postId: ', postId)
    Post.findById(postId)
        .then(post => {
            clearImage(post.imageUrl);
            return Post.findByIdAndRemove(postId);
        })
        .then(postFilter => {
            res.status(200).json({
                msg: '해당 게시물이 삭제되었습니다.',
                post: postFilter
            })
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            } else {
                next(err);
            }
        });
}

// 게시물 수정하거나 삭제하는 경우 이미지폴더에서 해당 이미지 삭제
const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
}


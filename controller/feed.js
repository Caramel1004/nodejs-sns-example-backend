const path = require('path');
const fs = require('fs');
const Post = require('../models/post');
const User = require('../models/user');
const SocketIO = require('../socket');

//현재 게시물 리스트 
exports.getPostList = (req, res, next) => {
    const curPage = req.query.page || 1;
    const itemPerPage = 4;
    let postsNum;

    Post.find().countDocuments()
        .then(count => {
            postsNum = count;
            return postsNum;
        })
        .then(postsNum => {
            return Post.find()
                .populate('creator')
                .sort({createdAt: -1})//-1: 내림차순 1: 오름차순
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
// 웹 소켓 추가
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
            console.log('name : ', creator.name);
            const socketIO = SocketIO.getIO();
            socketIO.emit('updatePost', {
                action: 'create',
                post: {
                    ...post._doc,
                    creator: {
                        _id: req.userId,
                        name: creator.name
                    }
                }
            });

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
                const error = new Error('해당 게시물이 없습니다.');
                error.statusCode = 422;
                throw error;
            } else if (post.creator.toString() !== req.userId) {
                const error = new Error('해당게시물의 저자가 아닙니다.');
                error.statusCode = 403;
                throw error;
            }

            if (imageUrl !== post.imageUrl) {
                clearImage(post.imageUrl);
            }

            if(imageUrl !== undefined && imageUrl !== null) {
                post.imageUrl = imageUrl;
            }
            post.title = title;
            post.content = content;
            return post.save()
                .then(editPost => {
                    const socketIO = SocketIO.getIO();
                    socketIO.emit('updatePost',{
                        action: 'edit',
                        post: editPost
                    })
                    res.status(200).json({
                        msg: '업데이트 완료했습니다!',
                        post: editPost
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
    let deletePost;
    console.log('postId: ', postId);

    User.findById(req.userId)
        .then(user => {
            console.log(user);

            // 몽구스에서 제공하는 pull() 함수를 사용하여도 됨
            // user.posts.pull(postId);

            // 자바스크립트의 필터 함수 사용해서 필터링 해도됨
            const filterPost = user.posts.filter(post =>
                post.toString() !== postId
            )
            console.log('필터링된 배열: ', filterPost);
            user.posts = [...filterPost];
            return user.save();
        })
        .then(user => {
            console.log('해당 유저 게시물: ', user.posts);
            return Post.findById(postId);
        })
        .then(post => {
            if (!post) {
                const error = new Error('해당 게시물이 없습니다.');
                error.statusCode = 422;
                throw error;
            } else if (post.creator.toString() !== req.userId) {
                const error = new Error('해당게시물의 저자가 아닙니다.');
                error.statusCode = 403;
                throw error;
            }

            clearImage(post.imageUrl);
            return Post.findByIdAndRemove(postId);
        })
        .then(deletePost => {
            // 백에서 삭제해야할 게시물을 프론트에 보낸다.
            console.log('삭제된 게시물: ', deletePost);
            const sorverIO = SocketIO.getIO();
            sorverIO.emit('updatePost', {
                action: 'delete',
                post: deletePost
            });

            res.status(200).json({
                msg: '해당 게시물이 삭제되었습니다.',
                post: deletePost
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


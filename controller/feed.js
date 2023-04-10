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
    //Creat post in db
    res.status(201).json({
        message: '게시물이 성공적으로 생성되었습니다.',
        post: {
            _id: new Date().toISOString(),
            title: title,
            content: content,
            creator: {
                name: 'caramel1004'
            },
            createdAt: new Date()
        }
    });
}
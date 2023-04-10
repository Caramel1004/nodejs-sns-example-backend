exports.getPosts = (req, res, next) => {
    //더이상 뷰를 렌더링 하지 않을것이므로 데이터 받는 코드 작성
    res.status(200).json({
        posts: [{
            title: 'test입니다',
            content: '내용부분입니다.'
        }]
    })
}

exports.postPost = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;
    //Creat post in db
    res.status(201).json({
        message: '게시물이 성공적으로 생성되었습니다.',
        post: {
            id: new Date().toISOString(),
            title: title,
            content: content
        }
    });
}
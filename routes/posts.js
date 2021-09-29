var express = require('express');
var router = express.Router();
var api = require('../data/api');

/* GET addPost page */
router.get('/addPost', function(req, res, next) {
    var session = req.session
    var userData = { login: false };
    if (session.login) {
        var sgn = session.logSign;
        var code = api.signVer(sgn);
        if (code.ver) {
            var userList = api.getUsers();
            for (const checkingUser in userList) {
                if (Object.hasOwnProperty.call(userList, checkingUser)) {
                    const e = userList[checkingUser];
                    if (e.id == code.id) {
                        userData = e;
                        userData.login = true;
                    }
                }
            }
            if (!userData.login) {
                res.redirect('/home');
                return;
            }
            res.render('posts/addPost', { title: 'jrForum' });
        }
    } else {
        res.redirect('/home');
    }
});

/* GET posts by topic page. */
router.get('/topic/:topic', function(req, res, next) {
    var p = api.getPosts();
    var use = [];
    for (const key in p) {
        if (Object.hasOwnProperty.call(p, key)) {
            const post = p[key];
            if (post.topic == req.params.topic) {
                use.push(post);
            }
        }
    }
    res.charset = "utf-8";
    res.send(use);
});

/* GET posts by id page. */
router.get('/id/:id', function(req, res, next) {
    var p = api.getPosts();
    var use = [];
    for (const key in p) {
        if (Object.hasOwnProperty.call(p, key)) {
            const post = p[key];
            if (post.id == req.params.id) {
                use.push(post);
            }
        }
    }
    res.charset = "utf-8";
    if (use.length < 1) {
        res.setHeader('Content-type', 'text/plain; charset=utf-8');
        res.status(200).write('没有找到对应的帖子');
        res.end();
        return;
    }
    res.render('posts/page', { title: 'jrForum', post: use[0] });
});

/* GET news page */
router.get('/news', function(req, res, next) {
    var postListJ = api.getPosts();
    var postList = [];
    switch (req.query.by) {
        case undefined:
            for (const p in postListJ) {
                if (Object.hasOwnProperty.call(postListJ, p)) {
                    const e = postListJ[p];
                    postList.push(e);
                }
            }
            break;

        case 'topic':
            for (const p in postListJ) {
                if (Object.hasOwnProperty.call(postListJ, p)) {
                    const e = postListJ[p];
                    if (e.topic == req.query.topic) {
                        postList.push(e);
                    }
                }
            }
            break;

        case 'user':
            for (const p in postListJ) {
                if (Object.hasOwnProperty.call(postListJ, p)) {
                    const e = postListJ[p];
                    if (e.userId == req.query.userId) {
                        postList.push(e);
                    }
                }
            }
            break;
    }
    console.log(req.query.by);
    res.render('posts/news', { title: 'jrForum', postList, sortName: req.query.by || '无' });
})

module.exports = router;
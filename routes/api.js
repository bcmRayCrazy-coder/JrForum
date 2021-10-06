var express = require('express');
var router = express.Router();
const api = require('../data/api');
const { navBar } = require('../data/pgs');

/* GET posts by topic page. */
router.get('/getPosts/topic/:topic', function(req, res, next) {
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
router.get('/getPosts/id/:id', function(req, res, next) {
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
    res.send(use);
});

/* POST check */
router.post('/check', function(req, res, next) {
    var dt = req.body;
    switch (dt.use) {
        case "reg":
            if (dt.pas == dt.pasV) {
                var userData = api.addUsers(dt.name, dt.pas);
                res.render('back/regSucess', { userData, navBar, title: config.title });
            } else {
                res.render('back/failed', { reason: '两个密码不相符', action: '注册', backUrl: 'reg', title: config.title });
            }
            break;

        case "log":
            var userList = api.getUsers();
            var verUser = { n: true };
            for (const user in userList) {
                if (Object.hasOwnProperty.call(userList, user)) {
                    const e = userList[user];
                    if (e.id == dt.id) {
                        verUser = e;
                    }
                }
            }
            if (verUser.n) {
                res.render('back/failed', { reason: '没有该用户', action: '登录', backUrl: 'login', title: config.title });
                return;
            }
            if (verUser.password != api.md5(dt.password)) {
                res.render('back/failed', { reason: '密码错误', action: '登录', backUrl: 'login', title: config.title });
                return;
            }
            req.session.login = true;
            req.session.logSign = api.signUser(dt.id);
            setTimeout(() => {
                res.status(200).send(`登录成功!<a href="/home">回到主页</a>`);
            }, 800);
            break;

        default:
            res.render('back/failed', { reason: '没有传入任何值', action: '验证', backUrl: 'login', title: config.title });
            break;
    }
});

/* GET logout page */
router.get('/logout', function(req, res, next) {
    req.session.destroy((err) => {
        if (err) {
            res.render('back/failed', { reason: err, action: '登出', backUrl: 'login', title: config.title });
            return;
        }
        res.redirect('/home');
    });
})

/* POST postPost api */
router.post('/postPost', function(req, res, next) {
    var dt = req.body;
    var session = req.session;
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
                res.send({ err: true, msg: '重新登录' });
                return;
            }
            var postData = api.addPost(dt.title, dt.content, userData, dt.topic);
            res.send(postData);
        } else {
            res.send({ err: true, msg: '无效登录' });
        }
    } else {
        res.send({ err: true, msg: '未登录' });
    }
});

/* POST reply api */
router.post('/reply', function(req, res, next) {
    var dt = req.body;
    var session = req.session;
    var userData = { login: false };
    res.setHeader('Content-type', 'text/plain; charset=utf-8');
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
                res.status(200).write('您还没有登录呢……');
                res.end();
                return;
            }
            var replyData = api.replyPost(dt.postId, dt.content, userData);
            res.status(200).write('回帖成功!');
            res.end();
        } else {
            res.status(200).write('您还没有登录呢……');
            res.end();
            return;
        }
    } else {
        res.status(200).write('您还没有登录呢……');
        res.end();
        return;
    }
});

router.post('/avator', (req, res) => {
    var session = req.session;
    var userData = { login: false };
    res.setHeader('Content-type', 'text/plain; charset=utf-8');
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
                res.status(200).json({ err: true, msg: '未登录' });
                res.end();
                return;
            }
            var image = "";
            for (const i in req.body) {
                image = i;
            }
            var b = api.setUserAvatar(userData.id, image);
            res.status(200).json({ err: false, msg: '成功!' });
            res.end();
        } else {
            res.status(200).json({ err: true, msg: '未登录', b });
            res.end();
            return;
        }
    } else {
        res.status(200).write('您还没有登录呢……');
        res.end();
        return;
    }
})

module.exports = router;

// itzjerry吃螃蟹的屎中
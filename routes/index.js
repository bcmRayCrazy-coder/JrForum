var express = require('express');
var router = express.Router();
var api = require('../data/api');
const { navBar } = require('../data/pgs');
const config = require('../config');

/* GET index page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: config.title, des: config.description, link: '/home' });
});

/* GET home page. */
router.get('/home', function(req, res, next) {
    var session = req.session;
    var userData = { login: false };
    var showL = 'display:none;';
    var unshowL = '';
    var postListJ = api.getPosts();
    var postList = [];
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
                        showL = '';
                        unshowL = 'display:none;';
                    }
                }
            }
        }
    }
    for (const p in postListJ) {
        if (Object.hasOwnProperty.call(postListJ, p)) {
            const e = postListJ[p];
            postList.push(e);
        }
    }
    res.render('home', { title: config.title, navBar, userData, showL, unshowL, postList });
});

module.exports = router;
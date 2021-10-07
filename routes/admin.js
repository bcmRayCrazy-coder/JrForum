var express = require('express');
var router = express.Router();
var api = require('../data/api');
const { navBar } = require('../data/pgs');
const config = require('../config');

/* GET index page. */
router.get('/', function(req, res, next) {
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
        }
    }
    if (config.admins.includes(userData.id)) {
        res.render('admin/index', { title: config.title, userData })
    } else {
        res.redirect('/home');
    }
});

module.exports = router;
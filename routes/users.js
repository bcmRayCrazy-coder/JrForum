var express = require('express');
var router = express.Router();
const { navBar } = require('../data/pgs');
const api = require('../data/api.js');
const config = require('../config');

const UsersApiUrl = '/api/users';

/* GET users login listing. */
router.get('/', function(req, res, next) {
    res.render('users/login', { title: config.title, api: UsersApiUrl, navBar });
});

/* GET users settings listing. */
router.get('/settings', function(req, res, next) {
    res.render('users/settings', { title: config.title, api: UsersApiUrl, navBar });
});

/* GET login listing. */
router.get('/login', function(req, res, next) {
    res.render('users/login', { title: config.title, api: UsersApiUrl, navBar });
});

/* GET users register listing. */
router.get('/reg', function(req, res, next) {
    res.render('users/reg', { title: config.title, api: UsersApiUrl, navBar });
});

/* GET self page */
router.get('/userpage/:id', function(req, res, next) {
    var id = req.params.id;
    var user = [];
    var userList = api.getUsers();
    for (const u in userList) {
        if (Object.hasOwnProperty.call(userList, u)) {
            const e = userList[u];
            if (e.id == id) {
                user.push(e);
            }
        }
    }
    if (user.length < 1) {
        res.setHeader('Content-type', 'text/plain; charset=utf-8');
        res.status(200).write('没有找到对应用户...');
        res.end();
        return;
    }
    res.render('users/self', { title: config.title, user: user[0] });
})

module.exports = router;
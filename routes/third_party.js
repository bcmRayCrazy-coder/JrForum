var express = require('express');
var router = express.Router();

const axios = require('axios');

// https://github.com/login/oauth/authorize?client_id=191f413b06d76fa7861c&redirect_url=http://localhost:233/third_party/githuboauth
router.get('/githuboauth', async(req, res) => {
    var user_code = req.query.code;
    var b = (await axios.post('https://github.com/login/oauth/access_token', {
        client_id: "191f413b06d76fa7861c",
        client_secret: "c6321db94a11b7d667e3ffb82f3ca111be44d03a",
        code: user_code
    })).data;
    var dts = b.split('&')[0];
    if (dts.split('=')[0] == 'error') {
        res.status(200).write('error:' + dts.split('=')[1]);
        res.end();
        return;
    }
    var access_token = dts.split('=')[1];
    b = (await axios.get('https://api.github.com/user', {
        headers: {
            'Authorization': 'token ' + access_token
        }
    })).data;
    // console.log(b);
    res.type('html');
    res.status(200).write(`Hello ${b.login}!
<img src='${b.avatar_url}' style='height:64px;width:64px'>`)
    res.end();
})

module.exports = router;
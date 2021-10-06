const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { Buffer } = require('buffer');
var md5 = (data) => {
    // 以md5的格式创建一个哈希值
    let hash = crypto.createHash('md5');
    return hash.update(data).digest('base64');
}
var getUsers = () => {
    return JSON.parse(fs.readFileSync(__dirname + '/users.json'));
}
var getPosts = () => {
    return JSON.parse(fs.readFileSync(__dirname + '/posts.json'));
}
var addUsers = (name, pwd) => {
    var u = getUsers();
    var num;
    for (const key in u) {
        if (Object.hasOwnProperty.call(u, key)) {
            num = Number(u[key].id);
        }
    }
    var userData = {
        nickname: name,
        id: num + 1,
        password: md5(pwd),
        descript: "对方还没有设置简介呢",
        owns: {
            coin: 0,
            level: 1,
            arch: [0]
        },
        avator_url: "/images/users/default.png"
    };
    u[String(num + 1)] = userData;
    let data = JSON.stringify(u, null, 4);
    fs.writeFileSync(__dirname + '/users.json', data);
    return userData;
}
var addPost = (t, c, user, topic) => {
    var u = getPosts();
    var num;
    for (const key in u) {
        if (Object.hasOwnProperty.call(u, key)) {
            num = Number(u[key].id);
        }
    }
    var postData = { title: t, content: c, id: num + 1, topic: topic, user: user, reply: [] };
    u[String(num + 1)] = postData;
    let data = JSON.stringify(u, null, 4);
    fs.writeFileSync(__dirname + '/posts.json', data);
    return postData;
}
var replyPost = (postId, c, user) => {
    var u = getPosts();
    var replyData = { content: c, user: user };
    u[postId].reply.push(replyData);
    var data = JSON.stringify(u, null, 4);
    fs.writeFileSync(__dirname + '/posts.json', data);
    return replyData;
}
var signUser = (userId) => {
    // 生成签名
    len = 50;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz12345678';
    var maxPos = $chars.length;
    var signatrue = `id|${userId}|`;
    for (i = 0; i < len; i++) {
        signatrue += $chars.charAt(Math.floor(Math.random() * maxPos));
    }

    var signs = JSON.parse(fs.readFileSync(__dirname + '/userSigns.json'));
    signs[userId] = signatrue;
    fs.writeFileSync(__dirname + '/userSigns.json', JSON.stringify(signs, null, 4));
    return signatrue;
}
var signVer = (sign) => {
    var signs = JSON.parse(fs.readFileSync(__dirname + '/userSigns.json'));
    var data = sign.split('|');
    // console.log(signs[data[1]]);
    // console.log(data);
    if (signs[data[1]] == sign) {
        return { ver: true, id: data[1] }
    }
    return { ver: false }
}
var setUserAvatar = (id, img) => {
    var type = img.split(',')[0].split('/')[1].split(';')[0];
    var avatarUrl = `/images/users/id_${id}_avatar.${type}`;
    var savePath = path.join(__dirname, `../public${avatarUrl}`);
    var u = getUsers();

    u[String(id)].avator_url = avatarUrl;
    // console.log(img);

    var imgFile = new Buffer.from(img.replace(/^data:image\/\w+;base64,/, ""), 'base64');


    fs.writeFileSync(__dirname + '/users.json', JSON.stringify(u, null, 4));
    fs.writeFile(savePath, imgFile, (err) => {
        return { err: err, avatarUrl };
    });
}
module.exports = {
    getUsers,
    getPosts,
    addUsers,
    addPost,
    signUser,
    signVer,
    replyPost,
    setUserAvatar,
    md5
}
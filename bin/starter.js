const inquirer = require("inquirer");
const chalk = require("chalk");
const fs = require('fs');
const path = require("path");
const e = require("express");

var ui = new inquirer.ui.BottomBar();

function createFiles() {
    console.log('正在初始化数据...');
    fs.open(path.join(__dirname + '../data/users.json'), 'r', (err, fd) => {
        if (!err) {
            console.log(chalk `文件 {blue users.json} 已经存在!`);
            fs.close(fd);
        } else {
            fs.open(path.join(__dirname + '../data/users.json'), 'w+', (err, fdU) => {
                if (err) {
                    fs.close(fdU);
                    return console.error(err);
                }
                fs.write(fd, `"0": {
                    "nickname": "admin",
                    "id": 0,
                    "password": "qQZEnVdp+nNh1+zGqj9tKA==",
                    "descript": "管理员",
                    "owns": {
                        "coin": 0,
                        "level": 0,
                        "arch": [
                            0
                        ]
                    }
                }`);
                console.log(chalk `文件 {blue users.json} 已创建!`);
                fs.close(fdU);
            });
        }
    });
    fs.open(path.join(__dirname + '../data/posts.json'), 'r', (err, fd) => {
        if (!err) {
            console.log(chalk `文件 {blue posts.json} 已经存在!`);
            fs.close(fd);
        } else {
            fs.open(path.join(__dirname + '../data/posts.json'), 'w+', (err, fdU) => {
                if (err) {
                    fs.close(fdU);
                    return console.error(err);
                }
                fs.write(fd, `"0": {
                    "title": "欢迎来到JrForum",
                    "content": "快来发布帖子吧!",
                    "id": 0,
                    "topic": "others",
                    "user": {
                        "nickname": "系统",
                        "id": -1,
                        "descript": "系统用户",
                        "owns": {
                            "coin": 0,
                            "level": 1,
                            "arch": [
                                0
                            ]
                        },
                        "login": false
                    },
                    "reply": []
                }`);
                console.log(chalk `文件 {blue posts.json} 已创建!`);
                console.warn('管理员id:0');
                console.warn('管理员密码:123abc');
                console.warn('请务必更改管理员密码!');
                fs.close(fdU);
            });
        }
    });
}

function runForum() {
    console.log(chalk `{red 运}{rgb(255,165,0) 行}{yellow 论}{green 坛}{blue 中}{rgb(164,0,255) ...}`);
    try {
        require('./www');
        console.log(chalk.green("成功运行!"));
    } catch (err) {
        console.log(chalk.red("运行过程中出现错误:"));
        console.error(err);
    }
}

function init() {

    inquirer.prompt([{
        name: "do",
        type: "list",
        message: "进行的操作",
        choices: ["运行论坛", new inquirer.Separator(), "初始化数据", "重置所有数据", "退出"],
        default: 0
    }]).then(({ do: v }) => {
        switch (v) {
            case "退出":
                console.log(chalk.red("程序已退出"))
                process.exit();
                break;

            case "运行论坛":
                runForum();
                break;

            case "初始化数据":
                createFiles();

            default:
                init();
                break;

        }
    });

}
init();
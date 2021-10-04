const inquirer = require("inquirer");
const chalk = require("chalk");
const fs = require('fs');
const path = require("path");
const e = require("express");
const { join } = require("path");

var ui = new inquirer.ui.BottomBar();

function createFiles() {
    console.log('正在初始化数据...');
    console.log();
    fs.open(path.join(__dirname, '/../data/users.json'), 'r', (err, fd) => {
        if (!err) {
            console.log(chalk `文件 {blue users.json} 已经存在!`);
        } else {
            fs.open(path.join(__dirname, '/../data/users.json'), 'w+', (err, fdU) => {
                if (err) {
                    return console.error(err);
                }
                fs.write(fdU, `{"0": {
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
                }}`, (err) => {
                    if (err) return console.error(err);
                    console.log(chalk `文件 {blue users.json} 已创建!`);
                });
            });
        }
    });
    fs.open(path.join(__dirname, '/../data/posts.json'), 'r', (err, fd) => {
        if (!err) {
            console.log(chalk `文件 {blue posts.json} 已经存在!`);
        } else {
            fs.open(path.join(__dirname, '/../data/posts.json'), 'w+', (err, fdU) => {
                if (err) {
                    return console.error(err);
                }
                fs.write(fdU, `{"0": {
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
                }}`, (err) => {
                    if (err) return console.error(err);
                    console.log(chalk `文件 {blue posts.json} 已创建!`);
                    console.warn('管理员id:0');
                    console.warn('管理员密码:123abc');
                    console.warn('请务必更改管理员密码!');
                });
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

function resetForum() {
    console.log(chalk.red('正在重置数据...'));
    console.log();
    fs.unlink(path.join(__dirname, '../data/users.json'), (err) => {
        if (err) {
            console.log(chalk.red('出现错误:'));
            return console.error(err);
        }
        console.log(chalk `文件 {bgBlue.white users.json} 删除成功!`);
    });
    fs.unlink(path.join(__dirname, '../data/posts.json'), (err) => {
        if (err) {
            console.log(chalk.red('出现错误:'));
            return console.error(err);
        }
        console.log(chalk `文件 {bgBlue.white posts.json} 删除成功!`);
    });
    console.log(chalk.hex('#FF66FF')('正在创建文件……'));
    createFiles();
}

function init() {
    console.log(chalk.hex('#FF6666')("====请=选=择===="));
    console.log(chalk.bgRgb(242, 103, 12).white("使用 箭头 键选择,使用 enter 键确定"));
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
                break;

            case "重置所有数据":
                inquirer.prompt({
                    type: "confirm",
                    name: "confirmReset",
                    message: "你确定要重置吗?",
                    default: false
                }).then(({ confirmReset: v }) => {
                    if (!v) return init();
                    resetForum();
                });
                break;

            default:
                init();
                break;

        }
    });

}
init();
// 请自行更改里面的配置
module.exports = {

    // 论坛标题
    title: "JrForum",

    // 论坛描述
    description: "A forum dev by bcmray_crazy and ItzJerry",

    // 管理员id
    admins: [0],

    // 默认配置
    default: {

        // 管理员配置
        user: {

            // 昵称
            nickname: "admin",

            // id编号
            id: 0,

            // 密码(md5加密,这里解密为123abc)
            password: "qQZEnVdp+nNh1+zGqj9tKA==",

            // 描述
            descript: "管理员",

            // 信息
            owns: {

                // 金币
                coin: 0,

                // 等级
                level: 0,

                // 成就(成就编号)
                arch: [
                    0
                ]
            },

            // 头像位置(省略/public)
            avator_url: "/images/users/id_0_avatar.png"
        },

        // 第一个帖子(勿删)
        post: {

            // 标题
            title: "欢迎来到JrForum",

            // 内容
            content: "快来发布帖子吧!",

            // (勿改)
            id: 0,
            topic: "others",
            user: {
                nickname: "系统",
                id: -1,
                descript: "系统用户",
                owns: {
                    coin: 0,
                    level: 1,
                    arch: [
                        0
                    ]
                },
                login: false
            },
            reply: []
        }
    }
}
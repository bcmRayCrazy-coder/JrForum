var postPage = new Vue({
    el: "#post",
    data: {
        topics: [
            ["fucks", "吐槽"],
            ["arts", "美术"],
            ["musics", "音乐"],
            ["games", "游戏"],
            ["helps", "帮助"],
            ["chats", "聊天"],
            ["suggests", "建议"],
            ["others", "其他"],
        ],
        topic: "others",
        title: "",
        content: ""
    },
    methods: {
        submit: () => {
            var title = postPage.title;
            var content = postPage.content;
            var topic = postPage.topic;
            if (title == "" || content == "") {
                mdui.alert("不能为空");
                return;
            }
            axios.post('/api/postPost', {
                title,
                topic,
                content
            }).then(({ data }) => {
                if (data.err) { mdui.alert("发生了错误:\n" + data.err.msg) } else {
                    mdui.alert('发送成功!');
                    window.location.href = "/posts/id/" + String(data.id);
                }
            }).catch((err) => {
                mdui.alert('发生错误,请查看console');
                console.error(err)
            })
        },
        reset: () => {
            postPage.title = "";
            postPage.content = "";
            postPage.topic = "others";
        }
    }
});
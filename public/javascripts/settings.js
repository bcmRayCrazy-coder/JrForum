var imgS = new Vue({
    el: "#iS",
    data: {
        uip: ''
    },
    methods: {
        uplUImg: async() => {
            if (imgS.uip.length !== 0) {
                // var image = new FormData()
                // image.append('avatar', imgS.uip);
                var p = (await axios.post('/api/avator', imgS.uip, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    cookie: document.cookie
                })).data;
                console.log(p);
            }
        },
        changeImage(e) {
            var file = e.target.files[0]
            var reader = new FileReader()
            var that = this
            reader.readAsDataURL(file)
            reader.onload = function(e) {
                imgS.uip = this.result
            }
        }

    }
})
require(['httpKit','PullUpDown','backTop'], function (httpKit,PullUpDown,backTop) {
    new Vue({
        el: '#gnotice',
        components: {
            'pull-up-down':PullUpDown,
            'back-top':backTop
        },
        template: `<div class="noticeDetail">
                      <h3>{{content.title}}</h3>
                      <span style="margin-right:5px;font-size:12px;color:#999">{{content.signature}}</span><time>{{content.createTime}}</time>
                      <div v-html="content.content"></div>
                    </div>
                    `,
        data() {
            return {
                content:'',
                noticeid:httpKit.urlParams().noticeid
            };
        },
        methods: {
            getcontent(){
                var self = this;
                var data = {
                    "noticeId":self.noticeid
                };
                self.$toast.loading({ forbidClick: true, duration: 0});
                httpKit.post("/hywork/home/notice/detail",data, httpKit.type.form).then(res=>{
                    self.$toast.clear();
                    console.info(res);
                    self.content = res.data
                }).catch(err => {
                    self.$toast.clear();
                    self.$toast.fail({
                        message: err.message
                    });
                });
            },
            read(){
                var self = this;
                var data = {
                    "noticeId":self.noticeid
                };
                self.$toast.loading({ forbidClick: true, duration: 0});
                httpKit.post("/hywork/home/notice/read",data, httpKit.type.form).then(res=>{
                    self.$toast.clear();
                }).catch(err => {
                    self.$toast.clear();
                    self.$toast.fail({
                        message: err.message
                    });
                });
            }
        },
        computed: {

        },
        created(){

        },
        mounted(){
            this.$nextTick(function () {
                var self = this;
                self.getcontent();
                self.read();
            })
        }

    });
});
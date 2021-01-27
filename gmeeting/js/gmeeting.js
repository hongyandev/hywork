require(['httpKit'], function (httpKit) {
    new Vue({
        el: '#gmeet',
        template: `<div style="text-align: center;margin-top:20%">
                       <van-icon v-show="result.success == true" size="100px" color="#009D85" name="checked" />
                       <van-icon v-show="result.success == false || result == null" size="100px" color="#f00" name="clear" />
                       <div>{{result.message}}</div>
                       <div v-show="show">
                            <div style="margin: 20px 20px 15px">请通过鸿雁云商打开扫一扫</div>
                            <div style="margin: 20px 20px 15px;font-size:13px;">方法一：进入鸿雁云商 - 我的 - 扫一扫；</div>
                            <div style="margin: 20px 20px 15px;font-size:13px;">方法二：进入鸿雁云商 - 首页 - 会议管理 - 扫一扫</div>
                        </div>
                    </div>
                    `,
            data() {
                return {
                    result:'',
                    token:httpKit.urlParams().token,
                    show:false
                }
            },
            methods: {
                getsign(token){
                    var self = this;
                    var data={
                        'token':token
                    };
                    self.$toast.loading({ forbidClick: true, duration: 0});
                    httpKit.post("/meeting/signin",data,httpKit.type.form).then(res=>{
                        self.$toast.clear();
                        self.result = res
                    }).catch(err => {
                        self.$toast.clear();
                        self.$toast.fail({
                            message: err.message
                        });
                    });
                }
            },
            created(){

            },
            mounted(){
                var browser = navigator.userAgent.toLowerCase();
                if(browser.match(/Alipay/i)=="alipay"){
                    console.log("支付宝app的浏览器");
                    this.show = true;
                    return false;
                }else if(browser.match(/MicroMessenger/i)=="micromessenger"){
                    console.log("微信app的浏览器");
                    this.show = true;
                    return false
                }

                this.getsign(this.token)
            }
        });

});
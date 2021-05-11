require(['httpKit'], function (httpKit) {
    new Vue({
        el: '#gsubmitOk',
        template: `<div>
                       <div class="empty">
                            <van-icon class="success" color="#07c160" name="passed"/>
                            <p>订单提交{{msg}}</p>
                            <div class="buttons">
                                <van-button  type="primary" @click="goShoping" block>继续购物</van-button>
                                <van-button plain type="primary" @click="goOrder" block>查看订单</van-button>
                            </div>
                       </div>
                       <div class="btnGroup">
                           <van-icon name="manager-o" @click="gorder" />
                           <div class="space-line"></div>
                           <van-icon name="apps-o" @click="gcoffee"/>
                           <div class="space-line"></div>
                           <div v-if="cartNum == 0" @click="gcart">
                               <van-icon name="shopping-cart-o" size="24px" color="#fff"/>
                           </div>
                           <van-badge v-else :content="cartNum">
                                <div @click="gcart">
                                    <van-icon name="shopping-cart-o" size="24px" color="#fff"/>
                                </div>
                           </van-badge>
                       </div>
                    </div>
                    `,
        data() {
            return {
                payId: httpKit.urlParams().out_trade_no ? httpKit.urlParams().out_trade_no : '',
                msg:'中......',

            };
        },
        methods: {
            getResult(){
                var self = this;
                    this.$toast.loading({forbidClick: true, duration: 0});
                    var data = {
                        out_trade_no: self.payId
                    };
                    httpKit.post("/coffee/pay/result", data, httpKit.type.form).then(res => {
                        self.$toast.clear();
                        if(res.data.paystatus=='2'){
                            self.msg = '成功'
                        }else if(res.data.paystatus=='' ||!res.data.paystatus){
                            self.msg = '中......'
                        }else{
                            self.msg = '失败'
                        }

                    }).catch(err => {
                        self.$toast.clear();
                        self.$toast.fail({
                            message: err.message
                        });
                    });
            },
            goShoping(){
                window.location.href='../gcoffee/gcoffee.html'
            },
            goOrder(){
                window.location.href='../gcoffeeOrder/gcoffeeOrder.html'
            },
            gcart(){
                window.location.href='../gcoffee/gcoffee.html?showcart=1'
            },
            gorder(){
                window.location.href='../gcoffeeOrder/gcoffeeOrder.html'
            },
            gcoffee(){
                window.location.href='../gcoffee/gcoffee.html'
            }
        },
        computed: {

        },
        watch:{

        },
        created(){

        },
        mounted(){
            var self = this;
            self.$nextTick(function () {
               self.getResult();
            })
        }
    });
});
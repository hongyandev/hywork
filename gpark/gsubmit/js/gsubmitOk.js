require(['httpKit'], function (httpKit) {
    new Vue({
        el: '#gsubmitOk',
        template: `<div>
                       <div v-if="status==2" class="empty">
                            <van-icon class="success" color="#07c160" name="passed"/>
                            <p>支付成功！</p> 
                            <div class="buttons">
                                <van-button plain type="primary" @click="goOrder" block>查看订单</van-button>
                                <van-button  type="primary" @click="goShoping" block>继续购物</van-button>
                            </div>
                       </div>
                       <div v-else-if="status==9" class="empty">
                            <van-icon class="fail" name="close" color="#f00" />
                            <p>支付超时！</p>
                            <div class="buttons">
                                <van-button plain type="primary" @click="goOrder" block>查看订单</van-button>
                                <van-button  type="primary" @click="goShoping" block>继续购物</van-button>
                            </div>
                       </div>
                       <div v-else-if="status==3" class="empty">
                            <van-icon class="fail" name="close" color="#f00" />
                            <p>支付异常！</p>
                            <div class="buttons">
                                <van-button plain type="primary" @click="goOrder" block>查看订单</van-button>
                                <van-button  type="primary" @click="goShoping" block>继续购物</van-button>
                            </div>
                       </div>
                       <div v-else class="empty">
                            <van-loading size="80px" type="spinner" color="#006633" />
                            <p>支付中。。。</p>
                            <div class="buttons">
                                <van-button plain type="primary" @click="goOrder" block>查看订单</van-button>
                                <van-button  type="primary" @click="goShoping" block>继续购物</van-button>
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
                out_trade_no:'' ||  JSON.parse(localStorage.getItem('paycode')).out_trade_no,
                status:1,
                cartNum:JSON.parse(localStorage.getItem('cartLength'))

            };
        },
        methods: {
            getResult(){
                var self = this;
                self.$toast.loading({forbidClick: true, duration: 0});
                var data = {
                    out_trade_no: self.out_trade_no
                };
                httpKit.post("/coffee/pay/result", data, httpKit.type.form).then(res => {
                    self.$toast.clear();
                    self.status = res.data.paystatus * 1;
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
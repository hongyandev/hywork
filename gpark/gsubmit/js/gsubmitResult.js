require(['httpKit'], function (httpKit) {
     new Vue({
        el: '#gsubmitOk',
        template: `<div>
                       <div v-if="status==2" class="empty">
                            <van-icon class="success" color="#07c160" name="passed"/>
                            <p>支付成功！</p> 
                            <div class="buttons">
                                <van-button  type="primary" @click="goShoping" block>继续购物</van-button>
                                <van-button plain type="primary" @click="goOrder" block>查看订单</van-button>
                            </div>
                       </div>
                       <div v-else-if="status==9" class="empty">
                            <van-icon class="fail" name="close" color="#f00" />
                            <p>支付超时！</p>
                            <div class="buttons">
                                <van-button  type="primary" @click="goShoping" block>继续购物</van-button>
                                <van-button plain type="primary" @click="goOrder" block>查看订单</van-button>
                            </div>
                       </div>
                       <div v-else-if="status==3" class="empty">
                            <van-icon class="fail" name="close" color="#f00" />
                            <p>支付异常！</p>
                            <div class="buttons">
                                <van-button  type="primary" @click="goShoping" block>继续购物</van-button>
                                <van-button plain type="primary" @click="goOrder" block>查看订单</van-button>
                            </div>
                       </div>
                       <div v-else class="empty">
                            <van-loading size="80px" type="spinner" color="#006633" />
                            <p>支付中。。。</p>
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
                out_trade_no:'' ||  JSON.parse(localStorage.getItem('paycode')).out_trade_no,
                //timeStamp:null,
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
                        //vm.$set(self,'status', res.data.paystatus);
                        self.status = res.data.paystatus
                    }).catch(err => {
                        self.$toast.clear();
                        self.$toast.fail({
                            message: err.message
                        });
                        clearTimeout(self.timeStamp);
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
            var self = this;
            var paydata = JSON.parse(localStorage.getItem('paydata'));
            if(paydata || self.out_trade_no){
                if(paydata){
                    self.out_trade_no = paydata.code;
                }
                var paycode = {
                    "out_trade_no":self.out_trade_no
                };
                window.localStorage.setItem('paycode', JSON.stringify(paycode));
                self.out_trade_no = JSON.parse(localStorage.getItem('paycode')).out_trade_no;
                if(!self.out_trade_no) {
                    self.$dialog.alert({
                        message: '订单支付失败,查看订单列表',
                    }).then(() => {
                        window.location.href='../gcoffeeOrder/gcoffeeOrder.html'
                    });
                } else {
                    window.localStorage.removeItem('paydata');
                    if(paydata){
                        const div = document.createElement("div");
                        div.innerHTML = paydata.paystr;
                        document.body.appendChild(div);
                        document.forms[0].submit();
                    }

                }
            } else {
                self.$dialog.alert({
                    message: '支付订单创建失败,查看订单列表',
                }).then(() => {
                    window.location.href='../gcoffeeOrder/gcoffeeOrder.html'
                });
            }
        },
        mounted(){
            var self = this;
            self.$nextTick(function () {
                var count = 0;
                var timeStamp = null;

                    function execTimer(fn,timer){
                        if(timeStamp)
                            clearTimeout(timeStamp);
                        timeStamp = setTimeout(function(){
                            count++;
                            if(count <= (3 * 60 * 1000 / timer)){
                                fn();
                                execTimer(fn,timer);
                                if(self.status==2){
                                    clearTimeout(timeStamp);
                                }
                                if(self.status==3|| self.status==9){
                                    clearTimeout(timeStamp);
                                }
                            }else{
                                clearTimeout(timeStamp);
                            }
                        },timer);
                    }
                    execTimer(()=>{
                        self.getResult()

                    },5 * 1000)

            })
        }
    });
});
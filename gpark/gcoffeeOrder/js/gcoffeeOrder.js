require(['PullUpDown','httpKit'],function (PullUpDown,httpKit) {
    new Vue({
        el: '#gcoffeeOrder',
        components: {
          'PullUpDown': PullUpDown
        },
        template: `<div class="bg"> 
                    <div v-if="dataList.length>0" class="shopContent">
                         <PullUpDown ref="pull" :pullDown="false" :currentPage="page" :count="count" :sum="sum" @nextPage="getorder">
                                <ul>
                                    <li v-for="(data,i) in dataList" :key="i">
                                        <div class="order-top">
                                               <time>{{data.credat}}</time> 
                                               <span>{{data.paytype == '1' ? '支付宝' : '挂账'}}</span>
                                        </div>
                                        <div v-for="(order,index) in data.details">
                                            <van-card 
                                              :num="order.buynum"
                                              :price="order.price*1.00"
                                              :origin-price="order.originalPrice*1.00"
                                              :title="order.name"
                                              :thumb="order.ossurl"
                                            >
                                            </van-card>
                                        </div>
                                        <div class="operat-btn">
                                            <div>
                                                <span>合计：￥{{data.amount}}</span>
                                            </div>
                                            <div class="btns">
                                                <van-button @click="gpay(data.code)" v-show="data.paytype=='1' && (data.paystatus=='1'||data.paystatus=='3')" round type="danger" size="small">去付款</van-button>
                                                <van-button v-show="data.paytype=='1' && data.paystatus=='2'" round type="default" size="small">已付款</van-button>
                                                <van-button v-show="data.paytype=='2' && data.status=='1'" round type="default" size="small">等待审批</van-button>
                                                <van-button v-show="data.paytype=='2' && data.status=='2'" round type="default" size="small">审批已通过</van-button>
                                                <van-button v-show="data.paytype=='2' && data.status=='3'" round type="default" size="small">订单已取消</van-button>
                                                <van-button v-show="data.paytype=='1' && data.status=='9'" round type="default" size="small">订单超时关闭</van-button>
                                                <!--<van-button round type="primary"  size="small">确认收货</van-button>
                                                <van-button round type="default"  size="small">申请退款</van-button>-->
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </PullUpDown>
                        </div>
                        <van-empty v-else description="目前还没有订单" />
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
                   </div>`,
            data() {
                return {
                    active:0,
                    page: 1,
                    count: 5,
                    limit:10,
                    sum: 50,
                    dataList:[],
                    cartNum:0 || localStorage.getItem('cartLength'),

                };
            },
            methods: {
                getorder (){
                    var self = this;
                    this.$toast.loading({forbidClick: true, duration: 0});
                    var data={
                        "limit":self.limit,
                        "page":self.page
                    }
                    httpKit.post("/coffee/order/list", data, httpKit.type.form).then(res => {
                        self.$toast.clear();
                        console.info(res.data);
                        self.sum = res.count;
                        self.count = _.ceil(res.count / self.limit);
                        if(self.page == '1'){
                            self.dataList = res.data;
                        }else{
                            self.dataList = self.dataList.concat(res.data)
                        }
                        if(self.dataList.length>0){
                            self.page++;
                        }
                    }).catch(err => {
                        self.$toast.clear();
                        self.$toast.fail({
                            message: err.message
                        });
                    });
                },
                gpay(code){
                    var data = {
                        out_trade_no: code,
                    };
                    httpKit.post("/coffee/order/pay", data ,httpKit.type.formData).then(res => {
                        this.$toast.clear();
                        console.info(res.data);
                        if(res.data){
                            window.localStorage.setItem('paydata', JSON.stringify(res.data));
                            window.location.href='../gsubmit/gsubmitResult.html';
                        }

                    }).catch(err => {
                        this.$toast.clear();
                        this.$toast.fail({
                            message: err.message
                        });
                    });
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
            created(){

            },
            mounted(){
               this.getorder();
            }
        });

});
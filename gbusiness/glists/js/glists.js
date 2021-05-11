require(['PullUpDown','httpKit'],function (PullUpDown,httpKit) {
    new Vue({
        el: '#gtabs',
        components: {
          'PullUpDown': PullUpDown
        },
        template: `<div>
                       <van-tabs v-model="active" @click="onClick" sticky>
                          <van-tab>
                            <template #title> 
                                <van-badge v-if="ordercount>0" :content="ordercount"><span>新订单</span></van-badge> 
                                <span v-else>新订单</span>
                            </template>
                            <div  v-if="dataList.length>0">
                                <PullUpDown ref="pull" :pullDown="false" :currentPage="page" :count="count" :sum="sum" @nextPage="orderlist">
                                <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                                <ul class="order">
                                    <li v-for="(data,i) in dataList">
                                       <div class="order-top">
                                            <span><i class="new-icon">新</i>{{data.credat}}</span>
                                            <label>￥<b>{{data.amount}}</b></label>
                                        </div>
                                       <div class="order-item">
                                           <div class="order-item-addr"><van-icon name="location-o" />{{data.address}}</div> 
                                           <div class="order-item-info">
                                                <div><van-icon color="#333" name="contact" /><span>{{data.contact}}</span></div> 
                                                <div><van-icon color="#333" name="phone-o" /><span @click="tel(data.tel)">{{data.tel}}</span></div>
                                           </div>
                                           <div class="order-note">
                                                <span>订单详情：</span>
                                                <div><b v-for="item in data.details">{{item.name}} × {{item.buynum}}</b></div>
                                           </div>
                                           <div class="order-note">
                                                <span>送达时间：</span>
                                                <div><b>{{data.reservedate}}</b></div>
                                                <div v-show="data.note">备注信息：{{data.note}}</div>
                                           </div>
                                        </div> 
                                        <div class="order-btn">
                                        <van-button round @click="goverorder(data.code)" color="linear-gradient(to right, #fe6d4d, #ee0a24)" block><b>编号{{data.id}}</b> 已制作</van-button>
                                        </div>
                                    </li>
                                </ul>
                             </van-pull-refresh>
                            </PullUpDown>
                            </div>
                            <van-empty v-else description="目前还没有新订单" />
                          </van-tab>
                          <van-tab title="已完结">
                          <div v-if="dataList.length>0">
                                 <PullUpDown ref="pulltwo"  :pullDown="false" :currentPage="page" :count="count" :sum="sum" @nextPage="getTorder">
                                 <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                                <ul class="order">
                                    <li v-for="(data,i) in dataList">
                                       <div class="order-top">
                                            <em>{{data.credat}}</em>
                                            <label>￥<b>{{data.amount}}</b></label>
                                        </div>
                                       <div class="order-item">
                                           <div class="order-item-addr"><van-icon name="location-o" />{{data.address}}</div> 
                                           <div class="order-item-info">
                                                <div><van-icon color="#333" name="contact" /><span>{{data.contact}}</span></div> 
                                                <div><van-icon color="#333" name="phone-o" /><span @click="tel(data.tel)">{{data.tel}}</span></div>
                                           </div>
                                           <div class="order-note">
                                                <span>订单详情：</span>
                                                <div><b v-for="item in data.details">{{item.name}} × {{item.buynum}}</b></div>
                                           </div>
                                           <div class="order-note">
                                                <span>送达时间：</span>
                                                <div><b>{{data.reservedate}}</b></div>
                                                <div>备注信息：{{data.note}}</div>
                                           </div>
                                        </div> 
                                      
                                    </li>
                                </ul>
                             </van-pull-refresh>
                            </PullUpDown>
                            </div>
                           <van-empty v-else description="目前还没有完结订单" />
                          </van-tab>
                       </van-tabs>
                       <div @click="gclose" v-if="status==2" class="setting bg-color"><van-icon name="clock-o" /></div>
                       <div @click="gopen" v-else class="setting bg-gray"><van-icon name="clock-o" /></div>
                   </div>`,
            data() {
                return {
                    ordercount:0,
                    active:0,
                    page: 1,
                    count: 5,
                    limit:10,
                    sum: 50,
                    dataList:[],
                    isLoading:false,
                    orderList:[],
                    status: ''
                };
            },
            methods: {
                tel(phoneNumber){
                    window.location.href = "tel:" + phoneNumber;
                },
                gopen(){
                    var self = this;
                    var data={
                        "status":2,
                    }
                    self.$dialog.confirm({
                        message: '现在开启，店铺将继续营业',
                    })
                    .then(() => {
                            // on confirm
                        self.$toast.loading({forbidClick: true, duration: 0});
                       httpKit.post("/coffee/on/off", data, httpKit.type.form).then(res => {
                            self.$toast.clear();
                            console.info(res.data);
                           self.status=res.data.status
                        }).catch(err => {
                        self.$toast.clear();
                        self.$toast.fail({
                            message: err.message
                        });
                          });

                    })
                    .catch(() => {
                            // on cancel
                    });

                },
                gclose(){
                    var self = this;

                    var data={
                        "status": 1,
                    }
                    self.$dialog.confirm({
                        message: '确定要暂停营业吗，线上将无法下单',
                    })
                    .then(() => {
                        self.$toast.loading({forbidClick: true, duration: 0});
                            httpKit.post("/coffee/on/off", data, httpKit.type.form).then(res => {
                                self.$toast.clear();
                                console.info(res.data);
                                self.status=res.data.status
                            }).catch(err => {
                                self.$toast.clear();
                                self.$toast.fail({
                                    message: err.message
                                });
                            });

                        })
                    .catch(() => {
                            // on cancel
                     });

                },
                orderlist (){
                    var self = this;
                    self.$toast.loading({forbidClick: true, duration: 0});
                    var data={
                        "dostatus":self.active == 0 ? 1 : 2,
                        "limit":self.limit,
                        "page":self.page
                    }
                    httpKit.post("/coffee/order/list", data, httpKit.type.form).then(res => {
                        self.$toast.clear();
                        self.isLoading = false;
                       // console.info(res.data);
                        if(self.active == 0){
                            self.ordercount = res.count
                        }
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
                        if(self.active=='0'){
                            if (self.dataList && self.dataList.length > 0 && self.$refs['pull'])
                                self.$refs['pull'].closePullDown();
                        }
                        if(self.active=='1'){
                            if (self.dataList && self.dataList.length > 0 && self.$refs['pulltwo'])
                                self.$refs['pulltwo'].closePullDown();
                        }
                    }).catch(err => {
                        self.$toast.clear();
                        self.$toast.fail({
                            message: err.message
                        });
                    });
                },
                getTorder(){
                    this.page = 1;
                    this.orderlist()
                },
                onRefresh (){
                    this.page = 1;
                    this.orderlist()
                },
                onClick(name, title) {
                    //console.info(name)
                    this.page = 1;
                    this.orderlist()
                },
                goverorder(code){
                    var data = {
                        out_trade_no: code,
                    };
                    httpKit.post("/coffee/do/status", data ,httpKit.type.formData).then(res => {
                        this.$toast.clear();
                        console.info(res.data);
                        this.page = 1;
                        this.orderlist()

                    }).catch(err => {
                        this.$toast.clear();
                        this.$toast.fail({
                            message: err.message
                        });
                    });
                }
            },
            created(){
                var self = this;
                self.page = 1;
                self.orderlist();
            },
            mounted(){
             var self = this;
                self.$toast.loading({forbidClick: true, duration: 0});
                httpKit.post("/coffee/shop/ok").then(res => {
                    self.$toast.clear();
                    console.info(res.data);
                    self.status = res.data.status
                }).catch(err => {
                    self.$toast.clear();
                    self.$toast.fail({
                        message: err.message
                    });
                });

            }
        });

});
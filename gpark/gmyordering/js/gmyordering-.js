require(['httpKit','PullUpDown','backTop'], function (httpKit, PullUpDown, backTop) {
    new Vue({
        el: '#gordering',
        components: {
            'pull-up-down':PullUpDown,
            'back-top':backTop
        },
        template: `<div>
                        <van-tabs sticky v-model="active" color="#009D85" @click="orderlist">
                          <van-tab v-for="tab in tabs" :title="tab.title" :name="tab.name" >
                                <div v-if="tab.name=='0'">
                                    <div v-if="dataList.length>0">
                                        <pull-up-down :ref="tab.name" :pullDown="false" :currentPage="page" :count="count" :sum="sum" @nextPage="gorderlist(tab.name,tab.title)">
                                                 <ul class="myorder">
                                                    <li v-for="item in dataList"> 
                                                        <van-swipe-cell :goodid="item.id" :before-close="beforeClose">
                                                            <template #default>
                                                            <div class="lists-jc">
                                                                <div class="jc-item">
                                                                    <div class="clearfix">
                                                                        <time>{{item.completedTime}}</time>
                                                                    </div>
                                                                    <div class="jc-title"><span v-html="item.details"></span></div>
                                                                </div>
                                                                <div class="flex-item"><div>{{item.statusName}}</div><span>总金额：￥<b>{{item.goodsTotal}}</b></span></div>
                                                            </div>
                                                            </template>
                                                            <template #right>
                                                                  <van-button @click="delete(item.id)" square type="danger" text="删除" />
                                                            </template>
                                                        </van-swipe-cell>
                                                    </li>
                                                    <!--<li v-for="item in dataList">
                                                         <van-cell class="lists-jc" center :title="item.reserveTypeName" :label="item.reserveDate+' '+item.reserveTime" :value="item.statusName" >
                                                            <template #title>
                                                                <div class="clearfix">
                                                                    <time>{{item.completedTime}}</time>
                                                                    <span class="custom-title">总金额：￥<b>{{item.goodsTotal}}</b></span>
                                                                </div> 
                                                          </template>
                                                          <template #label>
                                                                <div v-html="item.details"></div>
                                                          </template>
                                                        </van-cell>
                                                    </li>-->
                                                 </ul>
                                         </pull-up-down>
                                    </div>
                                    <van-empty v-else description="没有预订单" />
                                </div>
                                <div v-else>
                                    <div v-if="orderList.length>0">
                                        <pull-up-down :ref="tab.name" :pullDown="false" :currentPage="page" :count="count" :sum="sum" @nextPage="gorderlist(tab.name,tab.title)">
                                                 <ul class="mayorder">
                                                   <li v-for="item in orderList">
                                                        <van-cell :url="'../gmyordering/gmyorderDetail.html?id='+item.id" is-link center :title="item.reserveTypeName" :label="item.reserveDate+' '+item.reserveTime" :value="item.statusName" >
                                                            <template #title>
                                                                <span class="custom-title">{{item.reserveTypeName}}</span>
                                                                <span>({{item.number}}人)</span>
                                                          </template>
                                                        </van-cell>
                                                    </li>
                                                 </ul>
                                         </pull-up-down>
                                    </div>
                                    <van-empty v-else description="没有预订单" />
                                </div> 
                          </van-tab>
                        </van-tabs>
                        <div>
                        
                        </div>
                   </div>
                    `,
            data() {
                return {
                    active:"0",
                    tabs:[
                        {
                            name:'3',
                            title:'加班餐',
                            zref:'jb'
                        },
                        {
                            name:'2',
                            title:'商务餐',
                            zref:'sw'
                        },
                        {
                            name:'1',
                            title:'包厢',
                            zref:'bx'
                        },
                        {
                            name:'0',
                            title:'净菜',
                            zref:'jc'
                        },
                    ],
                    page:1,
                    limit:8,
                    sum:0,
                    count:0,
                    dataList:[],
                    orderList:[],
                };
            },
            methods: {
                orderlist(name,title){
                    var self = this;
                    self.page = 1;
                    var orderdata = {
                        "reserveType":name,
                        "limit":self.limit,
                        "page":self.page
                    };
                    if(name == '0'){
                        self.$toast.loading({ forbidClick: true, duration: 0});
                        httpKit.post("/park/shop/order/dishesOrder/list",orderdata,httpKit.type.form).then(res=>{
                            self.$toast.clear();
                            console.info(res);
                            //self.dataList = res.data;
                            self.sum = res.count;
                            self.count = _.ceil(res.count / self.limit);
                            self.dataList = res.data;

                        }).catch(err => {
                            self.$toast.clear();
                            self.$toast.fail({
                                message: err.message
                            });
                        });
                    }else{
                        self.$toast.loading({ forbidClick: true, duration: 0});
                        httpKit.post("/reserve/canyin/list",orderdata,httpKit.type.form).then(res=>{
                            self.$toast.clear();
                            console.info(res);
                            //self.dataList = res.data;
                            self.sum = res.count;
                            self.count = _.ceil(res.count / self.limit);
                            //if(self.page == '1'){
                             self.orderList = res.data;

                        }).catch(err => {
                            self.$toast.clear();
                            self.$toast.fail({
                                message: err.message
                            });
                        });
                    }
                },
                gorderlist(name,title){
                    console.info(name)
                    var self = this;
                    self.page++;
                    var orderdata = {
                        "reserveType":name,
                        "limit":self.limit,
                        "page":self.page
                    };
                    if(name=='0'){//净菜
                        self.$toast.loading({ forbidClick: true, duration: 0});
                        httpKit.post("/park/shop/order/dishesOrder/list",orderdata,httpKit.type.form).then(res=>{
                            self.$toast.clear();
                            console.info(res);
                            //self.dataList = res.data;
                            self.sum = res.count;
                            self.count = _.ceil(res.count / self.limit);
                            self.dataList = self.dataList.concat(res.data);
                            if (self.page >= '1')
                                self.$refs[name][0].closePullDown();
                        }).catch(err => {
                            self.$toast.clear();
                            self.$toast.fail({
                                message: err.message
                            });
                        });
                    }else{
                        self.$toast.loading({ forbidClick: true, duration: 0});
                        httpKit.post("/reserve/canyin/list",orderdata,httpKit.type.form).then(res=>{
                            self.$toast.clear();
                            console.info(res);
                            //self.dataList = res.data;
                            self.sum = res.count;
                            self.count = _.ceil(res.count / self.limit);
                            self.orderList = self.orderList.concat(res.data);
                            if (self.page >= '1')
                                self.$refs[name][0].closePullDown();

                        }).catch(err => {
                            self.$toast.clear();
                            self.$toast.fail({
                                message: err.message
                            });
                        });

                    }

                },
                beforeClose(obj) {
                    var self = this;
                    switch (obj.position) {
                        case 'outside':
                            obj.instance.close();
                            break;
                        case 'right':
                            self.$dialog.confirm({
                                message: '确定要删除此订单吗？',
                            }).then(() => {
                                self.$toast.loading({ forbidClick: true, duration: 0});
                                httpKit.post("/park/shop/order/dishesOrder/cancel",{orderId:obj.instance.$attrs.goodid},httpKit.type.form).then(res=>{
                                    self.$toast.clear();
                                    console.info(res);
                                    self.active = '0';
                                    self.orderlist('0','净菜')
                                }).catch(err => {
                                    self.$toast.clear();
                                    self.$toast.fail({
                                        message: err.message
                                    });
                                });
                            });
                            break;
                    }
                },
                delete(orderid){

                }
            },
            created(){

            },
            mounted(){
                this.$nextTick(function () {
                    var type = httpKit.urlParams().type;
                    if(type=='jc'){
                        this.active = '0';
                        this.orderlist('0','净菜')
                    }else if(type=='vip'){
                        this.active = '1';
                        this.orderlist('1','包厢')
                    }else if(type=='swc'){
                        this.active = '2';
                        this.orderlist('2','商务餐')
                    }else{
                        this.active = '3';
                        this.orderlist('3','加班餐')
                    }

                })
            }
        });

});
require(['httpKit','lodash'], function (httpKit, _) {
    new Vue({
        el: '#gordering',
        template: `<div class="bg">
                        <div class="detailMenu">
                            <van-cell center >
                                <template #title>
                                    <span class="custom-title">{{dataDetail.reserveTypeName}}</span>
                                    <span>({{dataDetail.number}}人)</span>
                                    <div style="font-size: 12px;color:#999"><span>用餐标准：{{dataDetail.reservePrice}}元/人</span></div>
                                    <div v-show="dataDetail.room" style="font-size: 14px;color:#999"><span>房间号：{{dataDetail.room}}</span></div>
                                    <div style="font-size: 12px;color:#999">{{dataDetail.reserveDate}} {{dataDetail.reserveTime}}</div>
                                  </template>
                                  <template #default>
                                    <span>{{dataDetail.statusName}}</span>
                                    <div v-show="dataDetail.status=='5'">取餐码：<span style="color:#333">{{dataDetail.code}}</span></div>
                                  </template>
                                  <!--<template #label>
                                        <span v-show="dataDetail.menu">菜单：{{dataDetail.menu}}</span>
                                  </template>-->
                            </van-cell>
                            <van-cell v-show="dataDetail.menu">
                                <template #title><div class="menu-title"><span style="font-size: 12px;color:#999;">菜单</span><span>预订合计：￥{{total}}</span></div></template>
                                <template #label>
                                    <ul>
                                        <li v-for="(val, key) in menus">
                                            <span>{{key}}</span>：
                                            <span style="margin-right:10px;" v-for="item in val">{{item.dishesName}}:￥{{item.price}}</span>
                                        </li>
                                    </ul>
                                </template>
                            </van-cell>
                            <div v-if="dataDetail.status == '0'"></div>
                            <div v-else class="button">
                                <label v-show="dataDetail.actualReservePrice">总金额：￥{{dataDetail.actualReservePrice}}</label>
                                <van-button v-if="dataDetail.reserveType=='1' || dataDetail.reserveType=='2'" @click="cancelOrder" plain hairline v-show="dataDetail.status=='3' || dataDetail.status=='4'||dataDetail.status=='5'" size="small" type="danger">取消预订</van-button>
                                <van-button @click="confirmOrder"  plain hairline v-show="dataDetail.status=='4'" size="small" type="primary">确认订单</van-button>
                                <van-button :url="'../gpark/gcomment/gcomment.html?id='+dataDetail.id" plain hairline v-show="dataDetail.status=='6' || dataDetail.status=='9'" size="small" type="primary">评价</van-button>
                            </div>         
                        </div>
                       <div class="bgimage">
                            <img src="/gpark/gmyordering/img/jyls.png">
                       </div>
                   </div>
                    `,
            data() {
                return {
                    dataDetail:'',
                    menu:[],
                    menus:{},
                    total:''
                };
            },
            methods: {
                loadorderDetail(){
                    var self = this;
                    self.$toast.loading({ forbidClick: true, duration: 0});
                    httpKit.post("/reserve/canyin/detail",{id:httpKit.urlParams().id}).then(res=>{
                        self.$toast.clear();
                        console.info(res);
                        self.dataDetail = res.data;
                        self.menu = self.dataDetail.menu ? eval(self.dataDetail.menu) : [];
                        self.menus = _.groupBy(self.menu, 'dishesType');
                        self.total = _.sum(self.menu.map(item=>{return Number(item.amount)}))
                    }).catch(err => {
                        self.$toast.clear();
                        self.$toast.fail({
                            message: err.message
                        });
                    });
                },
                confirmOrder(){
                    var self = this;
                    self.$toast.loading({ forbidClick: true, duration: 0});
                    httpKit.post("/reserve/canyin/confirm",{id:httpKit.urlParams().id}).then(res=>{
                        self.$toast.clear();
                        console.info(res);
                        self.$dialog.alert({
                            title: '预订成功！',
                        }).then(() => {
                            // on close
                            window.location.href='../gpark/gmyordering/gmyordering.html'
                        });
                    }).catch(err => {
                        self.$toast.clear();
                        self.$toast.fail({
                            message: err.message
                        });
                    });
                },
                cancelOrder(){
                    var self = this;
                    self.$toast.loading({ forbidClick: true, duration: 0});
                    httpKit.post("/reserve/canyin/cancel",{id:httpKit.urlParams().id}).then(res=>{
                        self.$toast.clear();
                        console.info(res);
                        self.$dialog.alert({
                            title: '取消成功',
                        }).then(() => {
                            // on close
                            window.location.href='../gpark/gmyordering/gmyordering.html'
                        });

                    }).catch(err => {
                        self.$toast.clear();
                        self.$toast.fail({
                            message: err.message
                        });
                    });
                },

            },
            created(){
                this.loadorderDetail()

            },
            mounted(){

            }
        });

});
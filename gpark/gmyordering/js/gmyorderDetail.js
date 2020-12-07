require(['httpKit','PullUpDown','backTop'], function (httpKit, PullUpDown, backTop) {
    new Vue({
        el: '#gordering',
        components: {
            'pull-up-down':PullUpDown,
            'back-top':backTop
        },
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
                                    <div>取餐码：<span style="color:#333">{{dataDetail.code}}</span></div>
                                  </template>
                                  <template #label>
                                        <span v-show="dataDetail.menu">菜单：{{dataDetail.menu}}</span>
                                  </template>
                            </van-cell>
                            <div class="button">
                                <label v-show="dataDetail.actualReservePrice">总金额：￥{{dataDetail.actualReservePrice}}</label>
                                <van-button @click="cancelOrder" plain hairline v-show="dataDetail.status=='3' || dataDetail.status=='4'||dataDetail.status=='5'" size="small" type="danger">取消预订</van-button>
                                <van-button @click="confirmOrder"  plain hairline v-show="dataDetail.status=='4'" size="small" type="primary">确认订单</van-button>
                                <van-button :url="'../gcomment/gcomment.html?id='+dataDetail.id" plain hairline v-show="dataDetail.status=='6' || dataDetail.status=='9'" size="small" type="primary">评价</van-button>
                            </div>         
                        </div>
                       <div class="bgimage">
                            <img src="/gpark/gmyordering/img/jyls.png">
                       </div>
                   </div>
                    `,
            data() {
                return {
                    dataDetail:''
                };
            },
            methods: {
                loadorderDetail(){
                    var self = this;
                    self.$toast.loading({ forbidClick: true, duration: 0});
                    httpKit.post("/reserve/canyin/detail",{id:httpKit.urlParams().id}).then(res=>{
                        self.$toast.clear();
                        console.info(res);
                        self.dataDetail = res.data
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
                            window.location.href='../gmyordering.html'
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
                            window.location.href='../gmyordering.html'
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
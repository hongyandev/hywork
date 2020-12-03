require(['httpKit','PullUpDown','backTop'], function (httpKit, PullUpDown, backTop) {
    new Vue({
        el: '#gordering',
        components: {
            'pull-up-down':PullUpDown,
            'back-top':backTop
        },
        template: `<div>
                        <div>
                        <pull-up-down ref="pull" :pullDown="false" :currentPage="page" :count="count" :sum="sum" @nextPage="loadorder()">
                        <ul class="mayorder" v-if="dataList.length>0">
                            <li v-for="item in dataList">
                                <van-cell :url="'../gmyordering/gmyorderDetail.html?id='+item.id" is-link center :title="item.reserveTypeName" :label="item.reserveDate+' '+item.reserveTime" :value="item.statusName" >
                                    <template #title>
                                        <span class="custom-title">{{item.reserveTypeName}}</span>
                                        <span>({{item.number}}人)</span>
                                  </template>
                                </van-cell>
                            </li>
                        </ul>
                        <van-empty v-else description="没有预定单" />
                        </pull-up-down>
                        </div>
                   </div>
                    `,
            data() {
                return {
                    page:0,
                    limit:10,
                    sum:0,
                    count:0,
                    dataList:[]
                };
            },
            methods: {
                loadorder(){
                    var self = this;
                    self.$toast.loading({ forbidClick: true, duration: 0});
                    var orderdata = {
                        "limit":self.limit,
                        "page":self.page
                    };
                    httpKit.post("/reserve/canyin/list",orderdata,httpKit.type.form).then(res=>{
                        self.$toast.clear();
                        console.info(res);
                        //self.dataList = res.data;
                        self.sum = res.count;
                        self.count = _.ceil(res.count / self.limit);
                        if(self.page == '1'){
                            self.dataList = res.data;
                        }else{
                            self.dataList = self.dataList.concat(res.data)
                        }
                        if(self.dataList.length > 0){
                            self.page++;
                        }
                        if (self.dataList && self.dataList.length > 0)
                            self.$refs['pull'].closePullDown();
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
                this.$nextTick(function () {
                    this.loadorder()
                })
            }
        });

});
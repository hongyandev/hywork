require(['httpKit','PullUpDown','backTop'], function (httpKit, PullUpDown, backTop) {
    new Vue({
        el: '#gordering',
        components: {
            'pull-up-down':PullUpDown,
            'back-top':backTop
        },
        template: `<div>
                        <van-tabs v-model="active" @click="gorderlist">
                          <van-tab v-for="tab in tabs" :title="tab.title" :name="tab.name" >
                                <pull-up-down :zref="tab.name" :ref="tab.name" :pullDown="false" :currentPage="page" :count="count" :sum="sum" @nextPage="gorderlist(tab.name,tab.title)">
                                 <div v-show="tab.name=='0'">
                                     <ul class="mayorder" v-if="dataList.length>0">
                                        <li v-for="item in dataList">
                                             <van-cell class="lists-jc" center :title="item.reserveTypeName" :label="item.reserveDate+' '+item.reserveTime" :value="item.statusName" >
                                                <template #title>
                                                    <div class="clearfix">
                                                        <span class="custom-title">总金额：￥{{item.goodsTotal}}</span>
                                                        <time>{{item.completedTime}}</time>
                                                    </div> 
                                              </template>
                                              <template #label>
                                                    <div v-html="item.details"></div>
                                              </template>
                                            </van-cell>
                                        </li>
                                    </ul>
                                    <van-empty v-else description="没有预定单" />
                                 </div>
                                 <div  v-show="tab.name=='1' || tab.name=='2' || tab.name=='3' ">
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
                                 </div>
                                </pull-up-down>
                          </van-tab>
                          <!--<van-tab title="商务餐" @click="gbussiness">
                            <pull-up-down ref="pull" :pullDown="false" :currentPage="page" :count="count" :sum="sum" @nextPage="loadorder()">
                                <ul class="mayorder" v-if="dataList.length>0">
                                    <li v-for="item in dataList">
                                        <van-cell :url="'../gmyordering/gmyorderDetail.html?id='+item.id" is-link center :title="item.reserveTypeName" :label="item.reserveDate+' '+item.reserveTime" :value="item.statusName" >
                                            <template #title>
                                                <span class="custom-title">{{item.reserveTypeName}}</span>
                                                <span>({{item.number}}人)</span>jing'cai
                                          </template>
                                        </van-cell>
                                    </li>
                                </ul>
                                <van-empty v-else description="没有预定单" />
                                </pull-up-down>
                          </van-tab>
                          <van-tab title="包 厢" @click="gviporder">
                            <pull-up-down ref="pull" :pullDown="false" :currentPage="page" :count="count" :sum="sum" @nextPage="loadorder()">
                                <ul class="mayorder" v-if="dataList.length>0">
                                    <li v-for="item in dataList">
                                        <van-cell :url="'../gmyordering/gmyorderDetail.html?id='+item.id" is-link center :title="item.reserveTypeName" :label="item.reserveDate+' '+item.reserveTime" :value="item.statusName" >
                                            <template #title>
                                                <span class="custom-title">{{item.reserveTypeName}}</span>
                                                <span>({{item.number}}人)</span>jing'cai
                                          </template>
                                        </van-cell>
                                    </li>
                                </ul>
                                <van-empty v-else description="没有预定单" />
                             </pull-up-down>
                          </van-tab>
                          <van-tab title="净 菜">
                            
                          </van-tab>-->
                        </van-tabs>
                        <div>
                        
                        </div>
                   </div>
                    `,
            data() {
                return {
                    active:0,
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
                    page:0,
                    limit:10,
                    sum:0,
                    count:0,
                    dataList:[]
                };
            },
            methods: {
                gorderlist(name,title){
                    console.info(name)
                    var self = this;
                    var orderdata = {
                        "reserveType":'0',
                        "limit":self.limit,
                        "page":self.page
                    };
                    if(name=='0'){
                        self.$toast.loading({ forbidClick: true, duration: 0});
                        httpKit.post("/park/shop/order/dishesOrder/list",orderdata,httpKit.type.form).then(res=>{
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
                            if (self.page > 1)
                                self.$refs[name].closePullDown();
                            if(self.dataList.length > 0){
                                self.page++;
                            }

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
                            if(self.page == '1'){
                                self.dataList = res.data;
                            }else{
                                self.dataList = self.dataList.concat(res.data)
                            }
                            if (self.page > 1)
                                self.$refs[name].closePullDown();
                            if(self.dataList.length > 0){
                                self.page++;
                            }

                        }).catch(err => {
                            self.$toast.clear();
                            self.$toast.fail({
                                message: err.message
                            });
                        });

                    }

                }
            },
            created(){

            },
            mounted(){
                this.$nextTick(function () {
                    //this.gbussiness()
                    this. gorderlist('3','加班餐')
                })
            }
        });

});
require(['httpKit','PullUpDown','backTop','lodash'], function (httpKit,PullUpDown,backTop,_) {
    Vue.use(vant.Lazyload);
    new Vue({
        el: '#gcoffee',
        components: {
            'pull-up-down':PullUpDown
        },
        template: `<div>
                        <div class="lists">
                             <ul class="pull">
                                 <pull-up-down class="goodslists" ref="pull" :pullDown="false" :currentPage="page" :count="count" :sum="sum" @nextPage="onLoad()">
                                  <li v-for="item in list">
                                        <div class="picheight" v-if="item.url">
                                            <a class="goodsImg" @click="goDetail(item.productId)" :goodId="item.productId" href="javascript:void(0)">
                                                <van-image lazy-load :src="item.url"/>
                                            </a>
                                        </div>
                                        <div v-else class="nopic">
                                            <a class="goodsImg" @click="goDetail(item.productId)" :goodId="item.productId" href="javascript:void(0)">
                                                <van-image lazy-load :src="item.url"/>
                                            </a>
                                        </div>
                                        <div>
                                             <div class="van-ellipsis"><a class="fontgray" href="javascript:void(0)">{{item.name}}</a></div>
                                             <div class="pbttom">
                                                <div v-if="item.price"><span>￥{{item.price}}<s class="originalPrice">￥{{item.originalPrice}}</s></span></div>
                                                <div v-else><span>￥{{item.originalPrice}}</span></div>
                                                <!--<van-icon @click="addcart(item.id)" name="shopping-cart-o" />-->
                                             </div>
                                        </div>
                                    </li>
                                 </pull-up-down>
                             </ul>
                             
                        </div>
                        </van-list>
                    </div>`,

        data() {
            return {
                list: [
                    {
                        'id':'001',
                        'url':'http://img.alicdn.com/bao/uploaded/i3/2248959707/O1CN012LZr4zZeScAukgC_!!2248959707.jpg',
                        'name':'鸿雁天猫精灵智能魔方插座USB插口语音控制远程排插多功能插板',
                        'price':'170.0',
                    },
                    {
                        'id':'002',
                        'url':'http://image.wifenxiao.com/25/ca/4031216/2020-04/5e8d6c494085f.jpg@!480x480',
                        'name':'鸿雁Q5/臻悦系列86型开关插座 金色',
                        'price':'170.0',
                    },{
                        'id':'003',
                        'url':'http://image.wifenxiao.com/25/ca/4031216/2020-04/5e8d6c494085f.jpg@!480x480',
                        'name':'鸿雁天猫精灵智能魔方插座USB插口语音控制远程排插多功能插板',
                        'price':'170.0',
                    },
                    {
                        'id':'004',
                        'url':'http://image.wifenxiao.com/25/ca/4031216/2020-03/5e7dc95d86e1f.jpg@!480x480',
                        'name':'鸿雁Q5/臻悦系列86型开关插座 金色',
                        'price':'170.0',
                    },{
                        'id':'005',
                        'url':'http://image.wifenxiao.com/25/ca/4031216/2020-03/5e7dc4f6200f0.jpg@!480x480',
                        'name':'鸿雁天猫精灵智能魔方插座USB插口语音控制远程排插多功能插板',
                        'price':'170.0',
                    },
                    {
                        'id':'006',
                        'url':'http://image.wifenxiao.com/25/ca/4031216/2020-04/5e8c16303e4a2.jpg@!480x480',
                        'name':'鸿雁Q5/臻悦系列86型开关插座 金色',
                        'price':'170.0',
                    },{
                        'id':'007',
                        'url':'http://image.wifenxiao.com/25/ca/4031216/2020-01/5e156eb903d76.jpg@!480x480',
                        'name':'鸿雁天猫精灵智能魔方插座USB插口语音控制远程排插多功能插板',
                        'price':'170.0',
                    },
                    {
                        'id':'008',
                        'url':'http://image.wifenxiao.com/25/ca/4031216/2020-04/5e8d6c494085f.jpg@!480x480',
                        'name':'鸿雁Q5/臻悦系列86型开关插座 金色',
                        'price':'170.0',
                    },{
                        'id':'009',
                        'url':'http://image.wifenxiao.com/25/ca/4031216/2020-01/5e0bf7d78cb5b.png@!480x480',
                        'name':'鸿雁天猫精灵智能魔方插座USB插口语音控制远程排插多功能插板',
                        'price':'170.0',
                    },
                    {
                        'id':'010',
                        'url':'http://image.wifenxiao.com/25/ca/4031216/2020-04/5e8d6c494085f.jpg@!480x480',
                        'name':'鸿雁Q5/臻悦系列86型开关插座 金色',
                        'price':'170.0',
                    },{
                        'id':'011',
                        'url':'http://image.wifenxiao.com/25/ca/4031216/2020-04/5e8d6c494085f.jpg@!480x480',
                        'name':'鸿雁天猫精灵智能魔方插座USB插口语音控制远程排插多功能插板',
                        'price':'170.0',
                    },
                    {
                        'id':'012',
                        'url':'http://image.wifenxiao.com/25/ca/4031216/2020-04/5e8d6c494085f.jpg@!480x480',
                        'name':'鸿雁Q5/臻悦系列86型开关插座 金色',
                        'price':'170.0',
                    },{
                        'id':'013',
                        'url':'http://image.wifenxiao.com/25/ca/4031216/2020-04/5e8d6c494085f.jpg@!480x480',
                        'name':'鸿雁天猫精灵智能魔方插座USB插口语音控制远程排插多功能插板',
                        'price':'170.0',
                    },
                    {
                        'id':'014',
                        'url':'http://image.wifenxiao.com/25/ca/4031216/2020-04/5e8d6c494085f.jpg@!480x480',
                        'name':'鸿雁Q5/臻悦系列86型开关插座 金色',
                        'price':'170.0',
                    },{
                        'id':'015',
                        'url':'http://image.wifenxiao.com/25/ca/4031216/2020-04/5e8d6c494085f.jpg@!480x480',
                        'name':'鸿雁天猫精灵智能魔方插座USB插口语音控制远程排插多功能插板',
                        'price':'170.0',
                    },
                    {
                        'id':'016',
                        'url':'http://image.wifenxiao.com/25/ca/4031216/2020-04/5e8d6c494085f.jpg@!480x480',
                        'name':'鸿雁Q5/臻悦系列86型开关插座 金色',
                        'price':'170.0',
                    }
                ],
                page:1,
                limit:8,
                sum:0,
                count:0,
                // list:[],
            };
        },
        methods: {
            onSearch(val) {
                //Toast(val);
                console.info(val);
                this.page = 1;
                this.keyword = val;
                this.onLoad()
            },
            onLoad() {
                // 异步更新数据
                var self = this;
                var listdata = {
                    "classId" : self.classId,
                    "name":self.keyword,
                    "limit":self.limit,
                    "page":self.page
                };
                self.$toast.loading({ forbidClick: true, duration: 0});
                httpKit.post("/product/list",listdata, httpKit.type.form).then(res=>{
                    self.$toast.clear();
                    self.sum = res.count;
                    self.count = _.ceil(res.count / self.limit);
                    if(self.page == '1'){
                        self.list = res.data;
                    }else{
                        self.list = self.list.concat(res.data)
                    }
                    self.page++;
                    self.$refs['pull'].closePullDown();
                }).catch(err => {
                    self.$toast.clear();
                    self.$toast.fail({
                        message: err.message
                    });
                });
            },
            goDetail(id){
               window.location.href="../gdetail/gdetail.html?productId="+id
            },
            onBuyClicked(){

            },
            onAddCartClicked(){
                console.info(this.$refs.getSku.getSkuData())
            },
            addcart(val){
                //debugger
                this.skushow = true;
                console.info(val)
            }
        },
        mounted(){
            /*this.$nextTick(function () {
                var self = this;
                 self.onLoad();
            });*/
        }
    });
});
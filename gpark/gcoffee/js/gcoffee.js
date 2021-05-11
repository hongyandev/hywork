require(['httpKit','PullUpDown','backTop','lodash'], function (httpKit,PullUpDown,backTop,_) {
    Vue.use(vant.Lazyload);
    new Vue({
        el: '#glist',
        components: {
            'pull-up-down':PullUpDown,
            'back-top':backTop
        },
        template: `<div>
                        <!--<div class="search">
                            <van-search
                            show-action
                            shape="round"
                            v-model="keyword"
                            placeholder="请输入搜索关键词"
                            >
                              <template #action>
                                <div @click="onSearch(keyword)">搜索</div>
                              </template>
                            </van-search>
                        </div>-->
                        <div class="lists">
                             <ul class="pull">
                                 <pull-up-down class="goodslists" ref="pull" :pullDown="false" :currentPage="page" :count="count" :sum="sum" @nextPage="onLoad()">
                                    <li>
                                        <div class="picheight">
                                            <a class="goodsImg" href="javascript:void(0)">
                                                <van-image lazy-load src="https://img01.yzcdn.cn/vant/cat.jpeg"/>
                                            </a>
                                        </div>
                                        <div>
                                             <div class="van-ellipsis"><a class="fontgray" href="javascript:void(0)">意式浓缩</a></div>
                                             <div class="pbttom">
                                                <div><span>￥16.00<s class="originalPrice">￥22.00</s></span></div>
                                                <van-icon @click="addcart" name="shopping-cart-o" />
                                             </div>
                                        </div>
                                    </li>
                                  <!--<li v-for="item in list">
                                        <div class="picheight">
                                            <a class="goodsImg" :goodId="item.productId" href="javascript:void(0)">
                                                <van-image lazy-load :src="item.url"/>
                                            </a>
                                        </div>
                                        <div>
                                             <div class="van-ellipsis"><a class="fontgray" href="javascript:void(0)">{{item.name}}</a></div>
                                             <div class="pbttom">
                                                <div v-if="item.price"><span>￥{{item.price}}<s class="originalPrice">￥{{item.originalPrice}}</s></span></div>
                                                <div v-else><span>￥{{item.originalPrice}}</span></div>
                                                &lt;!&ndash;<van-icon @click="addcart(item.id)" name="shopping-cart-o" />&ndash;&gt;
                                             </div>
                                        </div>
                                    </li>-->
                                 </pull-up-down>
                             </ul>
                        </div>
                        </van-list>
                        <van-sku
                          v-model="show"
                          :sku="sku"
                          :goods="goods"
                          :goods-id="goodsId"
                          :quota="quota"
                          :quota-used="quotaUsed"
                          :hide-stock="sku.hide_stock"
                          :show-add-cart-btn="showAddCartBtn"
                          @buy-clicked="onBuyClicked"
                          @add-cart="onAddCartClicked"
                        >
                       </van-sku>
                       <div class="btnGroup">
                           <van-icon name="manager-o"/> 
                           <div class="space-line"></div>
                           <van-icon name="shopping-cart-o"  @click="gcart"/>
                       </div>
                       <back-top></back-top>
                    </div>`,

        data() {
            return {
                // keyword: httpKit.urlParams().name ? decodeURI(httpKit.urlParams().name) : '',
                show:false,
                page:1,
                limit:8,
                sum:0,
                count:0,
                list:[],
                sku: {
                    // 数据结构见下方文档
                    // 所有sku规格类目与其值的从属关系，比如商品有颜色和尺码两大类规格，颜色下面又有红色和蓝色两个规格值。
                    // 可以理解为一个商品可以有多个规格类目，一个规格类目下可以有多个规格值。
                    tree: [
                        {
                            k: '颜色', // skuKeyName：规格类目名称
                            v: [
                                {
                                    id: '30349', // skuValueId：规格值 id
                                    name: '红色', // skuValueName：规格值名称
                                    imgUrl: 'https://honyar.oss-cn-hangzhou.aliyuncs.com/pic/202005/1258935258909310977.jpg', // 规格类目图片，只有第一个规格类目可以定义图片
                                    previewImgUrl: 'https://honyar.oss-cn-hangzhou.aliyuncs.com/pic/202005/1258935258909310977.jpg', // 用于预览显示的规格类目图片
                                },
                                {
                                    id: '1215',
                                    name: '蓝色',
                                    imgUrl: 'https://honyar.oss-cn-hangzhou.aliyuncs.com/pic/202005/1258931974823804930.jpg',
                                    previewImgUrl: 'https://honyar.oss-cn-hangzhou.aliyuncs.com/pic/202005/1258931974823804930.jpg',
                                }
                            ],
                            k_s: 's1' // skuKeyStr：sku 组合列表（下方 list）中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值 id
                        },
                        {
                            k: '尺寸', // skuKeyName：规格类目名称
                            v: [
                                {
                                    id: '30369', // skuValueId：规格值 id
                                    name: 'XXL', // skuValueName：规格值名称
                                    imgUrl: '', // 规格类目图片，只有第一个规格类目可以定义图片
                                    previewImgUrl: '', // 用于预览显示的规格类目图片
                                },
                                {
                                    id: '1269',
                                    name: 'XL',
                                    imgUrl: '',
                                    previewImgUrl: '',
                                }
                            ],
                            k_s: 's2' // skuKeyStr：sku 组合列表（下方 list）中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值 id
                        },
                        {
                            k: '功能', // skuKeyName：规格类目名称
                            v: [
                                {
                                    id: '30399', // skuValueId：规格值 id
                                    name: '单控', // skuValueName：规格值名称
                                    imgUrl: '', // 规格类目图片，只有第一个规格类目可以定义图片
                                    previewImgUrl: '', // 用于预览显示的规格类目图片
                                },
                                {
                                    id: '1299',
                                    name: '双控',
                                    imgUrl: '',
                                    previewImgUrl: '',
                                }
                            ],
                            k_s: 's3' // skuKeyStr：sku 组合列表（下方 list）中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值 id
                        }
                    ],
                    // 所有 sku 的组合列表，比如红色、M 码为一个 sku 组合，红色、S 码为另一个组合
                    list: [
                        {
                            id: 2259, // skuId，下单时后端需要
                            price: 100, // 价格（单位分）
                            s1: '30349', // 规格类目 k_s 为 s1 的对应规格值 id
                            s2: '0', // 规格类目 k_s 为 s2 的对应规格值 id
                            s3: '1299', // 最多包含3个规格值，为0表示不存在该规格
                            stock_num: 110 // 当前 sku 组合对应的库存
                        }
                    ],
                    price: '1.00', // 默认价格（单位元）
                    stock_num: 227, // 商品总库存
                    collection_id: 2261, // 无规格商品 skuId 取 collection_id，否则取所选 sku 组合对应的 id
                    none_sku: false, // 是否无规格商品
                    messages: [
                        {
                            // 商品留言
                            datetime: '0', // 留言类型为 time 时，是否含日期。'1' 表示包含
                            multiple: '0', // 留言类型为 text 时，是否多行文本。'1' 表示多行
                            name: '留言', // 留言名称
                            type: 'text', // 留言类型，可选: id_no（身份证）, text, tel, date, time, email
                            required: '1', // 是否必填 '1' 表示必填
                            placeholder: '' // 可选值，占位文本
                        },
                        {
                            // 备注
                            datetime: '0', // 留言类型为 time 时，是否含日期。'1' 表示包含
                            multiple: '0', // 留言类型为 text 时，是否多行文本。'1' 表示多行
                            name: '备注', // 留言名称
                            type: 'tel', // 留言类型，可选: id_no（身份证）, text, tel, date, time, email
                            required: '0', // 是否必填 '1' 表示必填
                            placeholder: '' // 可选值，占位文本
                        }
                    ],
                    hide_stock: false // 是否隐藏剩余库存
                },
                goods: {
                    // 默认商品 sku 缩略图
                    picture: ''
                },
                goodsId: 0,
                quota: 0,
                quotaUsed: 0,
                showAddCartBtn: true
                // classId:httpKit.urlParams().itmclaId
            };
        },
        methods: {
            // onSearch(val) {
            //     //Toast(val);
            //     console.info(val);
            //     this.page = 1;
            //     this.keyword = val;
            //     this.onLoad()
            // },
            onLoad() {
                // 异步更新数据
                var self = this;
                var listdata = {
                    /*"classId" : self.classId,
                    "name":self.keyword,*/
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
            onBuyClicked(){

            },
            onAddCartClicked(){
                //console.info(this.$refs.getSku.getSkuData())
            },
            addcart(val){
                //debugger
                this.show = true;
                console.info(val)
            },
            gcart(){
                window.location.href = "../gcart/gcart.html";
            }
        },
        mounted(){
            this.$nextTick(function () {
                var self = this;
                // self.onLoad();

            });
        }
    });
});
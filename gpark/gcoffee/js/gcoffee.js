require(['httpKit','PullUpDown','backTop','lodash'], function (httpKit,PullUpDown,backTop,_) {
    Vue.use(vant.Lazyload);
    new Vue({
        el: '#glist',
        components: {
            'pull-up-down':PullUpDown,
            'back-top':backTop
        },
        template: `<div>
                       <van-divider v-show="status=='2'" :style="{ borderColor: '#fff', padding: '0 5px',color:'#999',margin:'5px 0' }">营业时间：8:00-20:00</van-divider>
                       <van-divider v-show="status=='1'" :style="{ borderColor: '#fff', padding: '0 5px',color:'#999',margin:'5px 0' }">店面休息,暂不支持线上下单</van-divider>
                        <div class="lists">
                             <ul class="pull">
                                 <pull-up-down class="goodslists" ref="pull" :pullDown="false" :currentPage="page" :count="count" :sum="sum" @nextPage="onLoad()">
                                  <li v-for="item in list">
                                        <div class="picheight">
                                            <a class="goodsImg" :goodId="item.coffeeId" href="javascript:void(0)">
                                                <van-image lazy-load :src="item.ossurl"/>
                                            </a>
                                        </div>
                                        <div>
                                             <div class="van-ellipsis"><a class="fontgray" href="javascript:void(0)">{{item.name}}</a></div>
                                             <div class="pbttom">
                                                <div v-if="item.price"><span>￥{{item.price}}<s class="originalPrice">￥{{item.originalPrice}}</s></span></div>
                                                <div v-else><span>￥{{item.originalPrice}}</span></div>
                                                <div class="cart-icon" @click="addcart(item)">
                                                     <van-icon v-model="item.num" name="shopping-cart-o" />
                                                </div>
                                             </div>
                                        </div>
                                    </li>
                                 </pull-up-down>
                             </ul>
                        </div>
                        </van-list>
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
                       <van-popup v-model="showcart" :close-on-click-overlay="false" closeable close-icon-position="top-right" position="right" @close="closecart" :style="{ height: '100%',width:'100%' }" >
                         <div class="pddingTop" >
                            <div class="shopContent" v-if="carOrderlist.coffeelist.length>0">
                                <ul>
                                    <li v-for="(item,i) in carOrderlist.coffeelist">
                                       <div class="shopmain"> 
                                             <van-swipe-cell :goodid="item.id" style="width: 100%;" :before-close="beforeClose">
                                                <div class="shops">
                                                    <div class="shopImg"><img :src="item.ossurl" alt=""></div>
                                                    <div class="shopsright">
                                                        <h4>{{item.name}}</h4>
                                                         <div class="shoprightbot">
                                                            <div class="coffee-price">￥{{parseFloat(item.price)}}<s>￥{{parseFloat(item.originalPrice)}}</s></div>
                                                            <div class="shopradd">
                                                                <van-stepper v-model="item.buynum" @change="changeNum(item)" /> 
                                                            </div>
                                                        </div>
                                                        
                                                    </div>  
                                                </div>
                                                <template #right>
                                                    <van-button style="height:100%" square type="danger" text="删除"  class="devare-button"/>
                                                </template>
                                            </van-swipe-cell>
                                        </div>
                                    </li>
                                </ul>
                            </div> 
                            <van-empty v-else description="购物车空空如也" />
                        </div>
                       </van-popup>
                       <div v-show="showcart">
                             <van-submit-bar v-if="carOrderlist.coffeelist.length>0" :safe-area-inset-bottom="false" :price="totalMoney * 100" button-text="提交" @submit="onSubmit"/> 
                             <van-submit-bar v-else disabled :safe-area-inset-bottom="false" :price="totalMoney * 100" button-text="提交" @submit="onSubmit"/> 
                        </div>
                         <back-top></back-top>
                    </div>`,

        data() {
            return {
                // keyword: httpKit.urlParams().name ? decodeURI(httpKit.urlParams().name) : '',
                showcart:false,
                showcartbtn:false,
                page:1,
                cartpage:1,
                limit:20,
                sum:0,
                count:0,
                list:[],
                carOrderlist:{
                    coffeelist:[],
                    totalNum:'',
                    totalPrice:0
                },
                goods: {
                    // 默认商品 sku 缩略图
                    picture: ''
                },
                goodsId: 0,
                quota: 0,
                quotaUsed: 0,
                showAddCartBtn: true,
                cartNum:0,
                status:''
                // classId:httpKit.urlParams().itmclaId
            };
        },
        methods: {
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
                httpKit.post("/coffee/list",listdata, httpKit.type.form).then(res=>{
                    self.$toast.clear();
                    self.sum = res.count;
                    self.count = _.ceil(res.count / self.limit);
                    if(self.page == '1'){
                        self.list = res.data;
                    }else{
                        self.list = self.list.concat(res.data)
                    }
                    if(self.list.length>0){
                        self.page++;
                    }
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
            addcart(item){
                var i=-1;
                this.carOrderlist.coffeelist.forEach((coffee,index)=>{
                    if(item.coffeeId == coffee.coffeeId){
                        i = index;
                        return;
                    }
                });
                if (i == -1) {
                    item.num = 1;
                    this.carOrderlist.coffeelist.push(item);
                    item.coffeeprice = item.num * item.price;
                } else {
                    this.carOrderlist.coffeelist[i].num ++;
                    this.carOrderlist.coffeelist[i].coffeeprice = this.carOrderlist.coffeelist[i].num*this.carOrderlist.coffeelist[i].price
                }
               //console.info(item)
                this.cartNum = this.carOrderlist.coffeelist.length;
                window.localStorage.setItem('cartLength', JSON.stringify(this.cartNum));
                var data = {
                    coffeeId: item.coffeeId,
                    buyNum: 1,
                }
                this.$toast.loading({ forbidClick: true, duration: 0});
                httpKit.post("/coffee/cart/add", data,httpKit.type.json).then(res => {
                    console.info(res);
                    this.$toast.clear();

                }).catch(err => {
                    console.info(err)
                });


            },
            onSubmit(){
                window.localStorage.setItem('cartData', JSON.stringify(this.carOrderlist));
                window.location.href = "../gsubmit/gsubmit.html"
            },
            cart(){
                var self = this;
                var data={
                    "limit":self.limit,
                    "page":self.cartpage
                }
                httpKit.post("/coffee/cart/list", data,httpKit.type.formData).then(res => {
                    console.info(res);
                    self.carOrderlist.coffeelist = res.data;
                    self.cartNum = self.carOrderlist.coffeelist.length;
                    window.localStorage.setItem('cartLength', JSON.stringify(self.cartNum));

                }).catch(err => {
                    console.info(err)
                });
            },
            gcart(){
                this.showcart = true;
                this.cart();
            },
            closecart(){
                this.showcart = false
            },
            changeNum(item){
                console.info(item)
               /* item.coffeeprice = item.num * item.price;
                var sum = 0;
                this.carOrderlist.coffeelist.forEach(item=>{
                    sum += item.coffeeprice;
                    this.carOrderlist.totalPrice = sum
                });
                if(item.num == 0){
                    this.carOrderlist.coffeelist.splice(this.carOrderlist.foodlist.findIndex(coffee => item.coffeeId === coffee.coffeeId), 1);

                }
                this.content = this.carOrderlist.coffeelist.length
                if(this.carOrderlist.coffeelist == 0){
                    this.showcart = false
                }*/

                this.$toast.loading({forbidClick: true, duration: 0});

                var data = {
                    cartId: item.id,
                    buynum:item.buynum
                };
                httpKit.post("/coffee/cart/modifyBuynum", data, httpKit.type.form).then(res => {
                    this.$toast.clear();

                }).catch(err => {
                    this.$toast.clear();
                    this.$toast.fail({
                        message: err.message
                    });
                });
            },
            beforeClose(obj){
                // console.info(obj.position);
                switch (obj.position) {
                    case 'left':
                    case 'cell':
                    case 'outside':
                        obj.instance.close();
                        break;
                    case 'right':
                        this.$dialog.confirm({
                            message: '确定删除吗？',
                        }).then(() => {
                            this.$toast.loading({forbidClick: true, duration: 0});
                            console.info(obj.instance.$attrs.goodid);
                            var data = {
                                cartId: obj.instance.$attrs.goodid
                            };
                            httpKit.post("/coffee/cart/del", data, httpKit.type.form).then(res => {
                                this.$toast.clear();
                                this.$toast("删除成功！");
                                this.cart();

                            }).catch(err => {
                                this.$toast.clear();
                                this.$toast.fail({
                                    message: err.message
                                });
                            });
                            obj.instance.close();
                        });
                        break;
                }
            },
            gorder(){
                window.location.href='../gcoffeeOrder/gcoffeeOrder.html'
            },
            gcoffee(){
                window.location.href='../gcoffee/gcoffee.html'
            }
        },
        watch:{
            'carOrderlist':{
                handler:function(newValue,oldValue){
                    console.log(newValue)
                },
                deep:true,
            },
        },
        computed:{
            totalMoney(){
                var sum = 0;
                this.carOrderlist.coffeelist.forEach(item=>{
                    sum += item.buynum*item.price;
                    this.carOrderlist.totalPrice = sum
                });
                return sum;
            },
        },
        created:function () {
            var self = this;
            self.$toast.loading({forbidClick: true, duration: 0});
            httpKit.post("/coffee/shop/ok").then(res => {
                self.$toast.clear();
                console.info(res.data);
                self.status = res.data.status;
            }).catch(err => {
                self.$toast.clear();
                self.$toast.fail({
                    message: err.message
                });
            });
        },
        mounted(){
            this.$nextTick(function () {
                var self = this;
                 self.onLoad();
                 self.cart();
                 if(httpKit.urlParams().showcart == '1'){
                     self.showcart = true
                 }
            });
        }
    });
});
require(['httpKit','lodash'], function (httpKit, _) {
    Vue.use(vant.Lazyload);
    new Vue({
        el: '#gmenu',
        template: `
                   <div>
                        <van-tabs class="tab-menu" @click="gtab" sticky color="#009D85">
                          <van-tab v-for="(item,index) in menu" :name="item.menuTypeCode">
                            <template #title>
                                <span>{{item.menuType}}</span>
                            </template>
                            <div style="padding-bottom:50px;">
                             <ul v-if="item.dishes.length>0">
                                <li v-for="value in item.dishes">
                                    <van-divider :style="{ color: '#1989fa', borderColor: '#fff', padding: '0 10px' }">{{value.dishesType}}</van-divider>
                                    <van-grid :column-num="2" style="color:#555">
                                       <van-grid-item v-for="dish in value.dishesBase" style="font-size:12px;">
                                            <template #text>
                                                <div>
                                                    <div v-show="item.menuTypeCode=='5'"><van-image width="100%" height="100%" lazy-load :src="dish.ossurl"/></div>
                                                    <div>
                                                        <label style="font-size: 14px">{{dish.dishesName}}</label>
                                                        <div v-show="item.menuTypeCode=='5'" style="font-size:12px;color:#999">{{dish.majorIngredient}}</div>
                                                        <div v-show="dish.unauditedPrice > 0"><span>未审核价<em style="font-style: normal;color: #ff4e42">￥{{dish.unauditedPrice}}</em></span></div>
                                                        <div v-show="dish.price > 0"><em v-show="dish.unauditedPrice > 0" style="font-style: normal;">已审核价</em><span style="color: #ff4e42">￥{{dish.price}}</span></div>                                                      
                                                    </div>
                                                    <div style="text-align: right">
                                                        <van-icon v-show="item.menuTypeCode=='5'" v-model="dish.num" name="add-o" color="#ee0a24" size="25px" @click="firstAdd(dish)" />
                                                        <!--<van-stepper v-model="dish.num" theme="round" button-size="22" disable-input/>-->
                                                    </div>
                                                </div>
                                            </template>
                                       </van-grid-item>
                                    </van-grid>
                                </li>
                             </ul>
                             <van-empty v-else description="暂时还没有菜单信息" />
                             <van-divider v-show="item.dishes.length > 0" :style="{ color: '#999', borderColor: '#fff', padding: '0 10px' }">
                                <time style="font-size:12px;color:#999">更新于：{{item.updateTime}}</time>
                             </van-divider>
                            </div>
                             <!--底部合计-->
                             <div id="cartItem" v-show="caritem" class="cart-item">
                                <div v-if="content == 0" @click="showcarorder" class="border-radius"><van-icon name="shopping-cart" size="24px" color="#fff"/></div>
                                <van-badge v-else :content="content">
                                  <div @click="showcarorder" class="border-radius"><van-icon name="shopping-cart" size="24px" color="#fff"/></div>
                                </van-badge>
                                <div>
                                    <span style="color:#fff;margin-right:10px;vertical-align: -webkit-baseline-middle;">合计￥<b>{{carOrderlist.totalPrice}}</b></span>
                                    <van-button v-if="content == 0" disabled type="primary" square color="#009D85" size="normal" @click="gsubmit">去提交</van-button>
                                    <van-button v-else type="primary" square color="#009D85" size="normal" @click="gsubmit">去提交</van-button>
                                </div>
                             </div>
                          </van-tab>
                        </van-tabs>
                         <!--底部购物车-->
                             <van-popup get-container="#cartItem" class="cartInfo" v-model="showpopup" position="bottom" :style="{ height: '45%' }" >
                                <van-cell :key="index" v-for="(food, index) in carOrderlist.foodlist">
                                   <template #title>
                                        <span>{{food.dishesName}}</span>
                                  </template>
                                  <template #right-icon>
                                     <van-stepper v-model="food.num" async-change theme="round" button-size="22" min="0" @minus="deleteNum(food)" @change="changeNum(food)"/>
                                  </template>
                                </van-cell>
                             </van-popup>
                         <!--预定明细-->
                         <van-popup get-container="body" closeable round :close-on-click-overlay="false" v-model="showInfo" @closed="caritem=true" :style="{ height: '45%',width:'90%'}">
                                <van-cell-group>
                                  <van-cell title="订购菜单">
                                      <template #label>
                                          <van-row>
                                            <van-col v-for="food in carOrderlist.foodlist" span="6" justify="space-between">{{food.dishesName}}×{{food.num}}</van-col>
                                          </van-row>
                                      </template>
                                  </van-cell>
                                  <van-field label="姓名" v-model="username" :value="userInfo.userName" />
                                  <van-field label="手机" v-model="userphone" name="validator" :value="userInfo.userPhone"/>
                                </van-cell-group>
                                <div style="margin:16px;">
                                    <van-button round block type="primary" @click="confirmorder">确定提交</van-button>
                                    <div style="font-size:12px;color:#999;margin-top:10px;">当日预定请次日到食堂结算领取</div>
                                </div>
                        </van-popup>
                   </div>
                  `,
            data() {
                return {
                    menu:[],
                    carOrderlist:{
                        foodlist:[],
                        totalNum:'',
                        totalPrice:0
                    },
                    content:0,
                    showpopup:false,
                    userInfo:{},
                    username:'',
                    userphone:'',
                    showInfo:false,
                    caritem:true
                };
            },
            methods: {
                getmenu(){
                    var self = this;
                    self.$toast.loading({ forbidClick: true, duration: 0});
                    httpKit.post("/park/menu/todaymenu").then(res=>{
                        self.$toast.clear();
                        console.info(res);
                        self.menu = res.data;
                    }).catch(err => {
                        self.$toast.clear();
                        self.$toast.fail({
                            message: err.message
                        });
                    });
                },
                gtab(name,title){
                    console.info(name);
                    if(name == '5'){
                        this.caritem = true
                    }else{
                        this.caritem = false
                    }
                },
                firstAdd(item){
                    this.showpopup = true;
                    var i = -1;
                    this.carOrderlist.foodlist.forEach((food,index)=>{
                        if(item.dishesId == food.dishesId){
                            i = index;
                            return;
                        }
                    });
                    if (i == -1) {
                        item.num = 1;
                        this.carOrderlist.foodlist.push(item);
                        item.foodprice = item.num * item.price;
                    } else {
                        this.carOrderlist.foodlist[i].num ++;
                        this.carOrderlist.foodlist[i].foodprice = this.carOrderlist.foodlist[i].num*this.carOrderlist.foodlist[i].price
                    }
                    var sum = 0;
                    this.carOrderlist.foodlist.forEach(item=>{
                        item.foodprice = item.num * item.price;
                        sum += item.foodprice;
                        this.carOrderlist.totalPrice = sum
                    });
                    this.content = this.carOrderlist.foodlist.length

                },
                changeNum(item){
                    item.foodprice = item.num * item.price;
                    var sum = 0;
                    this.carOrderlist.foodlist.forEach(item=>{
                        sum += item.foodprice;
                        this.carOrderlist.totalPrice = sum
                    });
                    if(item.num == 0){
                      this.carOrderlist.foodlist.splice(this.carOrderlist.foodlist.findIndex(food => item.dishesId === food.dishesId), 1);
                    }
                    if(this.content == 0){
                        this.showpopup = false
                    }
                    this.content = this.carOrderlist.foodlist.length
                },
                showcarorder(){
                    if(this.carOrderlist.foodlist.length == 0){
                        this.showpopup = false
                    }else{
                        this.showpopup = !this.showpopup;
                    }

                },
                gsubmit(){
                    this.showpopup = false;
                    this.showInfo = true;
                    if(this.showInfo){
                        this.caritem = false
                    }else{
                        this.caritem = true
                    }
                },
                confirmorder(){
                    var self = this;
                    self.$toast.loading({ forbidClick: true, duration: 0});
                    var foodlist = [];
                    foodlist = self.carOrderlist.foodlist.map(item=>{
                        return {
                            "goodsId":item.dishesId,
                            "quantity":item.num
                        }
                    })
                    var data = {
                        "detail": foodlist,
                        "shipName": self.username,
                        "shipPhone": self.userphone
                    }
                    httpKit.post("/park/shop/order/dishesOrder/create",data,httpKit.type.json).then(res=>{
                        self.$toast.clear();
                        self.$toast("预定成功");
                        window.location.href='../../gpark/gmyordering/gmyordering.html?type=jc'
                    }).catch(err => {
                        self.$toast.clear();
                        self.$toast.fail({
                            message: err.message
                        });
                    });
                }

            },
            created(){
                var self = this;
                self.$toast.loading({ forbidClick: true, duration: 0});
                httpKit.post("/busOrder/init",).then(res=>{
                    self.$toast.clear();
                    console.info(res);
                    self.userInfo = res.data;
                    self.username = res.data.userName;
                    self.userphone = res.data.userPhone
                }).catch(err => {
                    self.$toast.clear();
                    self.$toast.fail({
                        message: err.message
                    });
                });

            },
            mounted(){
                this.getmenu();

            }
        });

});
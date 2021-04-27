require(['httpKit', 'qs'], function (httpKit, qs) {
    new Vue({
        el: '#gcart',
        template: `<div>
                       <!-- <div v-show="dataList.length>0" class="manage"><a href="javascript:void(0)" @click="managerAll">{{manageTxt}}</a></div>-->
                        <div class="pddingTop" >
                            <div class="shopContent">
                                <ul>
                                    <li v-for="(item,i) in dataList">
                                        <div v-show="item.goods.length > 0" class="cyName">
                                            <van-checkbox v-model="item.checked" @click="cychecked(item)"></van-checkbox>
                                            <h3>{{item.cyname}}</h3>
                                        </div>
                                        <div v-for="data in item.goods" class="shopmain">
                                             <van-checkbox v-model="data.checked" @click="signchecked(item)"></van-checkbox>
                                             <van-swipe-cell :goodid="data.id" style="padding-left:15px;width: 100%;" :before-close="beforeClose">
                                                <div class="shops">
                                                    <div class="shopImg" @click="todetails(data.productId)"><img :src="data.productUrl" alt=""></div>
                                                    <div class="shopsright">
                                                        <h4>{{data.productName}}</h4>
                                                         <div class="shoprightbot">
                                                        <template>
                                                            <van-tag @click="todetails(data.productId)" plain v-for="tip in toArray(data.specs)" type="danger">{{tip}}</van-tag>
                                                        </template>
                                                           <div><small>协议扣率：{{data.xykl}}</small></div>
                                                           <div><small>优惠后：</small>￥{{parseFloat(data.price*data.xykl).toFixed(2)}}<s>￥{{parseFloat(data.price).toFixed(2)}}</s></div>
                                                        </div>
                                                        <div class="shopradd">
                                                         <van-stepper v-model="data.buyNum" @change="onChangenum(item,data.id,data.buyNum)" /> 
                                                        </div>
                                                    </div>  
                                                </div>
                                                <template #right>
                                                    <van-button style="height:100%" square type="danger" text="删除"  class="devare-button"/>
                                                </template>
                                            </van-swipe-cell>
                                        </div>
                                        <div v-show="item.goods.length > 0" class="totalitem">
                                            <p>小计：￥<span>{{parseFloat(item.xj).toFixed(2)}}</span></p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div v-show="dataList.length==0" class="shopping">
                                <div style="font-size:100px;color:#999"><van-icon name="shopping-cart-o"/></div>
                                <p>暂无商品</p>
                            </div>
                                
                        </div>
                        <!--<div >-->
                          <!-- <van-submit-bar class="editDelete" v-show="changeTxt==='完成'" :price="totalMoney * 100" button-text="删除" button-color="#fff" @submit="deleteAll">
                                 <van-checkbox v-model="ischecked" :disabled="disabled" @click="checkAlldelete">全选</van-checkbox>
                            </van-submit-bar>-->
                        <!--</div>
                        <div>-->
                             <van-submit-bar :safe-area-inset-bottom="false" :price="totalMoney * 100" button-text="结算" @submit="onSubmit">
                                <van-checkbox v-model="ischecked" :disabled="disabled" @click="checkAll">全选</van-checkbox>
                            </van-submit-bar>
                        <!--</div>-->
                    </div>
                    `,
        data() {
            return {
                active: 'gcart',
                changeTxt:false,
                manageTxt:[
                    {
                        'id':'0',
                        'text':'编辑'
                    }

                ],
                ischecked: false,
                checked: false,
                checkcoupon: [],
                dataList: [],
                specs: [],
                total: 0,
                disabled: false,
                checkeddata: [],
                goodsIds:[]
            }
        },
        methods: {
            toArray: function (str) {
                return eval('(' + str + ')');
            },
            onChange(index) {
                this.showList = false;
                this.chosenCoupon = index;
            },
            todetails(productId) {
                //go商品详情页
                window.location.href = "../gdetail/gdetail.html?productId=" + productId;
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
                                ids: obj.instance.$attrs.goodid
                            };
                            httpKit.post("/cart/delete", data, httpKit.type.form).then(res => {
                                this.$toast.clear();
                                this.$toast("删除成功！");
                                this.dataList.forEach(g => {
                                    //console.info(g)
                                    g.goods = g.goods.filter(item => item.id != obj.instance.$attrs.goodid);
                                    g.xj = 0;
                                    g.goods.forEach(function (goods) {
                                        if (goods.checked) {
                                            g.xj +=  parseFloat(goods.price).toFixed(2) * goods.buyNum * goods.xykl * 1.0;
                                        }
                                    });
                                });
                                this.ischecked = this.dataList.filter(data => data.goods.length).length;

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
            // 提交订单
            onSubmit() {
                var self = this;
                var cys = [];
                this.dataList.forEach(function (data) {
                    if (data.goods.filter(good => good.checked === true).length) {
                        var cy = {};
                        Object.assign(cy, data);
                        cy.goods = [].concat(data.goods.filter(good => good.checked === true));
                        cys.push(cy);
                    }
                });
                if (cys.length <= 0) {
                    self.$toast("请选择要提交的订单");
                    return false
                }
                console.log(qs.stringify(cys));
                window.localStorage.setItem('cartData', JSON.stringify(cys));
                window.location.href = "../gsubmit/gsubmit.html"
            },
            cychecked(item) {
                var self = this;
                item.xj = 0;
                item.goods.forEach(function (g) {
                    g.checked = item.checked;
                    if (g.checked) {
                        item.xj += g.price * g.buyNum * g.xykl * 1.0;

                    }
                });
                this.ischecked = this.dataList.length == this.dataList.filter(data => data.checked == true).length;
            },
            signchecked(item) {
                var self = this;
                item.checked = item.goods.length == item.goods.filter(data => data.checked == true).length;
                item.xj = 0;
                item.goods.forEach(function (g) {
                    if (g.checked) {
                        item.xj += g.price * g.buyNum * g.xykl * 1.0;
                        self.goodsIds.push(g.id);
                    }

                });
                this.ischecked = this.dataList.length == this.dataList.filter(data => data.checked == true).length;
            },
            onChangenum(item, id, buynum) {
                console.info(item);
                console.info(id);
                console.info(buynum);
                var data = {
                    id: id,
                    buyNum: buynum
                }
                httpKit.post("/cart/add", data).then(res => {
                    console.info(res);
                    item.xj = 0;
                    item.goods.forEach(function (good) {
                        if (good.checked) {
                            item.xj += good.price * good.buyNum * good.xykl * 1.0
                        }

                    });
                }).catch(err => {
                    console.info(err)
                });

            },
            // 全选
            checkAll() {
                var self = this;
                self.dataList.forEach(function (data) {
                    data.checked = self.ischecked;
                    data.xj = 0;
                    data.goods.forEach(function (good) {
                        good.checked = self.ischecked;
                        if (good.checked)
                            data.xj += good.price * good.buyNum * good.xykl * 1.0
                    });
                });
            },
            managerAll(){
                this.changeTxt = !this.changeTxt;
                if(this.changeTxt){
                    this.manageTxt='完成';

                }else{
                    this.manageTxt='编辑';
                }
            },
            checkAlldelete(){
                var self = this;
                self.dataList.forEach(function (data) {
                    data.checked = self.ischecked;
                    data.goods.forEach(function (good) {
                        good.checked = self.ischecked;
                        if (good.checked)
                            self.goodsIds.push(good.id)
                    });
                });
            },
            deleteAll(){
                var data = {
                    ids:this.goodsIds.toString()
                }
                this.$dialog.confirm({
                    title: '确定删除全部吗',
                    confirmButtonText:'确定',
                    confirmButtonColor:'#ee0a24'
                }).then(() => {
                        // on confirm
                        httpKit.post("/cart/delete", data, httpKit.type.form).then(res => {
                            this.$toast.clear();
                            this.$toast("删除成功！");
                            location.reload();
                        }).catch(err => {
                            this.$toast.clear();
                            this.$toast.fail({
                                message: err.message
                            });
                        });
                    })
                    .catch(() => {
                        // on cancel
                    });

            }

        },
        computed: {
            totalMoney: function () {
                var sum = 0;
                this.dataList.forEach(function (data) {
                    data.goods.forEach(function (good) {
                        if (good.checked) {
                            sum += good.price * 1.0 * good.buyNum * good.xykl
                        }
                    })
                });
                return sum;
            }
        },
        watch: {},
        mounted() {
            this.$nextTick(function () {
                var self = this;
                self.$toast.loading({ forbidClick: true, duration: 0});
                httpKit.post("/cart/list").then(res => {
                    self.$toast.clear();
                    self.dataList = res.data;
                }).catch(err => {
                    self.$toast.clear();
                    self.$toast.fail({
                        message: err.message
                    });
                });
            });
        }
    });
});
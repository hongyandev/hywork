require(['httpKit','qs'], function (httpKit,qs) {
    new Vue({
        el: '#gsubmit',
        template: `<div>
                        <div>
                            <!--添加联系地址-->
                            <div class="address" :address="address">
                            <van-contact-card v-if="'{}' == JSON.stringify(address) " @click="showaddressList" />
                            <div v-else class="addressinfo"  @click="showaddressList" >
                                <van-icon class="location-o" name="location-o" />
                                <p><span>{{address.name}}</span> <span>{{address.tel}}</span></p>
                                <p><span></span><span>{{address.address}}</span></p>
                                <van-icon class="arrow" name="arrow" />
                            </div>
                            <div class="addressbg"></div>
                            </div>
                            <van-collapse v-model="activeNames">
                              <van-collapse-item title="更多" name="0">
                                    <ul>
                                        <li>
                                            <div>
                                                <van-field readonly clickable label="选择销售归属" :xsgs="xsgs"  :value="xsgs.text" placeholder="选择销售归属" @click="showxsgs" />
                                                <van-popup v-model="showPicker" round position="bottom">
                                                  <van-picker show-toolbar :columns="xsgscolumns" @cancel="showPicker = false" @confirm="onConfirm" />
                                                </van-popup>
                                            </div>
                                        </li>
                                        <!--<li>
                                            <div>
                                                <van-field readonly clickable label="选择项目名称" :pjtmc="pjtmc" :value="pjtmc.text" placeholder="选择项目名称" @click="showpjtmc" />
                                                <van-popup v-model="pjtmcpicker" round position="bottom">
                                                  <van-picker show-toolbar :columns="pjtmccolumns" @cancel="pjtmcpicker = false" @confirm="pjtmcConfirm" />
                                                </van-popup>
                                            </div>
                                        </li>-->
                                        <li>
                                            <div>
                                                <van-field readonly clickable label="选择发货模式" :bffh="bffh" :value="bffh.text" placeholder="选择发货模式" @click="showbffh" />
                                                <van-popup v-model="bffhpicker" round position="bottom">
                                                  <van-picker show-toolbar :columns="bffhcolumns" @cancel="bffhpicker = false" @confirm="bffhConfirm" />
                                                </van-popup>
                                            </div>
                                        </li>
                                        <li>
                                            <div>
                                                <van-field readonly clickable label="选择物流模式" :fhms="fhms" :value="fhms.text" placeholder="选择物流模式" @click="showfhms" />
                                                <van-popup v-model="fhmspicker" round position="bottom">
                                                  <van-picker show-toolbar :columns="fhmscolumns" @cancel="fhmspicker = false" @confirm="fhmsConfirm" />
                                                </van-popup>
                                            </div>
                                        </li>
                                        <li>
                                            <div>
                                                <van-field readonly clickable label="选择送货上门" :shsm="shsm" :value="shsm.text" placeholder="选择送货上门" @click="showshsm" />
                                                <van-popup v-model="shsmpicker" round position="bottom">
                                                  <van-picker show-toolbar :columns="shsmcolumns" @cancel="shsmpicker = false" @confirm="shsmConfirm" />
                                                </van-popup>
                                            </div>
                                        </li>
                                    </ul>
                              </van-collapse-item>
                            </van-collapse>
                        </div>
                        <div class="pddingTop">
                            <div class="shopContent">
                                <ul>
                                    <li v-for="(item,i) in dataList" :key="i">
                                        <div class="cyName">
                                            <h3>{{item.cyname}}</h3>
                                        </div> 
                                        <div class="itemlist" v-for="data in item.goods">
                                            <van-card
                                              :num="data.buyNum"
                                              :price="data.tjkl!=1 ? parseFloat(data.price*data.tjkl*data.cxkl).toFixed(2) : parseFloat(data.price*data.xykl*data.cxkl).toFixed(2)"
                                              :origin-price="parseFloat(data.price).toFixed(2)"
                                              :title="data.productName"
                                              :thumb="data.productUrl"
                                            >
                                              <template #tags>
                                                <van-tag plain v-for="tip in JSON.parse(data.specs)" type="danger">{{tip}}</van-tag>
                                              </template>
                                              <template #price-top>
                                                    <div><small>协议扣率：</small><span>{{data.xykl}}</span></div>
                                                    <div class="font-red" v-show="data.tjkl && item.tjdh"><small>实际扣率：</small><span>{{data.tjkl}}</span></div>
                                              </template>
                                            </van-card>
                                        </div>
                                        <div class="">
                                            <van-cell title="选择优惠券" :label="item.tjdmc" @click="showCoupon(item)">
                                              <template #right-icon>
                                               <van-icon size="25" name="after-sale" />
                                               <!--<van-icon size="26" name="arrow" />-->
                                              </template>
                                              <template #label>
                                               <div class="yhitem" v-show="item.tjdh">
                                                <p><small>名称:</small>{{item.tjdmc}}</p>
                                              </div>
                                              </template>
                                            </van-cell>
                                            <!--<van-panel title="选择优惠" icon="after-sale" @click="showCoupon(item)">
                                              <div class="yhitem" v-show="item.tjdh">
                                                <p><small>名称:</small>{{item.tjdmc}}</p>
                                              </div>
                                            </van-panel>  -->  
                                        </div>
                                        <div class="totalitem">
                                            <p>小计：￥<span>{{parseFloat(item.xj).toFixed(2)}}</span></p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <van-submit-bar :price="totalMoney * 100" button-text="提交订单" @submit="onSubmit"></van-submit-bar>
                            </div>
                        </div>
                       
                        <!-- 联系人列表 -->
                        <van-popup round v-model="showList" position="bottom" style="height:90%">
                          <van-address-list
                              v-model="chosenAddressId"
                              :list="addresslist"
                              :disabled-list="disabledaddressList"
                              default-tag-text="默认"
                              @select="select"
                            />
                        </van-popup>
                        <!-- 优惠券列表 -->
                         <van-popup  v-model="showcpList" round position="bottom" style="height: 90%; padding-top: 4px;" >
                              <van-tabs v-model="active" @click="onClicktab">
                                  <van-tab title="特价单">
                                        <ul class="couponList">
                                            <li v-for="(item, index) in coupon.tjs">
                                                <div class="van-cell-group">
                                                    <div class="van-cell">
                                                        <div class="van-cell__title">
                                                            <span>{{item.tjdmc}}</span><br/>
                                                            <time class="van-cell__label">截止至{{item.dqrq}}</time>
                                                        </div>
                                                        <div class="van-cell__value">
                                                            <span class="van-kyje">{{item.kyje}}</span>
                                                        </div>
                                                        <div class="van_radio">
                                                            <van-radio-group v-model="coupon.cy.tjdh" >
                                                                <van-radio :name="item.tjdh" @click="couponChecked(item, coupon.cy)"></van-radio>
                                                            </van-radio-group>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                  </van-tab>
                                  <van-tab title="促销单">
                                        <ul class="couponList">
                                            <li v-for="(item, index) in coupon.cx">
                                                <div class="van-cell-group">
                                                    <div class="van-cell">
                                                        <div class="van-cell__title">
                                                            <span>{{item.mc}}</span><br/>
                                                            <time class="van-cell__label">{{item.kssj}}-{{item.jssj}}</time>
                                                        </div>
                                                        
                                                        <div class="van_radio">
                                                            <van-radio-group v-model="coupon.cy.cxdh" >
                                                                <van-radio :name="item.cxdh" @click="couponCxchecked(item, coupon.cy)"></van-radio>
                                                            </van-radio-group>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                  </van-tab>
                                </van-tabs> 
                              <div class="couponBtn">
                                   <van-button type="danger" @click="nocouponSure" block>不使用优惠券</van-button>
                              </div> 
                         </van-popup>
                    </div>
                    `,
        data() {
            return {
                buynow : 0, // 0:购物车, 1:立即购买
                activeNames:['1'],
                xsgs:{
                    key:"K10",
                    text:"K10.工贸公司"
                },
                pjtmc:{},
                bffh:{},
                fhms:{},
                shsm:{
                    "id":1,
                    "text":"否"
                },
                value:'',
                dataList:JSON.parse(localStorage.getItem('cartData')),
                showPicker:false,
                pjtmcpicker:false,
                bffhpicker:false,
                fhmspicker:false,
                shsmpicker:false,
                showList: false,
                yw:{},
                xsgscolumns:[],
                pjtmccolumns:[],
                bffhcolumns:[
                    {"id":1,"text":"允许部分发货"},
                    {"id":2,"text":"单条产品配齐便可发货"},
                    {"id":3,"text":"整单配齐才能发货"},
                ],
                fhmscolumns:[
                    {"id":"ROAD","text":"公路物流"},
                    {"id":"EXPPS","text":"快递"},
                    {"id":"EXP","text":"自提"},
                    {"id":"RAIL","text":"铁路物流"},
                    {"id":"TNT","text":"快运"},
                ],
                shsmcolumns:[
                    {"id":1,"text":"否"},
                    {"id":2,"text":"是"}
                ],
                xsgsArr:[],
                pjtmcArr:[],
                chosenAddressId: '',
                address:{},
                addresslist: [],
                disabledaddressList:[],
                showcpList:false,
                active: 0,
                radio:-1,
                coupon: {
                    cy: {},
                    tjs: [],
                    cx: []
                },
                cpchecked:{},
                cpcheckarr:[],
                cyid:"",


            };
        },
        methods: {
            showxsgs(){//销售归属列表
                this.showPicker = true;
                this.$toast.loading({ forbidClick: true, duration: 0});
                httpKit.post('/common/salfcy').then(res=>{
                    //console.info(res);
                    this.$toast.clear();
                    this.xsgsArr = res.data;
                    this.xsgscolumns = this.xsgsArr.map(item=>{
                        return {
                            text:item.tjgssm,
                            key:item.fcy
                        }
                    })
                }).catch(err => {
                    this.$toast.clear();
                    this.$toast.fail({
                        message: err.message
                    });
                });
            },
            onConfirm(val) {//销售归属
                this.xsgs = val;
                this.showPicker = false;
                this.xsgs.key = val.key;
                this.onClicktab(0,'特价单');
                this.onClicktab(1,'促销单');
            },
            showpjtmc(){//项目列表
                var self = this;
                var data = {
                    salfcy:this.xsgs.key
                };
                if(this.xsgs.key) {
                    this.pjtmcpicker = true;
                    httpKit.post('/common/oppor', data, httpKit.type.form).then(res => {
                        console.info(res);
                        self.pjtmcArr = res.data;
                        self.pjtmccolumns = self.pjtmcArr.map(item => {
                            return {
                                text: item.OPPDES_0,
                                key: item.OPPNUM_0
                            }
                        })
                    }).catch(err => {
                        self.$toast.clear();
                        self.$toast.fail({
                            message: err.message
                        });
                    });
                }else{
                    this.$toast("请选择销售归属");
                    return false
                }

            },
            pjtmcConfirm(val){//项目名称
                this.pjtmc = val;
                this.showPicker = false;
            },
            showbffh(){//发货模式
                this.bffhpicker = true;

            },
            bffhConfirm(val){
                this.bffh = val;
                this.bffhpicker = false;
            },
            showfhms(){//物流模式
                this.fhmspicker = true;

            },
            fhmsConfirm(val){
                this.fhms = val;
                this.fhmspicker = false;
            },
            showshsm(){//送货上门
                this.shsmpicker = true;

            },
            shsmConfirm(val){
                this.shsm = val;
                this.shsmpicker = false;
            },
            showCoupon(cy){
               // console.info(cy)
                if(this.xsgs.key){
                    this.showcpList = true;
                    this.onClicktab(0,'特价单')
                }else{
                    this.$toast("请选择销售归属");
                    return false
                }
                this.coupon.cy = cy;
/*                this.coupon = {
                    cy: cy,
                    tjs: [
                        {
                            "tjdh": "202004260191",
                            "gcmc": "华发城建国际海岸花园项目一期",
                            "kyje": '9589.4075',
                            "jsgh": "2020-6-30",
                            "mx": [
                                {
                                    "cpdm": "85631085",
                                    "cpxldm": "",
                                    "pzkl": 0.33
                                },
                                {
                                    "cpdm": "85631087",
                                    "cpxldm": "0325",
                                    "pzkl": 0.29
                                },
                                {
                                    "cpdm": "85631088",
                                    "cpxldm": "0325",
                                    "pzkl": 0.29
                                }
                            ],
                            "address":[
                                {
                                    "id": '1',
                                    "name": '张三',
                                    "tel": '13000000000',
                                    "address": '浙江省杭州市西湖区文三路 138 号东方通信大厦 7 楼 501 室',
                                },
                                {
                                    "id": '2',
                                    "name": '李四',
                                    "tel": '1310000000',
                                    "address": '浙江省杭州市拱墅区莫干山路 50 号',
                                },
                            ]
                        },
                        {
                            "tjdh": "202004260192",
                            "gcmc": "海安海洲阳光城二期项目",
                            "kyje": '432704.415',
                            "jsgh": "2020-9-30",
                            "mx": [
                                {
                                    "cpdm": "85631085",
                                    "cpxldm": "",
                                    "pzkl": 0.33
                                },
                                {
                                    "cpdm": "85631086",
                                    "cpxldm": "0325",
                                    "pzkl": 0.29
                                }
                            ]
                        }
                    ]
                }*/
            },
            onClicktab(name,title){
              // console.info(name,title) ;
                var data = {
                    salfcy:this.xsgs.key
                };
                if(name == 0){
                        this.$toast.loading({ forbidClick: true, duration: 0});
                    httpKit.post("/common/tjd",data, httpKit.type.form).then(res=>{
                        //console.info(res)
                        this.$toast.clear();
                        this.coupon.tjs = res.data
                    }).catch(err=>{
                        this.$toast.clear();
                        this.$toast.fail({
                            message: err.message
                        });
                    })
                }else{
                    this.$toast.loading({ forbidClick: true, duration: 0});
                    httpKit.post("/common/cxd",data, httpKit.type.form).then(res=>{
                        //console.info(res)
                        this.$toast.clear();
                        this.coupon.cx = res.data
                    }).catch(err=>{
                        this.$toast.clear();
                        this.$toast.fail({
                            message: err.message
                        });
                    })
                }
            },
            couponChecked(item, cy){
                //匹配有特价单的商品代码
                var i = 0;
                cy.goods.forEach(good => {
                    if (i == 0) {
                        cy.xj = 0
                    }
                    var tj = item.mx.filter(mx => mx.cpdm === good.itmref).length > 0 ? item.mx.filter(mx => mx.cpdm === good.itmref) : item.mx.filter(mx => mx.cpxldm == good.tjz5);
                    if (tj.length > 0) {
                        good.tjkl = tj[0].pzkl;
                        cy.xj +=  parseFloat(good.price).toFixed(2) * good.tjkl * good.buyNum;
                    } else {
                        good.tjkl = 0;
                        cy.xj +=  parseFloat(good.price).toFixed(2) * good.xykl * good.buyNum;
                    }
                    i++
                });
                cy.tjdmc = item.tjdmc;
                //匹配有特价单的地址

                /*
                //模拟特价单地址
                item.tjddz = [
                    {
                        BPAADD:"AD02",
                        BPAADDLIG:"AD02.济南市章丘区枣园安置房",
                        BPTNUM:"S0004822"
                    }
                ]*/
                if(this.addresslist.length>0){
                    item.tjddz.forEach(adr=>{
                        this.disabledaddressList = this.addresslist.filter(address => address.BPAADD != adr.BPAADD);
                        this.addresslist = this.addresslist.filter(address => address.BPAADD === adr.BPAADD);
                    })
                }else{

                }
                console.info(this.addresslist);
                this.addresslist.forEach(item=>{
                    if(this.address.BPAADD != item.BPAADD){
                        this.address = {}
                    }
                });
                this.showcpList = false;
            },
            couponCxchecked(item,cy){
                //console.info(cy);
                this.$toast.loading({ forbidClick: true, duration: 0});
                httpKit.post("/order/cuxiao",cy).then(res=>{
                    this.$toast.clear();
                    console.info(res);
                    cy.goods = res.data;
                    console.info(cy.goods);
                    cy.goods.forEach(g=>{
                        item.xj +=  parseFloat(g.price).toFixed(2) * g.buyNum * g.xykl * g.cxkl * 1.0;
                    })
                    this.showcpList = false;
                }).catch(err=>{
                    this.$toast.clear();
                    console.info(err);
                    this.showcpList = false;
                })
            },
            nocouponSure(){
                var i = 0;
                var cy = this.coupon.cy;
                cy.goods.forEach(good => {
                    good.tjkl = 0;
                    if (i == 0) {
                        cy.xj = 0
                    }
                    cy.xj +=  parseFloat(good.price).toFixed(2) * good.xykl * good.buyNum;
                    i++
                });
                this.coupon.cy.tjdh = "";
                this.coupon.cy.tjdmc = "";
                this.addresslist = this.addresslist.concat(this.disabledaddressList);
                this.disabledaddressList = [];
                console.info(this.coupon.cy);
                this.showcpList = false;

            },
            showaddressList(){
                this.showList = true;
            },
            select(item,index) {
                console.info(item);
                this.showList = false;
                this.address = item;
                this.chosenAddressId = item.BPAADD;
                this.fhms = {
                    id:item.MDL,
                    text:item.MDLNAM
                };
                this.bffh = {
                    id:item.DEM,
                    text:item.DEMNAM
                };
            },
            onSubmit(){
                if(JSON.stringify(this.address)=="{}"){
                    this.$toast("请选择地址");
                    return false;
                }
                var orderdata = {
                    lxr:this.address.name,
                    lxdh:this.address.tel,
                    bmbm:this.yw.bmbm,
                    ywy:this.yw.ywy,
                    salfcy:this.xsgs.key,//销售归属
                    bpaadd:this.address.BPAADD,//收货地址
                    bpaaddmc:this.address.BPAADDLIG,//收货地址名称
                    pjt:this.pjtmc.key || "",//项目时序号
                    pjtmc:this.pjtmc.text || "",//项目名称
                    fhms:this.fhms.id,//物流模式
                    wlsdm:this.address.BPTNUM,//物流商代码
                    bffh:this.bffh.id,//发货模式
                    shsm:this.shsm.id,//送货上门
                    dataList:this.dataList//订单明细
                };
                this.$toast.loading({ forbidClick: true, duration: 0});
                var requestUrl = ""
                this.buynow > 0 ? requestUrl = "/order/buynow" : requestUrl = "/order/save"
                httpKit.post(requestUrl, orderdata).then(res=>{
                    this.$toast.clear();
                    window.localStorage.clear();
                    window.location.href='../gsubmit/gsubmitOk.html?payId='+res.data
                }).catch(err => {
                    this.$toast.clear();
                    this.$toast.fail({
                        message: err.message
                    });
                });
            }
        },
        computed: {
            totalMoney: function () {
                var sum = 0;
                this.dataList.forEach(function (data) {
                    var xj = 0;
                    data.goods.forEach(function (good) {
                       if(good.tjkl != '1'){
                           xj += parseFloat(good.price).toFixed(2) * good.tjkl * good.buyNum * 1.0;
                       }else if(good.cxkl != '1'){
                           xj += parseFloat(good.price).toFixed(2) * good.xykl * good.cxkl * good.buyNum * 1.0;
                       }else{
                           xj += parseFloat(good.price).toFixed(2) * good.xykl * good.buyNum * 1.0;
                       }
                    });
                    data.xj = xj;
                    sum += data.xj;
                });
                return sum;
            },
        },
        watch:{

        },
        created: function(){
            var self = this;
            if (httpKit.urlParams() && httpKit.urlParams().buynow)
                self.buynow = httpKit.urlParams().buynow
        },
        mounted(){
            var self = this;
            this.$nextTick(function () {
                self.$toast.loading({ forbidClick: true, duration: 0});
                httpKit.post('/order/init').then(res=>{
                    self.$toast.clear();
                    //console.info(res);
                    self.yw = res.data;
                    self.addresslist = res.data.bpaadd;
                    self.addresslist = self.yw.bpaadd.map(item=>{
                        return {
                            BPAADD:item.BPAADD,
                            id:item.BPAADD,
                            name:item.EXTNUM_0,
                            tel:item.TEL,
                            address:item.BPAADDLIG,
                            BPAADDLIG:item.BPAADDLIG,
                            BPRNAM:item.BPRNAM,
                            BPTNUM:item.BPTNUM,
                            MDL:item.MDL,
                            MDLNAM:item.MDLNAM,
                            DEM:item.DEM,
                            DEMNAM:item.DEMNAM,
                            BPDADDFLG:item.BPDADDFLG,
                            isDefault: false,
                        }
                    });
                    this.addresslist.forEach(item=>{
                        if(item.BPDADDFLG == '2'){
                            item.isDefault = true;
                            this.address = item;
                            this.chosenAddressId = item.id;
                            this.fhms = {
                                id:item.MDL,
                                text:item.MDLNAM
                            };
                            this.bffh = {
                                id:item.DEM,
                                text:item.DEMNAM
                            };
                        }
                    })

                }).catch(err => {
                    self.$toast.clear();
                    self.$toast.fail({
                        message: err.message
                    });
                });
            })

        }
    });
});
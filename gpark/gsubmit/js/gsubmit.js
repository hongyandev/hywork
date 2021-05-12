require(['httpKit','lodash'], function (httpKit,_) {
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
                        </div>
                        <h2 class="van-doc-demo-block__title">付款方式</h2>
                        <van-radio-group v-model="radio">
                              <van-cell-group>
                                <van-cell title="支付宝" clickable @click="radio = '1'">
                                  <template #right-icon>
                                    <van-radio checked-color="#009e86" name="1" />
                                  </template>
                                </van-cell>
                                <van-cell title="挂账" clickable @click="gzpicker">
                                  <template #right-icon>
                                    <van-radio  checked-color="#009e86" name="2" />
                                  </template>
                                </van-cell>
                              </van-cell-group>
                        </van-radio-group>
                        <h2 class="van-doc-demo-block__title">送达时间</h2>
                        <van-field v-if="iswork==false" disabled readonly name="送达时间" label="送达时间" @click="getTime"/>
                        <van-field v-else readonly  v-model="ydtime" name="送达时间" label="送达时间" @click="getTime"/>
                        <!--时间选择-->
                        <van-popup v-model="showtime" position="bottom">
                            <van-datetime-picker type="datetime" v-model="currentDate" :filter="filter" :columns-order="['year', 'month', 'day','hour','minute']" :formatter="formatter" title="选择日期" :max-date="maxdate" :min-date="mindate"  @confirm="onConfirmdate" @cancel="showtime=false"/>
                        </van-popup> 
                        <div class="pddingTop">
                            <div class="shopContent">
                                <ul>
                                    <li v-for="(data,i) in dataList.coffeelist" :key="i">
                                        <div>
                                            <van-card
                                              :num="data.buynum"
                                              :price=" _.round(data.price, 2)"
                                              :origin-price="data.originalPrice*1.00"
                                              :title="data.name"
                                              :thumb="data.ossurl"
                                            >
                                            </van-card>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div style="border-top:1px solid #f7f7f7"></div>
                            <van-field
                              v-model="note"
                              rows="1"
                              autosize
                              label="备注信息"
                              type="textarea"
                              placeholder="请输入备注信息（非必填）"
                            />
                            <div>
                                <van-submit-bar v-if="radio==2" :price="totalMoney * 100" button-text="去挂帐" @submit="onSubmit"></van-submit-bar>
                                <van-submit-bar v-else :price="totalMoney * 100" button-text="去提交" @submit="onSubmit"></van-submit-bar>
                            </div>
                        </div>
                        <van-popup round v-model="showgzPicker"  closeable position="bottom" style="height:45%">
                            <van-divider :style="{ borderColor: '#fff', padding: '0 16px',color:'#333' }">选择审批信息</van-divider>
                            <van-form style="border-bottom:1px solid #f7f7f7">
                                <van-field required readonly clickable name="bm" label="选择部门" :value="createrBmbm.text" placeholder="请选择"  @click="showbm"/>
                                <van-field required readonly clickable  name="spr" label="选择审批人" :value="spr.text" placeholder="请选择" @click="showspr" />
                                <van-field required v-model="reason" rows="1" autosize label="事由" type="textarea" maxlength="50" placeholder="请输入事由" show-word-limit/>
                            </van-form>
                            <div style="margin:15px">
                              <van-button color="#07c160" round block type="primary" @click="gzsubmitInfo">
                                确定
                                </van-button>
                            </div>
                            
                        </van-popup>
                         <!--审批人选择-->
                         <van-popup v-model="showsprPicker" round position="bottom">
                            <van-picker show-toolbar :columns="sprcolumns" @cancel="showsprPicker = false" @confirm="onsprConfirm"/>
                        </van-popup>
                        <!--部门选择-->
                        <van-popup v-model="showbmPicker" round position="bottom">
                            <van-picker show-toolbar :columns="bmcolumns" @cancel="showbmPicker = false" @confirm="onbmConfirm"/>
                        </van-popup>
                        <!-- 联系人列表 -->
                        <van-popup round v-model="showList" position="bottom" style="height:90%">
                          <van-address-list
                              v-model="chosenAddressId"
                              :list="addresslist"
                              :disabled-list="disabledaddressList"
                              default-tag-text="默认"
                              @select="select"
                              @add="onAdd"
                              @edit="onEdit"
                            />
                        </van-popup>
                       <van-popup v-model="editAddr" position="right" style="height:100%;width:100%">
                           <van-address-edit
                              show-postal
                              show-delete
                              show-set-default
                              :show-area="false"
                              :show-postal="false"
                              :address-info="addressInfo"
                              @save="onSave"
                              @delete="onDelete"
                            /> 
                            <div style="padding:0 15px;margin-top:-35px;"><van-button @click="editAddr = false" round block type="default">返回</van-button></div>
                       </van-popup>
                       <van-popup v-model="showok" :close-on-click-overlay="false"  position="right" :style="{ height: '100%',width:'100%' }" >
                         <div class="pddingTop">
                            <div class="empty">
                            <van-icon class="success" color="#07c160" name="passed" />
                            <p v-if="radio=='2'">挂账成功，等待审批</p>
                            <p v-else>订单提交成功！</p>
                            <div class="buttons">
                                <van-button  type="primary" @click="goShoping" block>继续购物</van-button>
                                <!--<van-button plain type="primary" @click="goOrder" block>查看订单</van-button>-->
                            </div>
                         
                       </div>
                         </div>
                       </van-popup>
                    </div>
                    `,
        data() {
            return {
                activeNames:['1'],
                dataList:JSON.parse(localStorage.getItem('cartData')),
                showgzPicker:false,
                showList:false,
                fktypepicker:false,
                showsprPicker:false,
                showbmPicker:false,
                sprcolumns:[],
                bmcolumns:[],
                createrBmbm:{},
                spr:{},
                chosenAddressId: '',
                address:{},
                addressInfo:{},
                addresslist: [],
                disabledaddressList:[],
                showcpList:false,
                editAddr:false,
                limit:50,
                page:1,
                radio: '1',
                showtime:false,
                note:'',
                reason:'',
                ydtime:`${this.formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(), new Date().getMinutes()+30))}`,
                mindate:new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(), new Date().getMinutes()+30),
                //maxdate:new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()+1, new Date().getHours(), new Date().getMinutes()),
                maxdate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 20, 0),
                //maxdate:'',
                currentDate:new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours()+1, new Date().getMinutes()),
                showok:false,
                iswork:true,
            };
        },
        methods: {
            formatDate(date) {
                var month,
                    day,
                    hours,
                    minutes;
                month = `${date.getMonth()}`<10 ? '0' + `${date.getMonth()+1}` : `${date.getMonth() + 1}`;
                day = `${date.getDate()}`<10 ? '0' + `${date.getDate()}` : `${date.getDate()}`;
                hours = `${date.getHours()}`<10 ? '0' + `${date.getHours()}` : `${date.getHours()}`;
                minutes = `${date.getMinutes()}` < 10 ? '0'+`${date.getMinutes()}`:`${date.getMinutes()}`;
                return `${date.getFullYear()}-`+ month + "-" + day+ " "+ hours +`:`+ minutes
            },
            formatter(type, val) {
                if (type === 'year') {
                    return val + '年';
                }
                if (type === 'month') {
                    return val + '月';
                }
                if (type === 'day') {
                    return val + '日';
                }
                if (type === 'hour') {
                    return val + '时';
                }
                if (type === 'minute') {
                    return val + '分'
                }
                return val;
            },
            filter(type, options) {
                var h=[];
                if (type === 'hour') {
                    h = options.filter((option) => option >= 9 && option< 20);
                   // console.info('h:'+h)
                    return h;
                }
                return options;
            },
            getTime(){
                this.showtime = true;
            },
            onConfirmdate(val){
                console.info(val);
                this.ydtime = this.formatDate(val);
                this.showtime = false;
            },
            showaddressList(){
                if(this.addresslist.length==0){
                    this.editAddr = true;
                }else{
                    this.showList = true;
                }
            },
            addressList(){
                var self = this;
                    self.$toast.loading({forbidClick: true, duration: 0});
                    var data = {
                        limit: self.limit,
                        page: self.page
                    };
                    httpKit.post("/coffee/address/list", data ,httpKit.type.formData).then(res => {
                        self.$toast.clear();
                        // console.info(res.data);
                        self.addresslist = res.data;
                        if(self.addresslist.length > 0){
                            self.addresslist = self.addresslist.map(item=>{
                                return {
                                    address:item.address,
                                    name:item.contact,
                                    id:item.id,
                                    isdefault:item.isdefault,
                                    tel:item.tel,
                                    ygbm:item.ygbm

                                }
                            });
                            self.addresslist.forEach(item=>{
                                if(item.isdefault=='2'){
                                    self.chosenAddressId = item.id;
                                    self.address = item
                                }else{
                                    self.chosenAddressId = '0';
                                    self.address = self.addresslist[0]
                                }
                            });
                           // self.address = self.addresslist.filter(item=>item.isdefault=='2')[0]
                        }else{
                            this.showList = false;
                            this.addressInfo = {};
                            this.address = {};
                        }
                    }).catch(err => {
                        self.$toast.clear();
                        self.$toast.fail({
                            message: err.message
                        });
                    });
            },
            gzpicker(){
                this.radio='2';
                this.showgzPicker = true;
            },
            showbm(){
                this.showbmPicker = true;
            },
            showspr(){
                this.showsprPicker = true;
            },
            onbmConfirm(item){
                var self = this;
                self.showbmPicker = false;
                self.createrBmbm = item;
            },
            onsprConfirm(item){
                this.spr = item;
                this.showsprPicker = false
            },
            gzsubmitInfo(){
                if(!this.createrBmbm.ysbm){
                    this.$toast('请选择部门');
                    return false;
                }
                if(!this.spr.id){
                    this.$toast('请选择审批人');
                    return false;
                }
                if(!this.reason){
                    this.$toast('请填写事由');
                    return false;
                }
               this.showgzPicker = false
            },
            onSave(item){ //保存地址
                console.info(item)
                if(!this.addressInfo.id){
                    this.$toast.loading({forbidClick: true, duration: 0});
                    var data = {
                        address: item.addressDetail,
                        contact: item.name,
                        isdefault:item.isDefault ? 2 : 1,
                        tel:item.tel,
                        id:''
                    };
                    httpKit.post("/coffee/address/add", data).then(res => {
                        this.$toast.clear();
                        this.$toast("添加成功！");
                        this.editAddr = false;
                        this.showList = false;
                        this.address={
                            address:res.data.address,
                            name:res.data.contact,
                            tel:res.data.tel,
                            ygbm:res.data.ygbm,
                            id:res.data.id
                        }
                        this.addressInfo = {};
                        this.addresslist.push(this.address)
                    }).catch(err => {
                        this.$toast.clear();
                        this.$toast.fail({
                            message: err.message
                        });
                    });
               }else{
                    this.$toast.loading({forbidClick: true, duration: 0});
                    var data = {
                        address: item.addressDetail,
                        contact: item.name,
                        isdefault:item.isDefault ? 2 : 1,
                        tel:item.tel,
                        id:this.addressInfo.id
                    };
                    httpKit.post("/coffee/address/edit", data).then(res => {
                        this.$toast.clear();
                        this.$toast("修改成功！");
                        this.editAddr = false;
                        this.showList = false;
                        this.address['address']= item.addressDetail;
                        this.address['name'] = item.name;
                        this.address['tel'] = item.tel;
                        this.addressInfo = {};
                    }).catch(err => {
                        this.$toast.clear();
                        this.$toast.fail({
                            message: err.message
                        });
                    });
                }



            },
            onDelete(){
                this.$toast.loading({forbidClick: true, duration: 0});
                var data = {
                    id:this.addressInfo.id
                };
                httpKit.post("/coffee/address/del", data,httpKit.type.form).then(res => {
                    this.$toast.clear();
                    this.$toast("删除成功！");
                    this.editAddr = false;
                    this.addressList();
                }).catch(err => {
                    this.$toast.clear();
                    this.$toast.fail({
                        message: err.message
                    });
                });
            },
            cancle(item){
                console.info(item)
            },
            onAdd(){
                this.editAddr = true;
                this.address = {};
                this.addressInfo = {}
            },
            onEdit(item,index){
                var self = this;
                console.info(item)
                this.editAddr = true;
                self.addressInfo = item
                self.$toast.loading({forbidClick: true, duration: 0});
                var data = {
                    id: item.id,
                };
                httpKit.post("/coffee/address/detail", data ,httpKit.type.formData).then(res => {
                    self.$toast.clear();
                    console.info(res.data);
                    self.addressInfo={
                        name:res.data.contact,
                        addressDetail:res.data.address,
                        tel:res.data.tel,
                        isDefault:res.data.isdefault=='1' ? false : true,
                        id:res.data.id
                    }

                }).catch(err => {
                    self.$toast.clear();
                    self.$toast.fail({
                        message: err.message
                    });
                });
               // this.address
            },
            select(item,index) {
                console.info(item);
                this.showList = false;
                this.address = item;
                this.chosenAddressId = item.id;
            },
            onSubmit(){
                if(JSON.stringify(this.address)=="{}"){
                    this.$toast("请选择地址");
                    return false;
                }
                if(this.iswork==false){
                    this.$toast("今天是休息日，不支持线上下单");
                    return false;
                }
                if(this.radio=='2'){
                    if(!this.reason){
                        this.$toast('请填写事由');
                        return false;
                    }
                }
                var orderdata = {
                    address:this.address.address,
                    contact:this.address.name,
                    tel:this.address.tel,
                    approver:this.spr.id,
                    createrBmbm:this.createrBmbm.id,
                    createrTjgs:this.createrBmbm.tjgs,
                    createrYsbm:this.createrBmbm.ysbm,
                    paytype:this.radio,
                    reason:this.reason,
                    reservedate:this.ydtime,
                    details:this.dataList.coffeelist//订单明细
                };
                this.$toast.loading({ forbidClick: true, duration: 0});

                httpKit.post('/coffee/order/add', orderdata).then(res=>{
                    this.$toast.clear();
                    window.localStorage.clear();
                    if(this.radio=='1'){
                        window.localStorage.setItem('paydata', JSON.stringify(res.data));
                        window.location.href='../gsubmit/gsubmitResult.html';

                    }else{
                        this.$dialog.alert({
                            message: '挂账成功，请等待审核',
                        }).then(() => {
                            // on close
                            window.location.href='../gcoffeeOrder/gcoffeeOrder.html'
                        });
                    }


                }).catch(err => {
                    this.$toast.clear();
                    if(err.code=='444'){
                        this.$dialog.alert({
                            message: err.message,
                        }).then(() => {
                            // on close
                            window.location.href='../gcoffeeOrder/gcoffeeOrder.html'
                        });
                    }else if(err.code=='445'){
                        this.$dialog.alert({
                            message: err.message,
                        }).then(() => {
                            // on close
                            window.location.href='../gsubmit/gsubmit.html'

                        });
                    }else{
                        this.$toast.fail({
                            message: err.message,
                            duration:err.message.length*100
                        });
                    }

                });
            },
            goShoping(){
                window.history.back(-1)
            },
            getiswork(){
                httpKit.post("/coffee/iswork").then(res => {
                    this.$toast.clear();
                    console.info(res.data);
                    this.iswork = res.data;
                }).catch(err => {
                    this.$toast.clear();
                    this.$toast.fail({
                        message: err.message,
                        duration:err.message.length*100
                    });
                });
            }
        },
        computed: {
            totalMoney(){
                var sum = 0;
                this.dataList.coffeelist.forEach(item=>{
                    sum += item.buynum*item.price;
                    this.dataList.totalPrice = sum
                });
                return sum;
            },
        },
        watch:{

        },
        created: function(){
            var self = this;
            self.$toast.loading({forbidClick: true, duration: 0});
            httpKit.post("/coffee/order/onAccount").then(res => {
                self.$toast.clear();
                console.info(res.data);
                self.sprcolumns = res.data.sprList.map(item=>{
                    return{
                        'id':item.ygbm,
                        'text':item.ygxm,
                        'mr':item.mr
                    }
                });

                self.spr = self.sprcolumns.filter(item=>item.mr=='1').map(item=>{return item})[0];
                self.bmcolumns = res.data.bmList.map(item=>{
                    return{
                        'id':item.bmbm,
                        'text':item.bmmc,
                        'ysbm':item.ysbm,
                        'tjgs':item.tjgs
                    }
                });
                self.createrBmbm = self.bmcolumns[0];
            }).catch(err => {
                self.$toast.clear();
                self.$toast.fail({
                    message: err.message,
                    duration:err.message.length*100
                });
            });

        },
        mounted(){
            var self = this;
            self.filter('formatterPrice', function (value) {
                _.floor(value, 2);
            });
            self.addressList();
            self.getiswork()
        }
    });
});
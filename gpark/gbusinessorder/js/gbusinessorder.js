require(['httpKit','echarts'], function (httpKit, echarts) {
    new Vue({
        el: '#gbusinessorder',
        template: `<div>
                        <van-divider :style="{ borderColor: '#fff', padding: '0 16px' }"></van-divider>
                        <van-field readonly v-model="creater" label="订餐人" placeholder="" />
                        <van-field readonly v-model="tel" label="订餐人电话" placeholder="" />
                        <van-form @submit="onSubmit">
                          <van-field  readonly v-model="ydtime" name="用餐时间" label="用餐时间" @click="showtime = true"/>
                          <van-field required v-model="number" label="用餐人数" placeholder="请输入用餐人数" />
                          <van-field required readonly  type="number" name="cb" label="用餐标准"  :value="reservePrice.text" placeholder="请选择"  @click="showcb"/>
                          <van-field required readonly  type="number" name="bm" label="选择部门" :value="createrBmbm.text" placeholder="请选择"  @click="showbm"/>
                          <!--<van-field readonly clickable name="spr" label="选择审批人" :value="spr.text" placeholder="请选择" />-->
                          <van-field v-show="initData.onAccount=='1'" readonly clickable  name="gz" label="是否挂账" :value="onAccount.text" placeholder="请选择"  @click="showgz"/>
                           <van-field readonly v-show="initData.onAccount=='0'" label="结算方式" type="number" value="自费"/>
                          <van-field v-model="message" rows="3" autosize label="备注" type="textarea" placeholder="可填写忌口，口味等需求"/>
                          <div style="margin: 16px;">
                            <van-button color="#07c160" round block type="primary" native-type="submit">
                              提交
                            </van-button>
                          </div>
                        </van-form>
                        <!--是否挂账-->
                        <van-popup v-model="showgzPicker" round position="bottom">
                            <van-picker show-toolbar :columns="gzcolumns" @cancel="showgzPicker = false" @confirm="ongzConfirm"/>
                        </van-popup>
                        <!--部门选择-->
                        <van-popup v-model="showbmPicker" round position="bottom">
                            <van-picker show-toolbar :columns="bmcolumns" @cancel="showbmPicker = false" @confirm="onbmConfirm"/>
                        </van-popup>
                        <!--餐标选择-->
                        <van-popup v-model="showcbPicker" round position="bottom">
                            <van-picker show-toolbar :columns="cbcolumns" @cancel="showcbPicker = false" @confirm="oncbConfirm"/>
                        </van-popup>
                        <!--时间选择-->
                        <van-popup v-model="showtime" position="bottom">
                            <van-datetime-picker type="datetime" v-model="currentDate" :columns-order="['year', 'month', 'day','hour','minute']" :formatter="formatter" title="选择日期" :min-date="mindate"  @confirm="onConfirmdate" @cancel="showtime=false"/>
                        </van-popup>
                        <!--<van-popup v-model="showtime" position="bottom">
                                <van-datetime-picker type="date" v-model="currentDate" :columns-order="['year', 'month', 'day']" :formatter="formatter" title="选择开始时间" :min-date="mindate"  @confirm="onConfirmdate" @cancel="showdate=false"/>
                        </van-popup>-->
                        <div class="bgpic"></div>
                   </div>
                    `,
            data() {
                return {
                    initData:{},
                    bmcolumns:[],
                    cbcolumns:[
                        {
                            id:15,
                            text:'15元/份'
                        },
                        {
                            id:20,
                            text:'20元/份'
                        }
                        ],
                    gzcolumns:[
                        {
                            id:1,
                            text:'是'
                        },
                        {
                            id:0,
                            text:'否'
                        }
                    ],
                    onAccount:{},
                    createrBmbm:{},
                    reservePrice:{},//cb
                    createrYsbm:[],
                    spr:{},
                    creater:'',
                    tel:'',
                    number:'',
                    night:'',
                    showbmPicker:false,
                    showcbPicker:false,
                    showgzPicker:false,
                    ydtime:`${this.formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours()+1, new Date().getMinutes()))}`,
                    showtime:false,
                    showyctime:false,
                    mindate:new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours()+1, new Date().getMinutes()),
                    currentDate:new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours()+1, new Date().getMinutes()),
                    message:''
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
                onConfirmdate(val){
                    console.info(val);
                    this.ydtime = this.formatDate(val);
                    this.showtime = false;
                },
                showbm(){
                    this.showbmPicker = true;

                },
                showcb(){
                    this.showcbPicker = true;
                },
                showgz(){
                    this.showgzPicker = true;
                },
                oncbConfirm(item){//cb
                    this.showcbPicker = false;
                    this.reservePrice = item;
                },
                onbmConfirm(item){
                    var self = this;
                    self.showbmPicker = false;
                    self.createrBmbm = item;
                    if(self.createrBmbm.id){
                        self.$toast.loading({ forbidClick: true, duration: 0});
                        httpKit.post("/reserve/getYsbmjl",{createrYsbm:self.createrBmbm.id}).then(res=>{
                            self.$toast.clear();
                            console.info(res);
                            self.createrYsbm = res.data;
                            self.createrYsbm = self.createrYsbm.map(item=>{
                                return {
                                    id:item.ysbmjl,
                                    text:item.ygxm
                                }
                            });
                            self.spr = self.createrYsbm.length==1 ? self.createrYsbm[0] : '';
                        }).catch(err => {
                            self.$toast.clear();
                            self.$toast.fail({
                                message: err.message
                            });
                        });
                    }
                },
                ongzConfirm(item){
                    this.showgzPicker = false;
                    this.onAccount = item;
                },
                onSubmit(){
                    var self = this;
                    if(!self.number){
                        this.$toast('请填写用餐人数');
                        return false;
                    }
                    if(!self.createrBmbm.ysbm){
                        this.$toast('请选择部门');
                        return false;
                    }
                    var data = {
                        'reserveType':httpKit.urlParams().type,
                        'creater':self.creater,
                        'number':self.number,
                        'createrBmbm':self.createrBmbm.id,
                        'createrTel':self.initData.ygxx.tel,
                        'createrTjgs':self.createrBmbm.tjgs,
                        'createrYsbm':self.createrBmbm.ysbm,
                        'reservePrice':self.reservePrice.id,
                        'reserveTime':self.ydtime.split(' ')[1],
                        'reserveDate':self.ydtime.split(' ')[0],
                        'onAccount':self.onAccount.id,
                        /*'approver':self.spr.id*/
                        'note':self.message
                    };
                    //debugger
                    self.$toast.loading({ forbidClick: true, duration: 0});
                    //return;
                    httpKit.post("/reserve/canyin/addItem",data,httpKit.type.json).then(res=>{
                        self.$toast.clear();
                        self.$toast("预定成功");
                        window.location.href='../../gpark/gmyordering/gmyordering.html'
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
                var self = this;
                var data = {
                    // createrYgbm:'02737',
                    reserveType:httpKit.urlParams().type
                };
                self.$toast.loading({ forbidClick: true, duration: 0});
                httpKit.post("/reserve/init",data,httpKit.type.json).then(res=>{
                    self.$toast.clear();
                    console.info(res);
                    self.initData = res.data;
                    self.bmcolumns = self.initData.bmList.map(item=>{
                        return{
                            'id':item.bmbm,
                            'text':item.bmmc,
                            'ysbm':item.ysbm,
                            'tjgs':item.tjgs
                        }
                    });
                    self.reservePrice = self.cbcolumns[0];
                   // self.createrBmbm = self.bmcolumns.length == 1 ? self.bmcolumns[0] : '';
                    if(self.bmcolumns.length == 1){
                        self.onbmConfirm(self.bmcolumns[0])
                    }
                    self.creater = self.initData.ygxx.ygxm;
                    self.tel = self.initData.ygxx.tel
                }).catch(err => {
                    self.$toast.clear();
                    self.$toast.fail({
                        message: err.message
                    });
                });

            }
        });

});
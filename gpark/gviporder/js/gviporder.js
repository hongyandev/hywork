require(['httpKit','echarts'], function (httpKit, echarts) {
    new Vue({
        el: '#gviporder',
        template: `<div>
                        <van-divider :style="{ borderColor: '#fff', padding: '0 16px' }"></van-divider>
                        <van-field v-model="creater" label="订餐人" placeholder="" />
                        <van-field v-model="tel" label="订餐人电话" placeholder="" />
                        <van-form @submit="onSubmit">
                          <van-field readonly v-model="ydtime" name="用餐时间" label="用餐时间" placeholder="用餐时间" :rules="[{ required: true, message: '请选择用餐时间' }]" @click="showtime = true"/>
                          <van-field required v-model="number" type="number" label="用餐人数" placeholder="请输入用餐人数" />
                          <van-field required label="用餐标准" v-model="reservePrice" type="number" placeholder="请填写餐标：比如15元/人"/>
                          <van-field required readonly clickable name="bm" label="选择部门" :value="createrBmbm.text" placeholder="请选择"  @click="showbm"/>
                          <!--<van-field readonly clickable name="spr" label="选择审批人" :value="spr.text" placeholder="请选择" />-->
                          <van-field required v-show="initData.onAccount=='1'" readonly clickable  name="gz" label="是否挂账" :value="onAccount.text" placeholder="请选择"  @click="showgz"/>
                          <van-field
                              v-model="message"
                              rows="3"
                              autosize
                              label="备注"
                              type="textarea"
                              placeholder="可填写忌口，口味等需求"
                            />
                          <div style="margin: 16px;">
                            <van-button ref="submitbtn" color="#07c160" round block type="primary" native-type="submit">
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
                        <!--时间选择-->
                        <van-popup v-model="showtime" position="bottom">
                            <van-datetime-picker type="datetime" v-model="currentDate" :columns-order="['year', 'month', 'day','hour','minute']" :formatter="formatter" title="选择日期" :min-date="mindate"  @confirm="onConfirmdate" @cancel="showtime=false"/>
                        </van-popup>
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
                reservePrice:"",//cb
                createrYsbm:[],
                spr:{},
                creater:'',
                tel:'',
                number:'',
                night:'',
                showbmPicker:false,
                showcbPicker:false,
                showgzPicker:false,
                ydtime:`${this.formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()+1, new Date().getHours(), new Date().getMinutes()))}`,
                showtime:false,
                showyctime:false,
                mindate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()+1, new Date().getHours(), new Date().getMinutes()),
                currentDate:new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()+1, new Date().getHours(), new Date().getMinutes()),
                message:'',
                closeDate:{}
            };
        },
        methods: {
            formatDate(date) {
                var hours,
                    minutes;
                hours = `${date.getHours()}`<10 ? '0' + `${date.getHours()}` : `${date.getHours()}`;
                minutes = `${date.getMinutes()}` < 10 ? '0'+`${date.getMinutes()}`:`${date.getMinutes()}`;
                return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} `+ hours  +`:`+ minutes;
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
                if(!self.reservePrice){
                    this.$toast('请选择用餐标准');
                    return false;
                }
                if(!self.createrBmbm.ysbm){
                    this.$toast('请选择部门');
                    return false;
                }
                if(!self.onAccount.id){
                    this.$toast('请选择是否挂账');
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
                    'reservePrice':self.reservePrice,
                    'reserveTime':self.ydtime.split(' ')[1],
                    'reserveDate':self.ydtime.split(' ')[0],
                    'onAccount':self.onAccount.id,
                   /* 'approver':self.spr.id*/
                    'note':self.message
                };
                //debugger
                self.$toast.loading({ forbidClick: true, duration: 0});
                //return;
                httpKit.post("/reserve/canyin/addItem",data,httpKit.type.json).then(res=>{
                    self.$toast.clear();
                    self.$toast("预定成功");
                    window.location.href='../../gmyordering/gmyordering.html'
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
                self.onAccount = self.gzcolumns[0];
                self.createrBmbm = self.bmcolumns.length == 1 ? self.bmcolumns[0] : '';
                self.creater = self.initData.ygxx.ygxm;
                self.tel = self.initData.ygxx.tel;
                self.closeDate = self.initData.closeDate;
                if(httpKit.urlParams().type = self.closeDate.reserveType){
                    self.closeDate.closeDate.forEach(item=>{
                        var strdate = new Date(item.startTime).getTime();
                        var enddate = new Date(item.endTime).getTime()
                        if(strdate < new Date().getTime() < enddate){
                            self.$toast("今日未开放订餐");
                            self.$refs.submitbtn.disabled = true;
                        }else{
                            self.$refs.submitbtn.disabled = false;
                        }
                    })
                }
            }).catch(err => {
                self.$toast.clear();
                self.$toast.fail({
                    message: err.message
                });
            });
        },
        mounted(){

        }
    });

});
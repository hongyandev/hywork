require(['httpKit','PullUpDown','backTop'], function (httpKit,PullUpDown,backTop) {
    new Vue({
        el: '#gbusorder',
        components: {
            'pull-up-down':PullUpDown,
            'back-top':backTop
        },
        template: `<div>
                        <van-divider :style="{ borderColor: '#fff', padding: '0 16px' }">{{userInfo.today}}</van-divider>    
                        <van-divider :style="{ borderColor: '#f7f7f7', margin: '0 0 16px 0' }"></van-divider>
                        <ul class="busorder" v-if="busList.length > 0">
                            <li v-for="item in busList">
                                <time>{{item.tasksDate.split(' ')[1].substring(0,5)}}</time>
                                <div class="van_circle">
                                    <i></i><span>{{item.station.split(',')[0]}}</span>
                                </div>
                                <div class="van_line"></div>
                                 <div class="van_circle">
                                    <i></i><span>{{item.station.split(',')[1]}}</span>
                                </div>
                                <template v-if="item.tasksStatus=='2'">
                                    <span disabled class="ordertext" >{{item.tasksStatusDesc}}</span>
                                </template>
                                <template v-else>
                                    <div v-if="item.openOrder=='1'">
                                        <van-button v-show="item.orderStatus=='0'" class="orderbtn" round type="primary" @click="busOrder(item)">立即预约</van-button>
                                        <van-button v-show="item.orderStatus=='1'" plain hairline class="orderbtn" round type="primary" @click="cancelbusOrder(item)">取消预约</van-button>
                                    </div>
                                    <div v-else>
                                        <span class="ordertext">{{item.tasksStatusDesc}}</span>
                                    </div>
                                </template>
                            </li>
                        </ul>
                        <van-empty v-else description="今天没有班车信息" />
                        <van-popup v-model="showInfo" position="center" :style="{ height: '40%',width:'90%' }">
                            <van-cell-group>
                              <van-cell title="站点信息">
                                    <template #extra>
                                         <span>{{startStation}}</span> - <span>{{endstation}}</span>  
                                    </template>
                              </van-cell>
                              <van-field label="姓名" v-model="username" :value="userInfo.userName" />
                              <van-field label="手机" v-model="userphone" name="validator" :value="userInfo.userPhone"/>
                            </van-cell-group>
                            <div style="margin:16px;">
                                <van-button round block type="primary" @click="confirmorder">确定预约</van-button>
                            </div>
                        </van-popup>
                   </div>
                    `,
            data() {
                return {
                    showInfo:false,
                    busList:[],
                    userInfo:{},
                    nowTask:{},
                    startStation:'',
                    endstation:'',
                    username:'',
                    userphone:'',
                    tasksId:''
                };
            },
            methods: {
                busOrder(item){
                    var self = this;
                    self.showInfo = true;
                    self.nowTask = item;
                    self.startStation = item.station.split(',')[0];
                    self.endstation = item.station.split(',')[1];
                    self.tasksId = item.id
                },
                cancelorder(id) {

                    httpKit.post("/busOrder/cancelOrder",{tasksId:id}).then(res=>{
                        this.$toast.clear();
                        console.info(res);
                        this.$toast("已取消预约！");
                        location.reload();
                    }).catch(err => {
                        this.$toast.clear();
                        this.$toast.fail({
                            message: err.message
                        });
                    });
                },
                cancelbusOrder(item){
                    var self = this;
                    self.tasksId = item.id;
                    self.$dialog.confirm({
                        title: '确定取消预约吗？'
                    }).then(() => {
                            // on confirm
                           self.cancelorder(item.id);


                    }).catch(() => {
                            // on cancel

                        });
                },
                confirmorder(){
                    var self = this;
                    var reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
                    if (!reg.test(self.userphone)) {
                        self.$toast("手机号格式不正确");
                        //self.userphone = '';
                        return false;
                    }
                    if(!self.userphone){
                        self.$toast("请填写手机号码");
                        return false;
                    }
                    self.$toast.loading({ forbidClick: true, duration: 0});
                    var data = {
                        tasksId:self.tasksId,
                        userName: self.username,
                        userPhone: self.userphone
                    };
                    httpKit.post("/busOrder/addOrder",data).then(res=>{
                        self.$toast.clear();
                        console.info(res);
                        self.$toast("预约成功！");
                        self.showInfo = false;
                        location.reload();
                    }).catch(err => {
                        self.$toast.clear();
                        self.$toast.fail({
                            message: err.message
                        });
                    });
                },
                loadorder(){
                    var self = this;

                    self.$toast.loading({ forbidClick: true, duration: 0});
                    httpKit.post("/busOrder/listTasks",{userName:self.userInfo.userName}).then(res=>{
                        self.$toast.clear();
                        console.info(res);
                        self.busList = res.data;
                        /*self.busList.filter(item=>(item.tasksStatus=='0')=>{

                        })*/
                    }).catch(err => {
                        self.$toast.clear();
                        self.$toast.fail({
                            message: err.message
                        });
                    });
                }
            },
            computed: {
                phoneStyle() {
                    let reg = /(^1[3|4|5|8][0-9]\d{4,8}$)|(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)/
                    if (!reg.test(this.userphone)) {
                        this.$toast("联系方式填写有误")
                        return false
                    }
                    return true
                },
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
                this.$nextTick(function () {
                    this.loadorder()
                })
            }
        });

});
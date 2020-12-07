require(['httpKit','echarts'], function (httpKit, echarts) {
    new Vue({
        el: '#gviporder',
        template: `<div>
                        <van-divider :style="{ borderColor: '#fff', padding: '0 16px' }"></van-divider>
                        <van-form @submit="onSubmit">
                          <van-field
                            readonly
                            v-model="ydtime"
                            name="预定时间"
                            label="预定时间"
                            placeholder="预定时间"
                            :rules="[{ required: true, message: '请选择预定时间' }]"
                            @click="showtime = true"
                          />
                          <van-field name="checkboxGroup" label="用餐类别">
                              <template #input>
                                <van-checkbox-group v-model="checkboxGroup" direction="horizontal">
                                  <van-checkbox checked-color="#07c160" v-show="initData.LunchOptions=='1'" name="12:00" shape="square">午餐</van-checkbox>
                                  <van-checkbox checked-color="#07c160" name="18:00" value="18:00" shape="square">晚餐</van-checkbox>
                                </van-checkbox-group>
                              </template>
                          </van-field>
                          <van-field readonly clickable  name="bm" label="选择部门" :value="createrBmbm.text" placeholder="请选择"  @click="showbm"/>
                          <van-field readonly clickable name="spr" label="选择审批人" :value="spr.text" placeholder="请选择"  @click="showspr"/>
                          <div style="margin: 16px;">
                            <van-button round block type="primary" native-type="submit">
                              提交
                            </van-button>
                          </div>
                        </van-form>
                        <van-popup v-model="showbmPicker" round position="bottom">
                            <van-picker show-toolbar :columns="bmcolumns" @cancel="showbmPicker = false" @confirm="onbmConfirm"/>
                        </van-popup>
                        <!--<van-popup v-model="showtime" position="bottom">
                                <van-datetime-picker type="date" v-model="currentDate" :columns-order="['year', 'month', 'day']" :formatter="formatter" title="选择时间" :min-date="mindate"  @confirm="onConfirmdate" @cancel="showdate=false"/>
                        </van-popup>-->
                   </div>
                    `,
            data() {
                return {
                    initData:{},
                    bmcolumns:[],
                    createrBmbm:{},
                    night:'',
                    showbmPicker:false,
                    ydtime:`${this.formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()))}`,
                    num:'',
                    yctime:'',
                    createrYsbm:[],
                    spr:{},
                    showtime:false,
                    mindate:  new Date(),
                    currentDate:new Date(),
                    checkbox: false,
                    checkboxGroup: [],
                };
            },
            methods: {
                formatDate(date) {
                    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
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
                showspr(){
                    if(!this.createrBmbm.id){
                        this.$toast('请选择部门');
                        return false;
                    }
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
                onSubmit(){
                    var self = this;
                    if(!self.checkboxGroup.toString()){
                        this.$toast('请选择用餐类别');
                        return false;
                    }
                    if(!self.createrBmbm.ysbm){
                        this.$toast('请选择部门');
                        return false;
                    }
                    var data = {
                        'reserveType':httpKit.urlParams().type,
                        'creater':self.initData.ygxx.ygxm,
                        'createrBmbm':self.createrBmbm.id,
                        'createrTel':self.initData.ygxx.tel,
                        'createrTjgs':self.createrBmbm.tjgs,
                        'createrYsbm':self.createrBmbm.ysbm,
                        'reserveTime':self.checkboxGroup.toString(),
                        'reserveDate':self.ydtime,
                        'approver':self.spr.id,
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
                    reserveType:'3'
                };
                self.$toast.loading({ forbidClick: true, duration: 0});
                httpKit.post("/reserve/init",data,httpKit.type.json).then(res=>{
                    self.$toast.clear();
                    console.info(res);
                    self.initData = res.data;
                    this.bmcolumns = this.initData.bmList.map(item=>{
                        return{
                            'id':item.bmbm,
                            'text':item.bmmc,
                            'ysbm':item.ysbm,
                            'tjgs':item.tjgs
                        }
                    });
                    self.createrBmbm = self.bmcolumns.length == 1 ? self.bmcolumns[0] : ''
                    if(self.bmcolumns.length == 1){
                       self.onbmConfirm(self.bmcolumns[0])
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
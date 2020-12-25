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
                          <van-field required name="checkboxGroup" label="用餐类别">
                              <template #input>
                                <van-checkbox-group v-model="checkboxGroup" direction="horizontal">
                                  <van-checkbox checked-color="#07c160" v-show="initData.LunchOptions=='1'" name="11:00" shape="square">午餐</van-checkbox>
                                  <van-checkbox checked-color="#07c160" name="17:00" value="17:00" shape="square">晚餐</van-checkbox>
                                </van-checkbox-group>
                              </template>
                          </van-field>
                          <van-field required readonly clickable  name="bm" label="选择部门" :value="createrBmbm.text" placeholder="请选择"  @click="showbm"/>
                          <van-field required readonly clickable name="spr" label="选择审批人" :value="spr.text" placeholder="请选择"  @click="showspr"/>
                          <van-field required v-model="message" rows="3" autosize label="加班理由" type="textarea" placeholder="请填写加班理由"/>
                          <div style="margin: 16px;">
                            <van-button round block type="primary" native-type="submit">
                              提交
                            </van-button>
                          </div>
                        </van-form>
                        <van-popup v-model="showbmPicker" round position="bottom">
                            <van-picker show-toolbar :columns="bmcolumns" @cancel="showbmPicker = false" @confirm="onbmConfirm"/>
                        </van-popup>
                        <van-popup v-model="showsprPicker" round position="bottom">
                            <van-picker show-toolbar :columns="sprcolumns" @cancel="showsprPicker = false" @confirm="onsprConfirm"/>
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
                    sprcolumns:[],
                    createrBmbm:{},
                    night:'',
                    showbmPicker:false,
                    showsprPicker:false,
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
                    message:''
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
                    if(!self.spr.id){
                        this.$toast('请选择审批人');
                        return false;
                    }
                    if(!self.message){
                        this.$toast('请填写加班理由');
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
                        'note2 ':self.message
                    };
                    //return;
                    self.$toast.loading({ forbidClick: true, duration: 0});
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
                    self.bmcolumns = self.initData.bmList.map(item=>{
                        return{
                            'id':item.bmbm,
                            'text':item.bmmc,
                            'ysbm':item.ysbm,
                            'tjgs':item.tjgs
                        }
                    });
                    self.createrBmbm = self.bmcolumns.length == 1 ? self.bmcolumns[0] : '';
                    self.sprcolumns = self.initData.sprList.map(item=>{
                        return{
                            'id':item.ygbm,
                            'text':item.ygxm,
                            'mr':item.mr
                        }
                    });
                    self.spr = self.sprcolumns.filter(item=>item.mr=='1').map(item=>{return item})[0];
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
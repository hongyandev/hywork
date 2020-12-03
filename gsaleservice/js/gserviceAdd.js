require(['httpKit','PullUpDown','lodash'], function (httpKit,PullUpDown,_) {
    new Vue({
        el: '#gsaleservice',
        template: `<div>
                        <van-cell-group>
                          <van-field readonly label="业务员" :value="ywy.ygxm" />
                        
                          <!--客户信息-->
                          <van-field :readonly="line" v-model="shdata.khdm" :error-message="valKhdm" required label="客户代码" placeholder="请输入客户代码" @input="changeKhdm" @blur="getBpc" />
                          <van-field :value="shdata.khmc" readonly label="客户名称" placeholder="客户名称" />
                          <van-field v-model="shdata.khlxr" label="客户联系人" placeholder="请输入" />
                          <van-field v-model="shdata.khtel" label="客户电话" placeholder="请输入" />
                          
                          <!--产业-->
                          <van-field readonly clickable label="所属产业" :value="shdata.sscy.text" placeholder="请输入" @click="showcy" />
                          <van-popup v-model="showcyPicker" round position="bottom">
                             <van-picker show-toolbar :columns="cycolumns" @cancel="showcyPicker = false" @confirm="onConfirmcy"/>
                          </van-popup>
                          
                          <!--反馈类型-->
                          <van-field readonly clickable label="反馈类型" :value="shdata.fklx.text" placeholder="请输入" @click="showfk" />
                          <van-popup v-model="showfkPicker" round position="bottom">
                            <van-picker show-toolbar :columns="fkcolumns" @cancel="showfkPicker = false" @confirm="onConfirmfk"/>
                          </van-popup>
                          
                          <!--问题描述-->
                          <van-field v-model="shdata.blqkms" rows="1" autosize label="问题描述" type="textarea" placeholder="请输入"/>
                          
                          <!--产品明细-->
                          <van-field class="textarea" readonly clickable autosize type="textarea"  :val="shdata.cyInfo.cpdm" label="不良品信息" >
                               <template #input>
                                    <van-tag class="cptag" v-for="(cy,index) in shdata.cyInfo" closeable size="medium" @click="open(index,cy)"  @close="close(index,cy)">{{cy.cpdm}}</van-tag>
                               </template>
                               <template #button>
                                <van-button size="small" type="primary" @click="addcyInfo">新增</van-button>
                               </template>
                          </van-field>
                          
                          <!--图片上传-->
                          <div>
                             <div style="margin:10px 0 0 15px;line-height:24px;font-size:14px;color:#323232">图片上传</div>
                             <van-uploader class="uploadimg" v-model="fileList" :before-read="beforeRead" :after-read="onRead" accept="image/*"></van-uploader>
                          </div>
                          
                          <!--操作按钮-->
                          <div style="margin:16px;">
                             <van-button round block type="primary" @click="submit">提交</van-button>
                          </div>
                          
                        </van-cell-group>
                        
                         <!--展示产品明细-->
                          <van-popup closeable close-icon-position="top-right" v-model="showcyInfo" position="bottom" @close="closecyInfo" :style="{ height: '100%' }" >
                                <van-form style="margin-top:50px;border-top:1px solid #f7f7f7">
                                    <!--<div style="padding:10px;">
                                        <van-button icon="search" type="primary" @click="showorder">查询订单</van-button>
                                    </div>-->
                                    <van-swipe ref="myswipe">
                                    <van-swipe-item v-for="(item, index) in orders" :key="index">
                                        <van-field v-model="item.cpdm" name="cpdm" label="产品代码" placeholder="请输入" readonly></van-field>
                                        <van-field v-model="item.cpxh" name="cpxh" label="产品型号" placeholder="请输入" readonly/>
                                        <van-field v-model="item.htdh" name="htdh" label="合同单号" placeholder="请输入" readonly/>
                                        <van-field v-model="item.htsl" name="htsl" label="销售数量" placeholder="请输入" type="number"/>
                                        <van-field v-model="item.ddyths" name="srhqty" label="已退货数" placeholder="请输入" type="number" readonly/>
                                        <van-field v-model="item.blsl" name="blsl" label="不良数量" placeholder="请输入" type="number" required :rules="[{ validator: blsl(item)}]" />
                                        <van-field readonly clickable  name="baddesc" label="不良反馈" :value="item.text" placeholder="请选择" required   @click="showbaddesc(item)"/>
                                        <van-field v-model="item.desc" name="desc" type="textarea" rows="5" autosize  label="异常描述" required placeholder="请输入" />
                                    </van-swipe-item>
                                    </van-swipe>
                                    <div v-if="orders.length>0" style="margin: 16px;">
                                        <van-button round block type="primary" @click="detailsubmit">提交</van-button>
                                    </div>
                                </van-form>
                            </van-popup>
                            
                            
                            <!-- 查询x3订单 -->
                            <van-popup v-model="showorderPicker" position="top"  :style="{ height: '100%'}">
                                <van-sticky>
                                    <div class="popupTop" style="background: #fff;border-bottom:1px solid #f7f7f7">
                                         <van-search v-model="salfcy" placeholder="请输入产品代码"/>
                                         <van-cell class="datecell" :value="strDate+'~'+endDate" @click="showstrdate = true" />
                                         <van-button style="min-width:50px" class="searchbtn" type="primary" size="small" @click="searchorder">搜索</van-button>
                                    </div>
                                </van-sticky>
                                  <ul class="orderContent">  
                                       <li v-for="(data,index) in orderList">
                                           <div class="orderitem">
                                                <p><label>产品代码：<span>{{data.itmref}}</span></label><label>产品型号：<span>{{data.cpxh}}</span></label></p>
                                                <p><label>产业名称：<span>{{data.cpmc}}</span></label></p>
                                                <p><label>销售单价：<span>￥{{data.gropri}}</span></label><label>合同数：<span>{{data.salqty}}</span></label><label>已退货数：<span>{{data.srhqty}}</span></label></p>
                                           </div>
                                           <van-checkbox v-model="data.checked" :name="data.index" @click="orderchecked(data,orderList)" checked-color="#07c160"></van-checkbox>
                                       </li>
                                 </ul>
                               <div class="orderbtn">
                                <van-button type="default" @click="cancelorder">取消</van-button>
                                <van-button type="primary" @click="confirmorders">确定</van-button>
                               </div>
                            </van-popup>
                            
                            
                            <!-- 不良反馈 -->
                            <van-popup v-model="showbadPicker" round position="bottom">
                              <van-picker show-toolbar :columns="baddesccolumns" @cancel="showbadPicker = false" @confirm="onbaddescConfirm"/>
                            </van-popup>
                            <!--<van-calendar v-model="showdate" type="range" allow-same-day :default-date="defaultdate" :min-date="mindate" @confirm="onConfirmdate" />-->
                           <van-popup v-model="showstrdate" position="bottom">
                                <van-datetime-picker type="date" v-model="currentDate" :columns-order="['year', 'month', 'day']" :formatter="formatter" title="选择开始时间" :min-date="mindate"  @confirm="onConfirmstrdate" @cancel="showstrdate=false"/>
                           </van-popup>
                           <van-popup v-model="showenddate" position="bottom">
                                <van-datetime-picker type="date" v-model="currentDate" :columns-order="['year', 'month', 'day']"  :formatter="formatter" title="选择结束时间" :min-date="startdate"  @confirm="onConfirmenddate" @cancel="showenddate=false"/>
                           </van-popup>
                   </div>
                    `,
        data() {
            return {
                line: false,
                valKhdm: '必填',
                type:0, // 0:员工,1:客户
                current:0,
                value:"",
                sum:0,
                count:0,
                limit:1000,
                page:0,
                showsearch:false,
                showfkPicker:false,
                date: `${this.formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1))} ~ ${this.formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()))}`,
                strDate:`${this.formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1))}`,
                endDate:`${this.formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()))}`,
                startdate:'',
                mindate:  new Date(1900, 0, 1),
                currentDate:new Date(),
                defaultdate:[],
                shdata:{
                    khdm:"",
                    khmc:"",
                    khlxr:"",
                    khtel:"",
                    sscy:{
                        text:"电工事业部",
                        id:"A60"
                    },
                    fklx:{
                        text:"产品质量类",
                        id:"0",
                    },
                    message:"",
                    cyxx:"",
                    cyInfo:[],
                },
                showcyPicker:false,
                showcyInfo:false,
                showorderPicker:false,
                showstrdate:false,
                showenddate:false,
                cycolumns:[],
                fkcolumns:[
                    {
                        text:"产品质量类",
                        id:"0",
                    },
                    {
                        text:"差错类",
                        id:"1",
                    },
                    {
                        text:"缺货类",
                        id:"2",
                    }
                ],
                ywy:{},
                cpdm:"",
                cpxh:"",
                htdh:"",
                salenum:"",
                badnum:"",
                baddesc:{},
                desc:"",
                showbadPicker:false,
                baddesccolumns:[],
                fileList:[],
                imgBase64:[],
                salfcy:"",
                orderList:[],
                ischecked:false,
                orderarr:[],
                orders:[],
                badorder:[],
                selectedItem: Object,
                arrflag:false,
                imgSrc:""
            };
        },
        methods: {
            changeKhdm: function (value) { // 控制客户必填
                var self = this;
                if (value.length > 0)
                    self.valKhdm = ''
                else
                    self.valKhdm = '必填'
            },
            getBpc: function (e) { // 获取客户信息
                var data = {"khdm": e.target.value};
                var self = this;
                self.$toast.loading({ forbidClick: true, duration: 0});
                httpKit.post("/afterSale/getBpc", data, httpKit.type.form).then(res=>{
                    self.$toast.clear();
                    if (res.data) {
                        self.shdata.khmc = res.data.khmc;
                        self.shdata.khlxr = res.data.lxr;
                        self.shdata.khtel = res.data.lxdh;
                    } else {
                        self.$toast.fail('不存在此客户');
                        self.shdata.khmc = '';
                        self.shdata.khlxr = '';
                        self.shdata.khtel = '';
                    }
                }).catch(err => {
                    self.$toast.clear();
                    self.$toast.fail({
                        message: err.message
                    });
                });
            },
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
            showcy() {
                this.showcyPicker = true;
                httpKit.post("/afterSale/searchCy").then(res=>{
                    this.$toast.clear();
                    this.cycolumns = res.data;
                    this.cycolumns = this.cycolumns.map(item=>{
                        return {
                            text:item.cymc,
                            id:item.cydm
                        }
                    });
                }).catch(err => {
                    this.$toast.clear();
                    this.$toast.fail({
                        message: err.message
                    });
                });
            },
            showfk(){
                this.showfkPicker = true
            },
            addcyInfo() {//新增产品明细
                var self = this;
                if (!self.shdata.khmc) {
                    self.$toast.fail('请填写客户');
                    return;
                }
                this.showcyInfo = true;
                this.arrflag = true;
                if(this.arrflag){
                    this.orders = []
                }
                this.showorder();
            },
            onSearch(val){
                this.salfcy = val;
                this.showsearch = false;
                this.showorder();
            },
            showSpopup(){
                this.showsearch = true;
            },
            showorder(){
                var self = this;
                self.showorderPicker = true;
                var orderdata = {
                    "bpcord": self.shdata.khdm,
                    "begin_orddat":self.strDate,
                    "end_orddat":self.endDate,
                    "cyfcy":self.shdata.sscy.id,
                    "query":self.salfcy,
                    "limit":self.limit,
                    "page":self.page
                };
                self.$toast.loading({ forbidClick: true, duration: 0});
                httpKit.post("/afterSale/query-x3-order-line",orderdata, httpKit.type.form).then(res=>{
                    self.$toast.clear();
                    self.orderList = res.data;
                    /*self.sum = res.count;
                    self.count = _.ceil(res.count / self.limit);
                    if(self.page == '1'){
                        self.orderList = res.data;
                    }else{
                        self.orderList = self.orderList.concat(res.data)
                    }
                    if(self.orderList.length > 0){
                        self.page++;
                    }
                    if (self.orderList && self.orderList.length > 0)
                        self.$refs['pull'].closePullDown();*/
                }).catch(err => {
                    self.$toast.clear();
                    self.$toast.fail({
                        message: err.message
                    });
                });
            },
            searchorder(){
                this.showorder();
            },
            onConfirmstrdate(val){//stardate
                console.info(val);
                this.startdate = val;
                this.strDate = this.formatDate(val);
                this.showstrdate = false;
                this.showenddate = true;
            },
            onConfirmenddate(val){//enddate
                console.info(val);
                this.endDate = this.formatDate(val);
                this.showenddate = false;
            },
            confirmorders(){//x3订单确定
                this.showorderPicker = false;
                var orderarr = [];
                this.orderList.forEach(function (item) {
                    if(item.checked){
                        orderarr.push(item);
                    }
                });
                if (orderarr.length < 1) {
                    this.showcyInfo = false;
                    this.arrflag = false;
                    return;
                }
                this.showcyInfo = true;
                this.orders = this.orders.concat(orderarr);
                this.orders = this.orders.map(item => {
                    return{
                        htdh:item.sohnum,
                        cpdm:item.itmref,
                        cpmc:item.cpmc,
                        cpxh:item.cpxh,
                        cpxl:item.tjz5,
                        htsl:item.salqty,
                        ddyths:item.srhqty,
                        blsl:item.blsl || 1,
                        blhj:item.blhj,
                        wtms:item.wtms || "",
                        cpjj:item.netpri,
                        htje:_.multiply(item.salqty,item.netpri),
                        blje:_.multiply(item.netpri,item.blsl),
                        ddhh:item.soplin
                    }
                });
                this.badorder = this.badorder.concat(this.orders);

            },
            closecyInfo(){
                this.showcyInfo = false;
                this.arrflag = false;
                if(this.badorder.length > 0){
                    this.orders = this.badorder
                }
            },
            cancelorder(){
                this.showorderPicker = false;
                this.showcyInfo = false;
                this.arrflag = false;
                if(this.badorder.length > 0){
                    this.orders = this.badorder
                }
            },
            /*onConfirmdate(date){
                const [start, end] = date;
                this.showdate = false;
                this.date = `${this.formatDate(start)} ~ ${this.formatDate(end)}`;
                var datearr = this.date.split('~');
                this.strDate = datearr[0];
                this.endDate = datearr[1];
            },*/
            onConfirmcy(value) {
                console.info(value);
                this.showcyPicker = false;
                this.shdata.sscy = value;

            },
            onConfirmfk(value){
                this.shdata.fklx = value;
                this.showfkPicker = false;
            },
            onbaddescConfirm(value){
                this.selectedItem.blhj = value.id;
                this.selectedItem.text = value.text;
                this.showbadPicker = false;
                this.baddesc = value;
            },
            blsl(val) {
                if(val.blsl > _.subtract(val.htsl, val.ddyths)){
                    this.$toast("已超出销售数量");
                    val.blsl = "";
                    return false
                }
            },
            detailsubmit(){//提交产业订单不良订单信息
                var r = true;
                this.orders.forEach(item=>{
                    if(!parseFloat(item.blsl) || item.blsl == undefined){
                        r = false;
                        this.$toast("请填写不良数量");
                        return false
                    }
                    if(item.blhj == undefined){
                        r = false;
                        this.$toast("请选择不良反馈");
                        return false
                    }
                    if(item.desc == undefined){
                        r = false;
                        this.$toast("请填写异常描述");
                        return false
                    }
                });
                if(!r)return false;
                this.orders.forEach(item=>{
                        item.wtms = item.desc || "";
                        item.htje=_.multiply(item.htsl,item.cpjj);
                        item.blje=_.multiply(item.cpjj,item.blsl);
                });
                this.shdata.cyInfo = this.orders = this.badorder;
                this.showcyInfo = false;
                if (this.badorder.length > 0)
                    this.line = true
                else
                    this.line = false
            },
            open(index,cy) {
                this.showcyInfo = true;
                this.arrflag = false;
                this.$refs.myswipe.swipeTo(index,cy);

            },
            close(index,cy) {
                //console.info(index)
                this.orders.splice(index,1);
            },
            orderchecked(data,order){
                console.info(data+","+order);
                var self = this;
                var flag = true;
                self.ischecked = self.orderList.length == self.orderList.filter(data => data.checked == true).length;
                self.shdata.cyInfo.forEach(function (o) {
                    if(o.htdh == data.sohnum && o.ddhh == data.soplin){
                        self.$toast("此订单已经添加了！");
                        flag = false;
                        return false
                    }
                });
                if(!flag){
                    data.checked = false;
                    return false;
                }
            },
            showbaddesc(item) {
                this.selectedItem = item;
                this.showbadPicker = true;
                this.$toast.loading({ forbidClick: true, duration: 0});
                httpKit.post("/afterSale/getFeedbackList").then(res=>{
                    this.$toast.clear();
                    this.baddesccolumns = res.data;
                    this.baddesccolumns = this.baddesccolumns.map(item=>{
                        return {
                            text:item.fkhjnr,
                            id:item.fkhj
                        }
                    })
                }).catch(err => {
                    this.$toast.clear();
                    this.$toast.fail({
                        message: err.message
                    });
                });
            },
            beforeRead(file) {
                console.info(file.type)
                if (file.type != 'image/jpeg' && file.type != 'image/png') {
                    this.$toast('请上传 jpg或png 格式图片');
                    return false;
                }
                return true;
            },
            onRead(file) {
                //return
                this.uploadImg(file)
            },
            uploadImg(file) {
                //let width = img.width;
                //let height = img.height;
                // 大于1.5MB的jpeg和png图片都缩小像素上传
                if(/\/(?:jpeg|png)/i.test(file.file.type)&&file.file.size>1500000) {
                    // 创建Canvas对象(画布)
                    let canvas =  document.createElement('canvas');
                    let context = canvas.getContext('2d');
                    let img = new Image();
                    img.src = file.content;
                    img.onload = () => {
                        // 指定canvas画布大小，该大小为最后生成图片的大小
                        canvas.width = 400
                        canvas.height = 300
                        /* drawImage画布绘制的方法。(0,0)表示以Canvas画布左上角为起点，400，300是将图片按给定的像素进行缩小。
                        如果不指定缩小的像素图片将以图片原始大小进行绘制，图片像素如果大于画布将会从左上角开始按画布大小部分绘制图片，最后的图片就是张局部图。*/
                        context.drawImage(img, 0, 0, 400, 300)
                        // 将绘制完成的图片重新转化为base64编码，file.file.type为图片类型，0.92为默认压缩质量
                        file.content = canvas.toDataURL(file.file.type, 0.92)
                        // 最后将base64编码的图片保存到数组中，留待上传。
                        if(this.imgBase64.length < 6) {
                            // this.imgBase64.push(file.content)
                            this.imgBase64.push(file.file)
                        }else{
                            alert("最多上传6张图片")
                        }
                    }
                }else{
                    // 不做处理的jpg和png以及gif直接保存到数组
                    if(this.imgBase64.length < 6) {
                        // this.imgBase64.push(file.content)
                        //this.fileList.push(file.file);
                        this.imgBase64.push(file.file)
                    }else{
                        this.$toast("最多上传6张图片")
                    }
                }
            },
            submit(){
                var self = this;
                if (!self.shdata.khmc){
                    self.$toast.fail('请填写正确的客户信息');
                    return;
                }
                if (self.badorder.length < 1) {
                    self.$toash.fail('请新增不良品明细');
                    return;
                }
                self.fileList = self.imgBase64.map(item =>{
                    return item.content
                });
                var data = {
                    cy:self.shdata.sscy.id,
                    sdrylx:self.type,
                    oaid:self.ywy.oaid,//oaid 5125
                    ygxm:self.ywy.ygxm,
                    ywy:self.ywy.ywy,
                    oadepid:self.ywy.oadepid,//oadepid 6882
                    tel:self.ywy.tel,//tel
                    khdm:self.shdata.khdm,
                    khmc:self.shdata.khmc,
                    lxr:self.shdata.khlxr,//lxr
                    lxdh:self.shdata.khtel,//lxdh
                    fklx:self.shdata.fklx.id,//0:产品质量，1:差错/缺货
                    blqkms:self.shdata.blqkms,
                    jhcpzje:_.sumBy(this.badorder,'blje'),//寄回产品总金额
                    mxs:this.badorder,
                };
                this.$toast.loading({ forbidClick: true, duration: 0});
                httpKit.post("/afterSale/saveAfterSale", {"content": JSON.stringify(data), "files": this.imgBase64}, httpKit.type.formData).then(res=>{
                    self.$toast.clear();
                    console.info(res);
                    self.$dialog.alert({
                        title: '提交成功',
                    }).then(() => {
                        // on close
                        window.location.href = "../gsaleservice/gserviceList.html";
                    });
                }).catch(err => {
                    self.$toast.clear();
                    self.$toast.fail({
                        message: err.message
                    });
                });
            }
        },
        created: function () {
            var self = this;
            self.$toast.loading({ forbidClick: true, duration: 0});
            httpKit.post("/afterSale/initYwy").then(res=>{
                self.$toast.clear();
                self.ywy = res.data;
            }).catch(err=>{
                self.$toast.clear();
                self.$toast.fail({
                    message: err.message
                });
            });
        },
        mounted(){
            var self = this;
/*            httpKit.post("/afterSale/bpcAndYwy").then(res=>{
                self.$toast.clear();
                self.shdata.khdm = res.data.khdm;
                self.shdata.khtel = res.data.lxdh;
                self.shdata.khmc = res.data.khmc;
                self.shdata.khlxr = res.data.lxr;
            }).catch(err => {
                self.$toast.clear();
                self.$toast.fail({
                    message: err.message
                });
            });*/
        }
    });

});
require(['httpKit','PullUpDown','backTop'], function (httpKit,PullUpDown,backTop) {
    new Vue({
        el: '#gnotice',
        components: {
            'pull-up-down':PullUpDown,
            'back-top':backTop
        },
        template: `<div>
                        <van-sticky>
                           <van-search v-model="title"  placeholder="请输入搜索关键词" @click="gsearchNotice"/>
                       </van-sticky>
                       <div class="van-top-tab">
                            <ul>
                                <li @click="showstatus">{{statusTxt ==''?'全部':statusTxt}}</li>
                            </ul>
                           <van-overlay v-show="showstatuspicker" :style="{top:'90px'}" @click="showstatuspicker = false">
                                <div class="wrapper">
                                    <div class="wrapper-body" style="height:132px;">
                                        <van-radio-group v-model="status">
                                              <van-cell-group>
                                                <van-cell v-for="(item,i) in statuscolumns" :title="item.text" clickable @click="confirmStatus(item)">
                                                  <template #right-icon>
                                                    <van-radio :name="item.id" />
                                                  </template>
                                                </van-cell>
                                              </van-cell-group>
                                            </van-radio-group>
                                    </div>
                                </div>
                            </van-overlay>
                        </div>
                        <div class="noticeContent">
                            <pull-up-down ref="pull" :pullDown="false" :currentPage="page" :count="count" :sum="sum" @nextPage="loaddata()">
                            <div v-if="datalist.length > 0">
                                <ul class="noticelist">
                                    <li @click="gnoticedetail(item)" v-for="item in datalist">
                                        <h3 v-if="item.userid==''" class="title_bold">{{item.title}}</h3>
                                        <h3 v-else class="title">{{item.title}}</h3>
                                        <div class="li-item">
                                        <div v-if="item.imgUrl==''"></div>
                                        <div v-else class="item-l"><img :src="item.imgUrl"></div>
                                        <div class="item-r">
                                            <div class="van-multi-ellipsis--l2">{{item.cleanContent}}</div>
                                            <time>{{item.createTime}}</time>
                                        </div>
                                    </div>
                                    </li>
                                </ul>
                            </div>
                            <van-empty v-else description="没有通知信息" />
                           </pull-up-down>
                        </div>
                    </div>
                    `,
        data() {
            return {
                title:'',
                page:1,
                limit:8,
                sum:0,
                count:0,
                showstatuspicker:false,
                status:'',
                statusTxt:'',
                xsgscolumns:[],
                statuscolumns:[
                    {
                        id:'',
                        text:'全部'
                    },
                    {
                        id:0,
                        text:'未读'
                    },
                    {
                        id:1,
                        text:'已读'
                    }
                ],
                datalist:[]
            };
        },
        methods: {
            gsearchNotice(){
                window.location.href='../gnotice/gsearchNotice.html'
            },
            showstatus(){
                this.showstatuspicker = !this.showstatuspicker
            },
            confirmStatus(item){
                this.status = item.id;
                this.statusTxt = item.text;
                this.showstatuspicker = false;
                this.page = 1;
                this.loaddata();
            },
            gnoticedetail(item){
                window.location.href='../gnotice/gnoticeDetail.html?noticeid='+item.noticeId
            },
            loaddata(){
                var self = this;
                var data = {
                    "limit":self.limit,
                    "page":self.page,
                    "title":self.title,
                    "read":self.status
                };
                self.$toast.loading({ forbidClick: true, duration: 0});
                httpKit.post("/hywork/home/notice/list",data,httpKit.type.form).then(res=>{
                    self.$toast.clear();
                    self.sum = res.data.count;
                    self.count = _.ceil(res.data.count / self.limit);
                    if(self.page == '1'){
                        self.datalist = res.data;
                    }else{
                        self.datalist = self.datalist.concat(res.data);
                    }
                    if(self.datalist.length > 0){
                        self.page++;
                    }else{
                        self.page = 0;
                    }
                    if (self.datalist && self.datalist.length > 0)
                        self.$refs['pull'].closePullDown();
                }).catch(err => {
                    self.$toast.clear();
                    self.$toast.fail({
                        message: err.message
                    });
                });
            },
        },
        computed: {

        },
        created(){

        },
        mounted(){
            this.$nextTick(function () {
                var self = this;
                self.loaddata();
            })
        }

    });
});
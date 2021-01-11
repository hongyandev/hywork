require(['httpKit','PullUpDown','backTop'], function (httpKit,PullUpDown,backTop) {
    new Vue({
        el: '#gsearchnotice',
        components: {
            'pull-up-down':PullUpDown,
            'back-top':backTop
        },
        template: `<div>
                       <van-search ref="searchInput" autofocus="true" v-model="title" placeholder="请输入搜索关键词" @input="loaddata(title)"/>
                        <div v-if="title != ''">
                             <pull-up-down ref="pull" :pullDown="false" :currentPage="page" :count="count" :sum="sum" @nextPage="loaddata()">
                            <div v-if="datalist.length > 0">
                               <ul class="noticelist">
                                    <li @click="gnoticedetail(item)" v-for="item in datalist">
                                        <h3 class="title">{{item.title}}</h3>
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
                        </div>
                        <van-empty v-else description="没有通知信息" />
                    </div>
                    `,
        data() {
            return {
                title:'',
                page:1,
                limit:8,
                sum:0,
                count:0,
                datalist:[]
            };
        },
        methods: {
            gnoticedetail(item){
                window.location.href='../gnotice/gnoticeDetail.html?noticeid='+item.noticeId
            },
            loaddata(title){
                var self = this;
                var data = {
                    "limit":self.limit,
                    "page":self.page,
                    "title":title,
                };
                self.$toast.loading({ forbidClick: true, duration: 0});
                httpKit.post("/hywork/home/notice/list",data, httpKit.type.form).then(res=>{
                    self.$toast.clear();
                    console.info(res);
                    self.sum = res.data.count;
                    self.count = _.ceil(res.data.count / self.limit);
                    if(self.page == '1'){
                        self.datalist = res.data;
                    }else{
                        self.datalist = self.datalist.concat(res.data)
                    }
                    if(self.datalist.length > 0){
                        self.page++;
                    }else{
                        self.page = 0
                    }
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
                this.$refs.searchInput.focus();
               /* var self = this;
                if(self.title!=''){
                    self.loaddata(self.title);
                }*/

            })
        }

    });
});
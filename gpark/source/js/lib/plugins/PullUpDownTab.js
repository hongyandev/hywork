define(function () {
    return Vue.extend({
        name: 'pull-up-down',
        props: { //总页数,当前页码
            count : Number,
            currentPage: Number,
            sum: Number,
            pullDown: {
                type: Boolean,
                default: true
            },
            zref: String
        },
        data: function() {
            return {
                oldScrollTop: 0, //上一次滚动的位置
                startY: 0, //上一次的触摸位置
                downFlag: false, //是否手势为下拉
                isDown: 0, //下拉状态标志
                loadMoreFlag: false, //上拉加载上锁
                hasRequest: false //执行过请求标识
            }
        },
        template: '  <div>\n' +
        '    <transition name="pull-down">\n' +
        '      <div class="pull-refresh" v-if="isDown>0">\n' +
        '        {{isDown==1?\'释放刷新...\':\'正在刷新...\'}}\n' +
        '      </div>\n' +
        '    </transition>\n' +
        '    <slot></slot>\n' +
        '    <div class="pull-bottom" v-if="currentPage>count">已全部加载</div>\n' +
        '    <div class="pull-bottom" v-if="currentPage<=count&&loadMoreFlag">正在加载</div>\n' +
        '  </div>',
        methods: {
            //监听滚动到底部事件
            inBottom: function () {
                var self = this;
                // 获取页面页面的滚动高度
                var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
                // 获取页面滚动距离顶部的高度,  window.pageYOffse 兼容苹果
                var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
                var delta = scrollTop - self.oldScrollTop;
                self.oldScrollTop = scrollTop;
                // 获取页面的可视高度
                var clientHeight = document.documentElement.clientHeight || document.body.clientHeight

                if (scrollTop + clientHeight >= scrollHeight - 40) {
                    // 距离底部还有40的时候执行数据加载
                    if (delta > 0) {
                        //表示向上滑动
                        self.downFlag = false;
                        //当前页不是最后一页
                        if (self.currentPage <= self.count && !self.loadMoreFlag) {
                            //上锁
                            self.loadMoreFlag = true;
                            self.$emit("nextPage");
                        }
                    }
                }
            },
            //下拉刷新监听
            bindRefresh: function () {
                var self = this;
                var parent = document.querySelector(self.zref);
                parent.addEventListener('touchstart', function(e) {
                    self.startY = e.touches[0].pageY;
                });
                parent.addEventListener('touchmove', function(e) {
                    if (self.isTop() && (e.touches[0].pageY - self.startY) > 0) {
                        //显示释放刷新...
                        self.downFlag = true;
                        self.isDown = 1;
                    }
                });

                var Terminal = {
                    // 辨别移动终端类型
                    platform : (function(){
                        var u = navigator.userAgent;
                        return {
                            // android终端或者uc浏览器
                            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
                            // 是否为iPhone或者QQHD浏览器
                            iPhone: u.indexOf('iPhone') > -1 ,
                            // 是否iPad
                            iPad: u.indexOf('iPad') > -1 ,
                            // 是否是通过微信的扫一扫打开的
                            weChat: u.indexOf('MicroMessenger') > -1
                        };
                    }()),
                    // 辨别移动终端的语言：zh-cn、en-us、ko-kr、ja-jp...
                    language : (navigator.browserLanguage || navigator.language).toLowerCase()
                }

                if (Terminal.platform.android) {
                    /*适配安卓*/
                    parent.addEventListener('touchcancel', function(e) {
                        if (self.downFlag) {
                            //显示正在刷新...
                            self.startY = 0;
                            self.isDown = 2;
                            self.downFlag = false;
                            self.$emit("doRefresh");
                        }
                    });
                } else if (Terminal.platform.iPhone || Terminal.platform.iPad) {
                    /*适配苹果*/
                    parent.addEventListener('touchend', function(e) {
                        if (self.downFlag) {
                            //显示正在刷新...
                            self.startY = 0;
                            self.isDown = 2;
                            self.downFlag = false;
                            self.$emit("doRefresh");
                        }
                    });
                }
            },
            //是否在顶部
            isTop: function () {
                var t = document.documentElement.scrollTop || document.body.scrollTop;
                return t === 0;
            },
            //关闭下拉 / 关闭上拉加载锁
            closePullDown: function () {
                var self = this;
                self.isDown = 0;
                self.loadMoreFlag = false;
                //执行过网络请求
                self.hasRequest = true;
            }
        },
        mounted: function() {
            var self = this;
            //下拉刷新监听
            if (self.pullDown)
                self.bindRefresh();
        },
        created: function() {
            var self = this;
            // 滚动监听
            window.addEventListener('scroll', self.inBottom, true)
        }
    });
})
define(function () {
    return Vue.extend({
        name: 'bk-top',
        data: function() {
            return {
                isShow: false
            }
        },
        template: '<div>' +
                  '  <transition name="slide-fade">' +
                  '    <div class="page-component-up" v-if="isShow" @click="bkTop">' +
                  '    </div>' +
                  '  </transition>'+
                  '</div>',
        methods: {

            showIcon(){
                if (document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop > 200) {
                    this.isShow = true
                } else if (document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop < 200) {
                    this.isShow = false
                }
            },
            bkTop(){
                let timer = setInterval(() => {
                    let top = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                    let speed = Math.floor(top / 5);
                    document.documentElement.scrollTop = top - speed;
                    window.pageYOffset = top - speed;
                    document.body.scrollTop = top - speed;
                    console.info(top);
                    if (speed === 0) {
                        document.body.scrollTop = 0;
                        window.pageYOffset = 0;
                        document.documentElement.scrollTop = 0;
                        clearInterval(timer)
                    }
                }, 20)
            }
        },
        mounted: function() {
            window.addEventListener('scroll', this.showIcon)
        },
        beforeDestroy () {
            window.removeEventListener('scroll', this.showIcon)
        }
    });
})
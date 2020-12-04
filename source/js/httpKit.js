define(['axios', 'qs', 'lodash'], function (axios, Qs, _) {

    var type = {
        // application/json
        json: 'application/json;charset=UTF-8',
        // application/x-www-form-urlencoded
        form: 'application/x-www-form-urlencoded',
        // multipart/form-data
        formData: 'multipart/form-data'
    }

    var instance = axios.create({
        baseURL: "http://dev.sge.cn/rest" //"http://dev.sge.cn/rest" //"http:172.60.15.201:8080" //"http://dev.sge.cn/rest"       //"http://172.60.15.201:9666" //"http://172.30.8.90:9666"
    });


    instance.interceptors.request.use(config=>{
        var getToken = new Promise(function (resolve, reject) {
            bridge.getToken(token => {
                config.headers.Authorization = token;
                resolve(config);
            });
        });
        return getToken;

       // return config;
/*        if (token) {
            config.headers.Authorization = token;
        }
        return config;*/
    },error=> {
        return Promise.reject(error);
    });

    instance.interceptors.response.use(res=>{
        if(res.data.code != 200){
            return Promise.reject(res);
        }else{
            return Promise.resolve(res);
        }
    },error=>{
        if (!error.response) {
            error.response = {"data":{"code":500,"data":"","exceptionClazz":"","success":false, "message":"网络请求出错"}};
        }
        if (error.response.status) {
            switch (error.response.status) {
                case 401: { // 账号密码错误，账号被冻结，token过期等
                    return new Promise(function (resolve, reject) {
                        bridge.goLogin(function () {
                            reject(error.response);
                        });
                    });
                }
            }
        }
        return Promise.reject(error.response);
    });

    var get = function (url, params) {
        return new Promise((resolve, reject) => {
            instance.get(url, {
                params: params
            }).then(res => {
                resolve(res.data);
            }).catch(err => {
                reject(err.data);
            });
        });
    }

    var post = function (url, params, tp) {
        var request = {};
        switch (tp) {
            case type.form : {
                request = Qs.stringify(params);
                break;
            }
            case type.formData : {
                var formdata = new FormData();
                if (typeof params === "object") {
                    for (var key in params) {
                        if (typeof key === "function")
                            continue;
                        if (params[key] instanceof Array) {
                            for (var obj in params[key]) {
                                formdata.append(key, params[key][obj]);
                            }
                        } else {
                            formdata.append(key, params[key]);
                        }
                    }
                }
                request = formdata;
                break;
            }
            case type.json : {
                request = params;
                break;
            }
            default: {
                request = params;
                break;
            }
        }
        return new Promise((resolve, reject) => {
            instance.post(url, request).then(res => {
                resolve(res.data);
            }).catch(err => {
                reject(err.data);
            });
        });
    }

    /*var get = function (url, params) {
        return getToken().then(token => {
            return new Promise((resolve, reject) => {
                instance.get(url, {
                    params: params
                },{
                    headers:{
                        token: token
                    }
                }).then(res => {
                    resolve(res.data);
                }).catch(err => {
                    reject(err.data);
                });
            });
        });
    }*/

    /*var post = function (url, params, tp) {
        var request = {};
        switch (tp) {
            case type.form : {
                request = Qs.stringify(params);
                break;
            }
            case type.formData : {
                var formdata = new FormData();
                if (typeof params === "object") {
                    for (var key in params) {
                        if (typeof key === "function")
                            continue;
                        formdata.append(key, params[key]);
                    }
                }
                request = formdata;
                break;
            }
            case type.json : {
                request = params;
                break;
            }
            default: {
                request = params;
                break;
            }
        }
        return getToken().then(token => {
            return new Promise((resolve, reject) => {
                instance.post(url, request, {
                    headers:{
                        token: token
                    }
                }).then(res => {
                    resolve(res.data);
                }).catch(err => {
                    reject(err.data);
                });
            });
        });
    }*/

    var urlParams = function () {
        var url = decodeURI(window.location.href);
        var res = {}
        var url_data = _.split(url, '?').length > 1 ? _.split(url, '?')[1] : null ;
        if (!url_data) return null
        var params_arr = _.split(url_data, '&')
        _.forEach(params_arr, function(item) {
            var key = _.split(item, '=')[0]
            var value = _.split(item, '=')[1]
            res[key] = value
        });
        return res;
    }

   var getQuarterStartMonth = function (){
        var quarterStartMonth = 0;
        var nowMonth = new Date().getMonth();
        if(nowMonth<3){
            quarterStartMonth = 1;
        }
        if(2<nowMonth && nowMonth<6){
            quarterStartMonth = 2;
        }
        if(5<nowMonth && nowMonth<9){
            quarterStartMonth = 3;
        }
        if(nowMonth>8){
            quarterStartMonth = 4;
        }
        return quarterStartMonth;
    }

    return {
        type,
        get,
        post,
        urlParams,
        getQuarterStartMonth
    }
});

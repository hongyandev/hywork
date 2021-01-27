define(function () {
    require.config({
        baseUrl: "../source/js",
        paths: {
            "axios":"lib/axios",
            "qs":"lib/qs.min",
            "bridge":"webJsBridge",
            "lodash": "lib/lodash.min",
            "echarts": "lib/plugins/echarts/echarts.min",
            "westeros":"lib/plugins/echarts/westeros",
            "httpKit": "httpKit",
        }
    });
    require(["bridge"], function() {
        require(["../../gmeeting/js/gmeeting"])
    })

})
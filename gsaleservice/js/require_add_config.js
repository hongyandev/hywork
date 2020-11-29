define(function () {
    require.config({
        baseUrl: "../source/js",
        paths: {
            "axios":"lib/axios",
            "qs":"lib/qs.min",
            "bridge":"webJsBridge",
            "lodash": "lib/lodash.min",
            "httpKit": "httpKit",
            "PullUpDown": "lib/plugins/PullUpDown"
        }
    });
    require(["bridge"], function() {
        require(["../../gsaleservice/js/gserviceAdd"])
    })
})
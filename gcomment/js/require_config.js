define(function () {
    require.config({
        baseUrl: "../source/js",
        paths: {
            "axios": "lib/axios",
            "qs": "lib/qs.min",
            "bridge": "webJsBridge",
            "lodash": "lib/lodash.min",
            "httpKit": "httpKit"
        }
    });
    require(["bridge"], function() {
        require(["../../gcomment/js/gcomment"])
    })
})
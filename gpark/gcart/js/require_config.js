define(function () {
    require.config({
        baseUrl: "../source/js",
        paths: {
            "axios":"lib/axios",
            "qs":"lib/qs.min",
            "lodash": "lib/lodash.min",
            "bridge":"webJsBridge",
            "httpKit": "httpKit",
        }
    });
    require(["bridge"], function() {
        require(["../../gcart/js/gcart"])
    })

})
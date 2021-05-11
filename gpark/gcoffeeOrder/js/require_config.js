define(function () {
    require.config({
        baseUrl: "../source/js",
        paths: {
            "qs":"lib/qs.min",
            "lodash": "lib/lodash.min",
            "httpKit": "httpKit",
            "PullUpDown": "lib/plugins/PullUpDown"
        }
    });
    require(['lodash'],function() {
        require(["../../gtabs/js/gtabs"])
    })
})
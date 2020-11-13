//
//  NativeJsBridge
//
//  Version: V1.0.0
//
//  Copyright (c) 2018年 HonYar. All rights reserved.
//
function connectWebViewJavascriptBridge(callback) {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; // android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端

    // Android
    if (isAndroid) {
        if (window.WebViewJavascriptBridge) {
            callback(WebViewJavascriptBridge);
        } else {
            document.addEventListener(
                "WebViewJavascriptBridgeReady",
                function () {
                    callback(WebViewJavascriptBridge);
                },
                false
            );
        }
    }

    // iOS
    if (isiOS) {
        if (window.WebViewJavascriptBridge) {
            return callback(WebViewJavascriptBridge);
        }

        if (window.WVJBCallbacks) {
            return window.WVJBCallbacks.push(callback);
        }

        window.WVJBCallbacks = [callback];
        var WVJBIframe = document.createElement("iframe");
        WVJBIframe.style.display = "none";
        WVJBIframe.src = "wvjbscheme://__BRIDGE_LOADED__";
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function () {
            document.documentElement.removeChild(WVJBIframe);
        }, 0);
    }
}

// 调试log信息输出控制
// 0x00-disable, 0x1X-native, 0x2X-web
// 0xX1-error, 0xX2-warn, 0xX4-debug, 0xX8-info, 0xXF-all
var wvjbEnableNativeLog = 0x1f;
var wbjsBridge = wbjsBridge || {};
(function (wbjsBridge) {
    if (wbjsBridge.method) {
        console.warn("wbjsBridge.method is already defined.");
        return;
    }

    wbjsBridge.method = wbjsBridge.method || {};
    connectWebViewJavascriptBridge(function (bridge) {
        //js判断手机操作系统(ios或者是Android)
        var u = navigator.userAgent, app = navigator.appVersion;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isAndroid) {
            //安卓，初始化jsBridge
            bridge.init(function (message, responseCallback) {
                console.log('JS got a message', message);
                var data = {
                    'Javascript Responds': '测试中文!'
                };
                console.log('JS responding with', data);
                responseCallback(data);
            });
        }

        /**
         * 数据上报接口
         *
         */
        bridge.registerHandler("uploadData", function (data, responseCallback) {
            if (typeof procUploadData == "function") {
                console.info("uploadData got response: ", data);
                procUploadData(data);
                responseCallback('{"errCode": 0}');
            } else {
                // 不存在或不是function
                console.error("procUploadData function not found.");
                responseCallback('{"errCode": -1}');
            }
        });

        wbjsBridge.method.bridge = bridge;
    });
})(wbjsBridge);

//****************************************************************************//
//                                  工具类接口
//****************************************************************************//

/**
 * 从 H5 返回 Native
 *
 * @note
 *     一般在 H5 页面全屏带导航栏时使用.
 */
wbjsBridge.method.returnBack = function () {
    wbjsBridge.method.bridge.callHandler("returnBack", "", function (response) {
        console.info("returnBack got response: ", response);
    });
};

/**
 * 获取 token
 *
 * @param funcCallback
 */
wbjsBridge.method.getToken = function (funcCallback) {
    //funcCallback("eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzNTgiLCJleHAiOjE2MDQ0NTE3NDcsInVzZXJJZCI6MzU4LCJpYXQiOjE2MDQzNjUzNDcsImFjY291bnQiOiIzMjExMDAxNyxhZG1pbiIsInVzZXJLZXkiOiJ4eHh4In0.TEvCWpy_8keEK-_87dXMybp7godXrFeGZ7i1JDTZjc4wHnzvbojeGsHqujLK7WKFkJKNgOgLXco8uj7q9zf5zw");
    /*wbjsBridge.method.bridge.callHandler("getToken", {}, function (response) {
        console.info("getToken got response: ", response);

        if (typeof funcCallback == "function") {
            funcCallback(response);
        }
    });*/
}

wbjsBridge.method.scanQRCode = function (funCallback) {
    wbjsBridge.method.bridge.callHandler("scanQRCode", {}, function (response) {
        console.info("call scanQRCode: ", response);
    });
}

/**
 * 跳转 login 页面
 */
wbjsBridge.method.goLogin = function () {
    wbjsBridge.method.bridge.callHandler("goLogin", {}, function (response) {
        console.log("token expire: ", response);
    });
}

/**
 * 设置标题
 *
 * @param params
 */
wbjsBridge.method.refreshCart = function () {
    wbjsBridge.method.bridge.callHandler("refreshCart", {}, function (response) {
        console.log("refreshCart ... ");
    });
}

wbjsBridge.method.getQRCode = function (funCallback) {
    wbjsBridge.method.bridge.registerHandler("getQRCode", function(data) {
        if (typeof funCallback == "function") {
            var u = navigator.userAgent;
            var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; // android终端
            if (isAndroid) {
                funCallback(JSON.parse(data));
            } else {
                funCallback(data);
            }
        }
    });
}

//****************************************************************************//

function obj2string(o) {
    var r = [];
    if (typeof o == "string") {
        return (
            '"' +
            o
                .replace(/([\'\"\\])/g, "\\$1")
                .replace(/(\n)/g, "\\n")
                .replace(/(\r)/g, "\\r")
                .replace(/(\t)/g, "\\t") +
            '"'
        );
    }

    if (typeof o == "object") {
        if (!o.sort) {
            for (var i in o) {
                r.push(i + ":" + obj2string(o[i]));
            }

            if (
                !!document.all &&
                !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(
                    o.toString
                )
            ) {
                r.push("toString:" + o.toString.toString());
            }

            r = "{" + r.join() + "}";
        } else {
            for (var i = 0; i < o.length; i++) {
                r.push(obj2string(o[i]));
            }

            r = "[" + r.join() + "]";
        }

        return r;
    }

    return o.toString();
}

(function (window, undefined) {
/*    if (0 !== (wvjbEnableNativeLog & 0x1f)) {
        var uniqueId = 1;

        console = new Object();
        console.log = function () {
            var logString = "";
            for (var i = 0; i < arguments.length; i++) {
                if (typeof arguments[i] == "object") {
                    logString += obj2string(arguments[i]);
                } else {
                    logString += arguments[i];
                }
            }

            if (wvjbEnableNativeLog & 0x10) {
                var iframe = document.createElement("IFRAME");
                iframe.setAttribute("src", "wvjblog:#JSBRIDGE#" + logString);
                document.documentElement.appendChild(iframe);
                iframe.parentNode.removeChild(iframe);
                iframe = null;
            } else if (wvjbEnableNativeLog & 0x20) {
                var logEle = document.getElementById("log");
                if (logEle) {
                    var el = document.createElement("div");
                    el.className = "logLine";
                    el.innerHTML = "(" + uniqueId++ + "). " + logString + "<br/><hr>";

                    if (logEle.children.length) {
                        logEle.insertBefore(el, logEle.children[0]);
                    } else {
                        logEle.appendChild(el);
                    }
                }
            }
        };

        console.info = function () {
            if (wvjbEnableNativeLog & 0x08) {
                console.log.apply(this, arguments);
            }
        };

        console.debug = function () {
            if (wvjbEnableNativeLog & 0x04) {
                console.log.apply(this, arguments);
            }
        };

        console.warn = function () {
            if (wvjbEnableNativeLog & 0x02) {
                console.log.apply(this, arguments);
            }
        };

        console.error = function () {
            if (wvjbEnableNativeLog & 0x01) {
                console.log.apply(this, arguments);
            }
        };

        console.trace = function () {
            if (wvjbEnableNativeLog & 0x10) {
                console.log.apply(this, arguments);
            }
        };
    }*/

    bridge = wbjsBridge.method;
})(window);

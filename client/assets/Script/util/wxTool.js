const wxTool = function () {
    let that = {};
    that.wxLoginNative = function (cb) {
        wx.login({
            success: function (res) {
                console.log("日志：res=" + JSON.stringify(res));
                //获取用户权限
                wx.getUserInfo({
                    fail: function (res) {
                        // iOS 和 Android 对于拒绝授权的回调 errMsg 没有统一，需要做一下兼容处理
                        if (res.errMsg.indexOf('auth deny') > -1 || res.errMsg.indexOf('auth denied') > -1) {
                            // 处理用户拒绝授权的情况
                        }
                    },
                    success: function (res) {
                        console.log("日志：getUserInfo的回调=" + JSON.stringify(res));
                        cb(res);
                    }
                })
            }
        })
    };
    return that;
};
export default wxTool;
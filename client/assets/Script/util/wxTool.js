import global from "../data/global";

const wxTool = function () {
    let that = {};
    that.wxLoginNative =  function (cb) {
        wx.login({
            success: function (data) {
                console.log("日志：res=" + JSON.stringify(data));
                cb(data);
            },
            fail:function () {
                console.log("日志：登录失败！")
            }
        })
    };


    that.getEncryptedData=function (cb) {
        // 获取用户权限
        wx.getUserInfo({
            withCredentials:true,
            lang:"zh_CN",
            fail: function (res) {
                // iOS 和 Android 对于拒绝授权的回调 errMsg 没有统一，需要做一下兼容处理
                if (res.errMsg.indexOf('auth deny') > -1 || res.errMsg.indexOf('auth denied') > -1) {
                    // 处理用户拒绝授权的情况
                }
            },
            success: function (res) {
                console.log("日志：getUserInfo的回调=" + JSON.stringify(res));
                // res.uid=global.uid;
                cb(res);
            }
        })
    }

    return that;
};
export default wxTool;
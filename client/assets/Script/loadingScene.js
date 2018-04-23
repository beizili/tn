import myPomelo from './util/myPomelo';
import wxTool from './util/wxTool';
import global from './data/global'


cc.Class({
    extends: cc.Component,

    properties: {},
    onLoad() {
        wxTool().wxLoginNative(function (wxLoginRes) {
            myPomelo().init(function () {
                myPomelo().request(
                    "connector.entryHandler.login",
                    wxLoginRes,
                    function (pomeloRes) {
                        console.log("日志：pomelo返回的数据=" + JSON.stringify(pomeloRes));
                        if (pomeloRes.error) {
                            console.log("日志：err:+" + JSON.stringify(pomeloRes.error));
                            return;
                        } else {
                            // global.uid = pomeloRes.uid;//将uid保存到静态的global中
                            wxTool().getEncryptedData(function (encryptedDataRes) {
                                myPomelo().request("chat.chatHandler.login",
                                    encryptedDataRes,
                                    function (pomeloRes) {
                                        console.log("日志：pomeloRes=" + JSON.stringify(pomeloRes));
                                    })
                            })
                        }
                    });
            });
        });
    },
});

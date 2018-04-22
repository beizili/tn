import myPomelo from './util/myPomelo';
import wxTool from './util/wxTool';

cc.Class({
    extends: cc.Component,

    properties: {},
    onLoad() {
        wxTool().wxLoginNative(function (wxRes) {
            myPomelo().init(function () {
                myPomelo().request(
                    "connector.entryHandler.login",
                    wxRes,
                    function (pomeloRes) {
                        console.log("日志：pomelo返回的数据=" + JSON.stringify(pomeloRes));
                        pomelo.disconnect();
                    });
            });
        });
    },
});

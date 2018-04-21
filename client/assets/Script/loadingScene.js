import initPomelo from './util/initPomelo';
import wxTool from './util/wxTool';

cc.Class({
    extends: cc.Component,

    properties: {},
    onLoad() {
        wxTool().wxLoginNative(function (wxRes) {
            initPomelo().httpRequest(
                "connector.entryHandler.login",
                wxRes,
                function (pomeloRes) {
                    console.log("日志：pomelo返回的数据=" + JSON.stringify(pomeloRes));
                    pomelo.disconnect();
                });
        });
    },
});

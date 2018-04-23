var chatRemote = require('../remote/chatRemote');

module.exports = function (app) {
    return new Handler(app);
};

var Handler = function (app) {
    this.app = app;
};

var handler = Handler.prototype;

/**
 * Send messages to users
 *
 * @param {Object} msg message from client
 * @param {Object} session
 * @param  {Function} next next stemp callback
 *
 */
handler.send = function (msg, session, next) {
    var rid = session.get('rid');
    var username = session.uid.split('*')[0];
    var channelService = this.app.get('channelService');
    var param = {
        msg: msg.content,
        from: username,
        target: msg.target
    };
    channel = channelService.getChannel(rid, false);

    //the target is all users
    if (msg.target == '*') {
        channel.pushMessage('onChat', param);
    }
    //the target is specific user
    else {
        var tuid = msg.target + '*' + rid;
        var tsid = channel.getMember(tuid)['sid'];
        channelService.pushMessageByUids('onChat', param, [{
            uid: tuid,
            sid: tsid
        }]);
    }
    next(null, {
        route: msg.route
    });
};


handler.login = function (msg, session, cb) {
    console.log("日志：访问chat.login");
    var global = require('../../../data/global');
    var WXBizDataCrypt = require('../../../util/WXBizDataCrypt');
    var sessionkey = session.get("sessionkey");
    var openid = session.uid;
    console.log("日志：openin="+openid);

    var pc = new WXBizDataCrypt(global.appId, sessionkey);
    var decoded = pc.decryptData(msg.encryptedData, msg.iv);
    console.log("日志：解密后的数据" + JSON.stringify(decoded));
    cb(null);
}
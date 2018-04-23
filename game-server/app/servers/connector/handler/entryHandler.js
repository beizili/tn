var Global = require('../../../data/global');

module.exports = function (app) {
    return new Handler(app);
};

var Handler = function (app) {
    this.app = app;
};

var handler = Handler.prototype;

/**
 * New client entry chat server.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback//客户端的回调函数
 * @return {Void}
 */
//connector接受用户的连接，完成用户的注册及绑定，维护客户端session信息，处理客户端的断开连接
handler.enter = function (msg, session, next) {
    console.log('调试');
    var self = this;
    console.log('调试2')
    var rid = msg.rid;//房间频道
    var uid = msg.username + '*' + rid
    var sessionService = self.app.get('sessionService');

    //查看用户是否已经处于连接状态，如果true，则返回错误代码
    if (!!sessionService.getByUid(uid)) {//!!一般用来将后面的表达式强制转换为布尔类型的数据（boolean），也就是只能是true或者false;
        next(null, {
            code: 500,
            error: true
        });
        return;
    }

    session.bind(uid);
    session.set('rid', rid);
    session.push('rid', function (err) {
        if (err) {
            console.error('set rid for session service failed! error is : %j', err.stack);
        }
    });
    session.on('closed', onUserLeave.bind(null, self.app));

    //put user into channel调用chat目录下chatRemote中的add方法将用户添加到频道中
    self.app.rpc.chat.chatRemote.add(session, uid, self.app.get('serverId'), rid, true, function (users) {
        next(null, {
            users: users
        });
    });
};

handler.login = function (msg, session, cb) {
    console.log("日志：接收到的客户端消息" + JSON.stringify(msg));
    var request = require('request');

    var url = "https://api.weixin.qq.com/sns/jscode2session?appid=" + Global.appId +
        "&secret=" + Global.appSecret +
        "&js_code=" + msg.code + "&" +
        "grant_type=authorization_code"

    //console.log("url:" + url);

    request.get(url, function (error, response, body) {
            console.log("日志：error" + JSON.stringify(error));
            console.log("日志：response" + JSON.stringify(response));
            console.log("日志：body" + body);
            body = JSON.parse(body);
            var openid = body.openid;
            var sessionKey = body.session_key;


            session.bind(body.openid);
            session.set("sessionkey", sessionKey);
            session.push('sessionkey', function (err) {
                if (err) {
                    console.error('set sessionkey for session service failed! error is : %j', err.stack);
                }
            });
            cb(null);
        }
    );
    //-----------------------------------------------------------------------------------

};


/**
 * User log out handler用户注销处理程序
 *
 * @param {Object} app current application
 * @param {Object} session current session object
 *
 */
var onUserLeave = function (app, session) {
    if (!session || !session.uid) {
        return;
    }
    app.rpc.chat.chatRemote.kick(session, session.uid, app.get('serverId'), session.get('rid'), null);
};
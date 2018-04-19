module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
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
handler.enter = function(msg, session, next) {
	console.log('调试');
	var self = this;
	console.log('调试2')
	var rid = msg.rid;//房间频道
	var uid = msg.username + '*' + rid
	var sessionService = self.app.get('sessionService');

	//duplicate log in判断sessionService.getByUid(uid)方法所得的值是不是undefined，如果不是，继续执行
	if( !! sessionService.getByUid(uid)) {//!!一般用来将后面的表达式强制转换为布尔类型的数据（boolean），也就是只能是true或者false;
		next(null, {
			code: 500,
			error: true
		});
		return;
	}

	session.bind(uid);
	session.set('rid', rid);
	session.push('rid', function(err) {
		if(err) {
			console.error('set rid for session service failed! error is : %j', err.stack);
		}
	});
	session.on('closed', onUserLeave.bind(null, self.app));

	//put user into channel调用chat目录下chatRemote中的add方法将用户添加到频道中
	self.app.rpc.chat.chatRemote.add(session, uid, self.app.get('serverId'), rid, true, function(users){
		next(null, {
			users:users
		});
	});
};

/**
 * User log out handler用户注销处理程序
 *
 * @param {Object} app current application
 * @param {Object} session current session object
 *
 */
var onUserLeave = function(app, session) {
	if(!session || !session.uid) {
		return;
	}
	app.rpc.chat.chatRemote.kick(session, session.uid, app.get('serverId'), session.get('rid'), null);
};
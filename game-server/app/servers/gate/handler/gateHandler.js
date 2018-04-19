module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
};

var handler = Handler.prototype;

/**
 * Gate handler that dispatch user to connectors.
 * Gate将用户分配到connectors
 *
 * @param {Object} msg message from client
 * @param {Object} session
 * @param {Function} next next stemp callback
 *
 */
//msg是从客户端接收的消息对象；session是当前玩家的会话对象；next是接下去的流程的回调函数。
handler.queryEntry = function(msg, session, next) {
	var uid = msg.uid;
	if(!uid) {
		next(null, {
			code: 500
		});
		return;
	}
	// get all connectors
	var connectors = this.app.getServersByType('connector');
	//如果发现没有connector，那么返回错误代码500，服务器出错
	if(!connectors || connectors.length === 0) {
		next(null, {
			code: 500
		});
		return;
	}
	// here we just start `ONE` connector server, so we return the connectors[0] 
	var res = connectors[0];
	next(null, {
		code: 200,
		host: res.host,
		port: res.clientPort
	});
};

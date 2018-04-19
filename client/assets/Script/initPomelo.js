const initPomelo = function () {
    let that= {};
    let serverIP = "127.0.0.1";
    let serverPort = 3014;
    let username = "syp";
    let rid = "1";

    that.connectService = function () {
        queryEntry(username, function (host, port) {//queryEntry的回调函数
            console.log('访问connector时的host=' + host + ',port=' + port);
            //对pomelo初始化后，并向connector发起请求获取connector长连接进程
            pomelo.init({
                host: host,
                port: port,
                log: true
            }, function () {//pomelo.init的回调函数
                console.log('pomelo二次初始化回调函数')
                var route = "connector.entryHandler.enter";
                // 客户端在查询到connector后，需要发请求给connector服务器， 第一次请求要给connector进程，
                // 因为首次进入时需要绑定对应的uid信息
                pomelo.request(route, {
                    username: username,
                    rid: rid
                }, function (data) {//pomelo.request的回调函数，此时的data是服务器发来的
                    //通讯方法的回调函数是阻塞的，直到收到通讯消息才会继续执行，此处也体现了JavaScript的全栈特性
                    console.log('connector的回调函数：'+data.error);
                    if (data.error) {
                        cc.log('连接connector失败');
                        return;
                    }
                });
            });
        });
    };
// query connector客户端首先要向gate服务器查询一个connector服务器，gate给其回复一个connector的地址及端口号
    const queryEntry = function (uid, callback) {
        var route = 'gate.gateHandler.queryEntry';//路由地址
        console.log('访问gate时的端口号=3014');
        //对pomelo初始化后，并向gate发起一次性请求（短连接）获取connector的地址及端口号
        pomelo.init({
            host: serverIP,
            port: serverPort,
            log: true
        }, function () {//function是属于回调函数，即pomelo初始化后所执行的动作
            //发起请求，用于获取用于连接的connector服务器的地址
            pomelo.request(route, {
                uid: uid
            }, function (data) {//data是服务器发来的消息，data里带的是connector服务器的地址
                pomelo.disconnect();//关闭连接
                if (data.code === 500) {
                    cc.log('连接gate错误');
                    return;
                }
                //执行调用者的函数
                callback(data.host, data.port);
            });
        });
    };
return that;//切记 不可少
};
export default initPomelo;
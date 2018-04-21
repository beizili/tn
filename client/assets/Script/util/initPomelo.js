import global from './../data/global'

const initPomelo = function () {
    let that = {};

    that.httpRequest = function (route, msg,cb) {
        //console.log('访问connector时的host=' + host + ',port=' + port);
        //对pomelo初始化后，并向connector发起请求获取connector长连接进程
        pomelo.init({
            host: global.serverHost,
            port: global.serverPort,
            log: true
        }, function () {//pomelo.init的回调函数
            //var route = "connector.entryHandler.enter";
            // 客户端在查询到connector后，需要发请求给connector服务器， 第一次请求要给connector进程，
            // 因为首次进入时需要绑定对应的uid信息
            pomelo.request(route, msg, function (data) {//pomelo.request的回调函数，此时的data是服务器发来的
                //通讯方法的回调函数是阻塞的，直到收到通讯消息才会继续执行，此处也体现了JavaScript的全栈特性
                console.log('connector的回调函数：' + JSON.stringify(data));
                if (data.error) {
                    cc.log('连接connector失败');
                    return;
                }
                // cc.log("执行回调函数")
                cb(data);
               pomelo.disconnect();//关闭连接
            });
        });
    };

    pomelo.on('disconnect', function(reason) {
        console.log("日志：断开pomelo连接");
    });

    return that;//切记 不可少
};
export default initPomelo;
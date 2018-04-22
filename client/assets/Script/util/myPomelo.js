import global from './../data/global'

const myPomelo = function () {
    let that = {};


    that.init = function (cb) {
        console.log("pomelo初始化前")
        pomelo.init({
            host: global.serverHost,
            port: global.serverPort,
            log: true
        }, cb);
    };

    that.request = function (route, msg, cb) {
        console.log("pomelo的request请求")
        pomelo.request(route, msg, function (data) {//pomelo.request的回调函数，此时的data是服务器发来的
            //通讯方法的回调函数是阻塞的，直到收到通讯消息才会继续执行，此处也体现了JavaScript的全栈特性
            console.log('connector的回调函数：' + JSON.stringify(data));
            if (data.error) {
                cc.log('连接connector失败');
                return;
            }
            // cc.log("执行回调函数")
            cb(data);
        });
    };


    pomelo.on('disconnect', function (reason) {
        console.log("日志：断开pomelo连接");
    });

    return that;//切记 不可少
};
export default myPomelo;
/*app.js文件是Pomelo应用的入口点。在这个文件中，首先需要使用pomelo.createApp()方法来创建一个应用类（Application）的实列
然后就可以通过这个app配置和使用框架。开发人员可以设置全局变量、加载一些配置等，并应用到上下文中，还可以对应用做一些其
它初始化和配置操作。配置完成后，可以调用app.start()来启动应用。*/
var pomelo = require('pomelo');
/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'taoniu');

// app configuration
/*
app.configure([env], [serverType], [function]);
其中env和serverType参数是可选的。各参数说明如下：
env - 运行时环境。可以设置为development、production或development|production
serverType - 目标服务器类型。如果将其设置为T，那么仅会为类型为T的服务器应用配置逻辑；如果忽略本参数，则对所有服务器生效
function - 必须，用于设置服务器的配置逻辑*/
app.configure('production|development', 'connector', function(){
	app.set('connectorConfig',
		{
			connector : pomelo.connectors.hybridconnector,
			heartbeat : 3,
		});
});

app.configure('production|development', 'gate', function(){
	app.set('connectorConfig',
		{
			connector : pomelo.connectors.hybridconnector,
			useProtobuf : true
		});
});

// start app
app.start();

process.on('uncaughtException', function(err) {
	console.error(' Caught exception: ' + err.stack);
});

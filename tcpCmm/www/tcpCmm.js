//----------------------------------------------------------------------------------------------------------------------
var exec = require('cordova/exec');

exports.tcpSvr = function(flg, success, error)                         //开启服务端,参数flg为开启、关闭的状态
{
	exec(success, error, "tcpCmm", "tcpSvr", [flg]);
};
exports.tcpCnct = function(flg,ipAddrPt, success, error)               //开启客户端,参数flg为开启、关闭的状态，ipAddrPt为IP地址和端口号
{
	exec(success, error, "tcpCmm", "tcpCnct", [flg,ipAddrPt]);
};
exports.tcpSdMsg = function(message, success, error)                   //发送信息，message为发送的数据
{
	exec(success, error, "tcpCmm", "tcpSdMsg", [message]);
};
exports.rcvMsg = function(success, error)                              //接收信息
{
	exec(success, error, "tcpCmm", "rcvMsg", []);
};
exports.updateMsg = function(success, error)                           //提取字符函数
{
	exec(success, error, "tcpCmm", "updateMsg", []);
};


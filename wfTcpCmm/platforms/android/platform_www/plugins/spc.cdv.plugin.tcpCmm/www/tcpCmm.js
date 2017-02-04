cordova.define("spc.cdv.plugin.tcpCmm.tcpCmm", function(require, exports, module) {
//----------------------------------------------------------------------------------------------------------------------
var exec = require('cordova/exec');

exports.tcpSvr = function(flg, success, error)                         //����������,����flgΪ�������رյ�״̬
{
	exec(success, error, "tcpCmm", "tcpSvr", [flg]);
};
exports.tcpCnct = function(flg,ipAddrPt, success, error)               //�����ͻ���,����flgΪ�������رյ�״̬��ipAddrPtΪIP��ַ�Ͷ˿ں�
{
	exec(success, error, "tcpCmm", "tcpCnct", [flg,ipAddrPt]);
};
exports.tcpSdMsg = function(message, success, error)                   //������Ϣ��messageΪ���͵�����
{
	exec(success, error, "tcpCmm", "tcpSdMsg", [message]);
};
exports.rcvMsg = function(success, error)                              //������Ϣ
{
	exec(success, error, "tcpCmm", "rcvMsg", []);
};
exports.updateMsg = function(success, error)                           //��ȡ�ַ�����
{
	exec(success, error, "tcpCmm", "updateMsg", []);
};


});

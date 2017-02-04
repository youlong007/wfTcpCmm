/**
 * 页面操作处理,恺肇乾, 2016-03-19
 */
//----------------------------------------------------------------------------------------------------------------------
var app =
{
	// Application Constructor
	initialize: function() 
	{this.bindEvents();},
	// Bind Event Listeners
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents: function() 
	{
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	// deviceready Event Handler
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
	// function, we must explicitly call 'app.receivedEvent(...);'
	onDeviceReady: function() 
	{
		app.receivedEvent('deviceready');
	},
    // Update DOM on a Received Event
	receivedEvent: function(id)
	{	var parentElement = document.getElementById(id);
		listeningElement = parentElement.querySelector('.listening');
		var receivedElement = parentElement.querySelector('.received');
		listeningElement.setAttribute('style', 'display:none;');
		receivedElement.setAttribute('style', 'display:block;');
		console.log('Received Event: ' + id);
	}
};
app.initialize();
//----------------------------------------------------------------------------------------------------------------------
function wfAP() 
{	var flg=$("#wfHtp").text();
	var user="EVERRISE201609";
	var pw="everrise0621";	
	var ecpt="WPA_PSK";
	if(flg=="关闭热点")
	{	flg = "dsb";
		$("#wfHtp").html("开启热点");
	}
	if(flg=="开启热点")
	{	flg = "enb";
		$("#wfHtp").html("关闭热点");
	}				
	wifiAp.wfAP(flg,user,pw,ecpt,onSuccess, onFailure);
}   
function onSuccess(result)
{
	$("#rcvTxt").append(result);
}
function onFailure(err) 
{
	$("#rcvTxt").append(err);
}	
//----------------------------------------------------------------------------------------------------------------------
function tcpSvr()                            	  //服务器：创建、关闭服务
{	var flg = $("#tcpServer").text();
	if(flg=="创建服务")
	{	$("#tcpServer").html("关闭服务");
		flg = "enb";
	}
	if(flg=="关闭服务")
	{	$("#tcpServer").html("创建服务");
 		flg = "dsb";
	}
	spcPlug.tcpCmm.tcpSvr(flg,success1, error1);
}
function success1(msg)
{
	alert("success1: " + msg);
}
function error1(msg)
{
	alert("error1: " + msg);
}  
//----------------------------------------------------------------------------------------------------------------------
function tcpCnct()                     			  //客户端：开始、关闭连接
{	var ipAddrPt =$('#ipPt').val();
	var flg = $("#tcpc").text();
	if(flg=="开始连接")
	{	flg = "enb";
		$("#tcpc").html("关闭连接");
	}
	if(flg=="关闭连接")
	{	flg = "dsb";
		$("#tcpc").html("开始连接");
	}
	spcPlug.tcpCmm.tcpCnct(flg,ipAddrPt,success2, error2);
}
function success2(msg)
{
	alert("success2: " + msg);
}
function error2(msg)
{
	alert("error2: " + msg);
} 
//----------------------------------------------------------------------------------------------------------------------			   							
function tcpSdMsg()                    			  //发送消息	
{	var message2 = $('#txtCtt').val();			
	spcPlug.tcpCmm.tcpSdMsg(message2,success3, error3);
}
function success3(msg)
{
	alert("success2: " + msg);
}
function error3(msg)
{
	alert("error3: " + msg);
}  		
//----------------------------------------------------------------------------------------------------------------------
function clrShow()                      		  //清除显示
{
	$("#rcvTxt").text("");
}
function clrShow1()                     		  //清除显示
{
	$("#rcvTxt2").text("");
}
//----------------------------------------------------------------------------------------------------------------------
setInterval("updateMsg();outDspl()",500);         //500为0.5秒钟,更新一次信息
function updateMsg()
{
	spcPlug.tcpCmm.updateMsg(suc, err);
}
function suc(msg)
{	if(msg!=null)
	{	$("#rcvTxt").append(msg);
		$("#rcvTxt2").append(msg);	
		var start = msg.indexOf(",");
		var strHead = msg.substring(0, start);
		var strbody = msg.substring(start+1);
		var strs= new Array();   				  //定义一数组
		strs=strbody.split(","); 				  //字符分割
		if(start>-1)
		{	if(strHead=="Client:*Wq0")
			{	var sIP = strs[1].substring(1, strs[1].length-1);
				var sPort = strs[2];
				var ipAddrPt = sIP + ":" + sPort;
				$('#getipPt').val(ipAddrPt);
			}
			if(strHead=="Client:*Wq1")
			{	machineNum = strbody;
				$('#geteqNum').val(strbody);
			}
			if(strHead=="Client:*Wq2")
			{	var wifiName = strs[1].substring(1, strs[1].length-1);
				var wifiPass = strs[2].substring(1, strs[2].length-2);
				var getwifiNum = wifiName + "," + wifiPass;
				$('#getWifi').val(getwifiNum);
			}
			if(strHead=="Client:*Wq3")
			{	var tm="";
				if(strs[1]==0){tm="2min";}
				if(strs[1]==1){tm="4min";}
				if(strs[1]==2){tm="8min";}
				if(strs[1]==3){tm="15min";} 
				if(strs[1]==4){tm="30min";}
				if(strs[1]==5){tm="60min";}
				$('#gettime').val(tm);
			}
			if(strHead=="Client:*Wq4")
			{	var moshi="";
				if(strs[1]==1){moshi="低速运行";}
				if(strs[1]==2){moshi="中速运行";}
				if(strs[1]==3){moshi="高速运行";}
				if(strs[1]==4){moshi="停止";} 
				if(strs[1]==5){moshi="自控";}
				if(strs[1]==6){moshi="人控";}  
				$('#getcleanwork').val(moshi);
			}
			if(strHead=="Client:*Wq5")
			{	var mzhN = strs[1];
				var mzhP = strs[2];
				var getmhz =mzhN + mzhP;
				var mzh="";
				if(getmhz==76){mzh="433MZH";} 
				if(getmhz==1150){mzh="868/915";}
				$('#getmhz').val(mzh);
			}
			if(strHead=="Client:*Wq6")
			{	var getSendLoc1 = strs[1].substring(0, 2);
				var getSendLoc2 = strs[1].substring(2, 4);
				var getSendLoc3 = strs[1].substring(4, 6);
				var getSendLoc4 = strs[1].substring(6);							  
				$('#getSendLoc1').val(getSendLoc1);
				$('#getSendLoc2').val(getSendLoc2);
				$('#getSendLoc3').val(getSendLoc3);
				$('#getSendLoc4').val(getSendLoc4);
			}
			if(strHead=="Client:*Wq7")
			{	var getSeceiveLoc1 = strs[1].substring(0, 2);
				var getSeceiveLoc2 = strs[1].substring(2, 4);
				var getSeceiveLoc3 = strs[1].substring(4, 6);
				var getSeceiveLoc4 = strs[1].substring(6);	
				$('#getReceiveLoc1').val(getSeceiveLoc1);
				$('#getReceiveLoc2').val(getSeceiveLoc2);
				$('#getReceiveLoc3').val(getSeceiveLoc3);
				$('#getReceiveLoc4').val(getSeceiveLoc4);
			}
			if(strHead=="Client:*Dat")
			{	var strs= new Array();		  	  //定义一数组 
				strs=strbody.split(",");	  	  //字符分割
				if(strs[1]>250)
				{	strs[1] += "μg/m3,严污";
					document.getElementById("pm25Val").innerHTML = strs[1];
					$("#pm25Photo").attr("style","height:250px;background-size:280px 250px;background-repeat:no-repeat;background-image:url(img/qlt6.png)");
					$("#pm25Pic").attr("style","background-color:#7e0123;height:2px;");
				}
				else if(strs[1]>150)
				{	strs[1] += "μg/m3,重污";
					document.getElementById("pm25Val").innerHTML = strs[1];
					$("#pm25Photo").attr("style","height:250px;background-size:280px 250px;background-repeat:no-repeat;background-image:url(img/qlt5.png)");
					$("#pm25Pic").attr("style","background-color:purple;height:2px;");
				}
				else if(strs[1]>115)
				{	document.getElementById("pm25Val").innerHTML = strs[1];
					strs[1] += "μg/m3,中污";
					$("#pm25Photo").attr("style","height:250px;background-size:280px 250px;background-repeat:no-repeat;background-image:url(img/qlt4.png)");
					$("#pm25Pic").attr("style","background-color:red;height:2px;");
				}
				else if(strs[1]>75)
				{	strs[1] += "μg/m3,轻污";
					document.getElementById("pm25Val").innerHTML = strs[1];
					$("#pm25Photo").attr("style","height:250px;background-size:280px 250px;background-repeat:no-repeat;background-image:url(img/qlt3.png)");
					$("#pm25Pic").attr("style","background-color:orange;height:2px;");
				}
				else if(strs[1]>35)
				{	strs[1] += "μg/m3,良";
					document.getElementById("pm25Val").innerHTML = strs[1];
					$("#pm25Photo").attr("style","height:250px;background-size:280px 250px;background-repeat:no-repeat;background-image:url(img/qlt2.png)");
					$("#pm25Pic").attr("style","background-color:yellow;height:2px;");
				}
				else
				{	strs[1] += "μg/m3,优";
					document.getElementById("pm25Val").innerHTML = strs[1];
					$("#pm25Photo").attr("style","height:250px;background-size:280px 250px;background-repeat:no-repeat;background-image:url(img/qlt1.png)");
					$("#pm25Pic").attr("style","background-color:#00e300;height:2px;");
				}
				//------------------------------------------------------------------------------------------------------
				if(strs[2]>500)
				{	strs[2]+= "μg/m3,严污";
					$("#pm10Pic").attr("style","background-color:#7e0123;height:2px;");
				}
				else if(strs[2]>300)
				{	strs[2]+= "μg/m3,重污";
					$("#pm10Pic").attr("style","background-color:purple;height:2px;");
				}
				else if(strs[2]>200)
				{	strs[2]+= "μg/m3,中污";
					$("#pm10Pic").attr("style","background-color:red;height:2px;");
				}
				else if(strs[2]>150)
				{	strs[2]+= "μg/m3,轻污";
					$("#pm10Pic").attr("style","background-color:orange;height:2px;");
				}
				else if(strs[2]>70)
				{	strs[2]+= "μg/m3,良"
					$("#pm10Pic").attr("style","background-color:yellow;height:2px;");
				}
				else
				{	strs[2]+= "μg/m3,优";
					$("#pm10Pic").attr("style","background-color:#00e300;height:2px;");
				}
				//------------------------------------------------------------------------------------------------------
				if(strs[3]>25)
				{	strs[3]+= "mg/m3,窒息";
					$("#hchoPic").attr("style","background-color:purple;height:2px;");
				}
				else if(strs[3]>1)
				{	strs[3]+= "mg/m3,重污";
					$("#hchoPic").attr("style","background-color:red;height:2px;");
				}
				else if(strs[3]>0.6)
				{	strs[3]+= "mg/m3,轻污";
					$("#hchoPic").attr("style","background-color:orange;height:2px;");
				}
				else if(strs[3]>0.08)
				{	strs[3]+= "mg/m3,舒适";
					$("#hchoPic").attr("style","background-color:yellow;height:2px;");
				}
				else if(strs[3]>0.00)
				{	strs[3]+= "mg/m3,无害";
					$("#hchoPic").attr("style","background-color:#00e300;height:2px;");
				}
				else
				{	strs[3]="...";
					$("#hchoPic").attr("style","background-color:purple;height:2px;");
				}
				//------------------------------------------------------------------------------------------------------
				if(strs[4]>5000)
				{	strs[4]+= "ppb,窒息";
					$("#co2Pic").attr("style","background-color:purple;height:2px;");
				}
				else if(strs[4]>2000)
				{	strs[4]+= "ppb,缺氧";
					$("#co2Pic").attr("style","background-color:red;height:2px;");
				}
				else if(strs[4]>1000)
				{	strs[4]+= "ppm,高浓";
					$("#co2Pic").attr("style","background-color:orange;height:2px;");
				}
				else if(strs[4]>350)
				{	strs[4]+= "ppm,舒适";
					$("#co2Pic").attr("style","background-color:yellow;height:2px;");
				}
				else
				{	strs[4]+= "ppm,富氧";
					$("#co2Pic").attr("style","background-color:#00e300;height:2px;");
				}
				//------------------------------------------------------------------------------------------------------
				if(strs[5]>70)
				{	strs[5]+= "%,潮湿";
					$("#humPic").attr("style","background-color:orange;height:2px;");
				}
				else if(strs[5]>50)
				{	strs[5]+= "%,舒适";
					$("#humPic").attr("style","background-color:yellow;height:2px;");
				}
				else
				{	strs[5]+= "%,干燥";
					$("#humPic").attr("style","background-color:#00e300;height:2px;");
				}
				//------------------------------------------------------------------------------------------------------
				if(strs[6]>42)
				{	strs[6]+= "℃,炎热";
					$("#tempPic").attr("style","background-color:purple;height:2px;");
				}
				else if(strs[6]>28)
				{	strs[6]+= "℃,暑热";
					$("#tempPic").attr("style","background-color:red;height:2px;");
				}
				else if(strs[6]>16)
				{	strs[6]+= "℃,舒适";
					$("#tempPic").attr("style","background-color:orange;height:2px;");
				}
				else if(strs[6]>-10)
				{	strs[6]+= "℃,寒冷";
					$("#tempPic").attr("style","background-color:yellow;height:2px;");
				}
				else
				{	strs[6] += "℃,极寒";
					$("#tempPic").attr("style","background-color:#00e300;height:2px;");
				}
				//------------------------------------------------------------------------------------------------------
				if(strs[7]>25)
				{	strs[7]+= "mg/m3,窒息";
					$("#tvocPic").attr("style","background-color:#7e0123;height:2px;");
				}
				else if(strs[7]>3)
				{	strs[7]+= "mg/m3,重污";
					$("#tvocPic").attr("style","background-color:purple;height:2px;");
				}
				else if(strs[7]>2)
				{	strs[7]+= "mg/m3,中污";
					$("#tvocPic").attr("style","background-color:red;height:2px;");
				}
				else if(strs[7]>0.6)
				{	strs[7]+= "mg/m3,轻污";
					$("#tvocPic").attr("style","background-color:orange;height:2px;");
				}
				else if(strs[7]>0.3)
				{	strs[7]+= "mg/m3,舒适";
					$("#tvocPic").attr("style","background-color:yellow;height:2px;");
				}
				else if(strs[7]>0.00)
				{	strs[7]+= "mg/m3,无害";
					$("#tvocPic").attr("style","background-color:#00e300;height:2px;");
				}
				else
				{	strs[7]="...";
					$("#tvocPic").attr("style","background-color:#7e0123;height:2px;");
				}
				//------------------------------------------------------------------------------------------------------
				if(strs[8]==0)
				{	document.getElementById("pwrVal").innerHTML = "正常";
					$("#pwrPic").attr("style","background-color:#00e300;height:2px;");
				}else
				{	document.getElementById("pwrVal").innerHTML = "电量低";
					$("#pwrPic").attr("style","background-color:purple;height:2px;");
				}
				document.getElementById("pm25Text").innerHTML = strs[1];
				document.getElementById("pm10Val").innerHTML = strs[2];
				document.getElementById("hchoVal").innerHTML = strs[3];
				document.getElementById("co2Val").innerHTML = strs[4];
				document.getElementById("humVal").innerHTML = strs[5];
				document.getElementById("tempVal").innerHTML = strs[6];
				document.getElementById("tvocVal").innerHTML = strs[7];
			}
	    }
    }
}
function err(msg)
{
	if(msg!=null)
	$("#rcvTxt").append(msg);
	$("#rcvTxt2").append(msg)
}
//----------------------------------------------------------------------------------------------------------------------
function ipport()                       		  //服务地址端口
{	var message = "*Wq0,"+machineNum;
	spcPlug.tcpCmm.tcpSdMsg(message,success, error);
}
function success(msg){}
function error(msg){}  
//----------------------------------------------------------------------------------------------------------------------
function setport()                       		  //设置ip
{	var message5 = $('#setipPt').val();
	var start = message5.indexOf(":");
	var sIP = message5.substring(0, start);
	var sPort = message5.substring(start+1);
	var ipAddrPt ="*Ws0," + machineNum + ","  + "\"" + sIP + "\"" + "," + sPort;
	spcPlug.tcpCmm.tcpSdMsg(ipAddrPt,success5, error5);
}
function success5(msg)
{
	alert(msg);
}
function error5(msg)
{
	alert("error5: " + msg);
}
//----------------------------------------------------------------------------------------------------------------------
var machineNum = "";                              //全局变量终端号
function equipmentNum()                 		  //测控终端编号
{	var message = "*Wq1";
	spcPlug.tcpCmm.tcpSdMsg(message,success, error);
}
function success(msg){ }
function error(msg){ }
//----------------------------------------------------------------------------------------------------------------------
function setEquipmentNum()                   	  //设置终端编号
{	var message5 = $('#seteqNum').val();
	var EquipmentNum = "*Ws1," + machineNum + "," + message5;
	spcPlug.tcpCmm.tcpSdMsg(EquipmentNum,success7, error7);
}
function success7(msg)
{
	alert(msg);
}
function error7(msg)
{
	alert("error7: " + msg);
}
//----------------------------------------------------------------------------------------------------------------------
function wifiNum()                       		  //WF用户名密码
{	var message = "*Wq2,"+machineNum;
	spcPlug.tcpCmm.tcpSdMsg(message,success, error);
}
function success(msg){ }
function error(msg){ }
//----------------------------------------------------------------------------------------------------------------------
function setwifiNum()                    		  //设置WF用户名密码
{	var message7 = $('#setWifi').val(); 
	var start = message7.indexOf(",");   		  //indexOf查找第一次出现逗号的位置
	var wifiName = message7.substring(0, start);
	var wifiPass = message7.substring(start+1);
	var setwifiNum ="*Ws2," + machineNum + "," + "\"" + wifiName + "\",\""  + wifiPass + "\"";
	spcPlug.tcpCmm.tcpSdMsg(setwifiNum,success9, error9);
}
function success9(msg)
{
	alert(msg);
}
function error9(msg)
{
	alert("error9: " + msg);
}
//----------------------------------------------------------------------------------------------------------------------
function time()                         		  //报告数据间隔
{	var message = "*Wq3,"+machineNum;
	spcPlug.tcpCmm.tcpSdMsg(message,success, error);
}
function success(msg){ }
function error(msg){ }
//----------------------------------------------------------------------------------------------------------------------
function setTimer()                    			  //设置报告数据间隔
{	var message9 = $("#settime option:selected").val(); 
	var setTimer = "*Ws3," + machineNum + "," + message9;
	spcPlug.tcpCmm.tcpSdMsg(setTimer,success11, error11);
}
function success11(msg)
{
	alert(msg);
}
function error11(msg)
{
	alert("error11: " + msg);
}
//----------------------------------------------------------------------------------------------------------------------
function cleanwork()                    		  //净化工作模式
{	var message = "*Wq4,"+machineNum;
	spcPlug.tcpCmm.tcpSdMsg(message,success, error);
}
function success(msg){ }
function error(msg){ }
//----------------------------------------------------------------------------------------------------------------------
function setCleanWork()                  		  //设置净化工作模式
{	var message15 = $("#setcleanwork option:selected").val(); 
	var setCleanWork = "*Ws4," + machineNum + "," + message15;
	spcPlug.tcpCmm.tcpSdMsg(setCleanWork,success13, error13);
}
function success13(msg)
{	alert(msg);
}
function error13(msg)
{	alert("error13: " + msg);
}
//----------------------------------------------------------------------------------------------------------------------
function mhz()                          		  //射频载波频率	
{	var message = "*Wq5,"+machineNum;
	spcPlug.tcpCmm.tcpSdMsg(message,success, error);
}
function success(msg){ }
function error(msg){ }
//----------------------------------------------------------------------------------------------------------------------
function setMHz()                      			  //设置射频载波频率
{	var message17 = $("#setmhz option:selected").val();
	var setMHz =  "*Ws5," + machineNum + "," + message17;
	spcPlug.tcpCmm.tcpSdMsg(setMHz,success15, error15);
}
function success15(msg)
{
	alert(msg);
}
function error15(msg)
{
	alert("error2: " + msg);
}
//----------------------------------------------------------------------------------------------------------------------
function wifiSendLoc()                  		  //无线发送地址
{	var message = "*Wq6,"+machineNum;
	spcPlug.tcpCmm.tcpSdMsg(message,success, error);
}
function success(msg){ }
function error(msg){ }
//----------------------------------------------------------------------------------------------------------------------
function setWifiSendLoc()                		  //设置无线发送地址
{	var message11a = $('#setSendLoc1').val();
	var message11b = $('#setSendLoc2').val();
	var message11c = $('#setSendLoc3').val();
	var message11d = $('#setSendLoc4').val();
	var setWifiSendLoc = "*Ws6," + machineNum + "," + message11a + message11b + message11c + message11d;
	spcPlug.tcpCmm.tcpSdMsg(setWifiSendLoc,success17, error17);
}
function success17(msg)
{
	alert(msg);
}
function error17(msg)
{
	alert("error17: " + msg);
}
//----------------------------------------------------------------------------------------------------------------------
function wifiReceiveLoc()               		  //无线接收地址	
{	var message = "*Wq7,"+machineNum;
	spcPlug.tcpCmm.tcpSdMsg(message,success, error);
}
function success(msg){ }
function error(msg){ }
//----------------------------------------------------------------------------------------------------------------------
function setWifiReceiveLoc()            		  //设置无线接收地址	
{	var message13a = $('#setReceiveLoc1').val();
	var message13b = $('#setReceiveLoc2').val();
	var message13c = $('#setReceiveLoc3').val();
	var message13d = $('#setReceiveLoc4').val();
	var setWifiReceiveLoc = "*Ws7," + machineNum + "," + message13a + message13b + message13c + message13d;
	spcPlug.tcpCmm.tcpSdMsg(setWifiReceiveLoc,success19, error19);
}
function success19(msg)
{
	alert(msg);
}
function error19(msg)
{
	alert("error2: " + msg);
}
//----------------------------------------------------------------------------------------------------------------------
function check(k)                                  //检查单框
{
	var xRex = /^[0-9a-fA-F]{1,2}$/;
	var kVal = document.getElementById(k).value;
	if(!xRex.test(kVal))
	{
		alert("只能是0-9和大小写a-f");
	}
}
//----------------------------------------------------------------------------------------------------------------------
function checkSendLoc()                           //检查发送地址
{
	var xRex = /^[0-9a-fA-F]{2}$/;
	var yRex = /^[0-9a-fA-F]{8}$/;
	var message11a = $('#setSendLoc1').val();
	var message11b = $('#setSendLoc2').val();
	var message11c = $('#setSendLoc3').val();
	var message11d = $('#setSendLoc4').val();
	var message11e = message11a+message11b+message11c+message11d;
	if(!xRex.test(message11a)||!xRex.test(message11b)||!xRex.test(message11c)||!xRex.test(message11d)||!yRex.test(message11e))
	{
		alert("填写不规范");
	}
	else
	{
		setWifiSendLoc();
	}
}
//----------------------------------------------------------------------------------------------------------------------
function checkReceiveLoc()                        //检查接收地址
{
	var xRex = /^[0-9a-fA-F]{2}$/;
	var yRex = /^[0-9a-fA-F]{8}$/;
    var message13a = $('#setReceiveLoc1').val();
	var message13b = $('#setReceiveLoc2').val();
	var message13c = $('#setReceiveLoc3').val();
	var message13d = $('#setReceiveLoc4').val();
	var message13e = message13a+message13b+message13c+message13d;
	if(!xRex.test(message13a)||!xRex.test(message13b)||!xRex.test(message13c)||!xRex.test(message13d)||!yRex.test(message13e))
	{
		alert("填写不规范");
	}
	else
	{
		setWifiReceiveLoc();
	}
}
//----------------------------------------------------------------------------------------------------------------------
function outDspl()                                // 获取室外空质的操作
{	var addr = "http://www.pm25.in/api/querys/aqi_details.json?city=beijing&token=5j1znBVAsnSf5xQyNQyq&stations=no";
	$.ajax(
		{	type:"get", dataType:"jsonp", url:addr,
			success:function(msg)				  // 请求成功
			{ 	var quality;
				if(msg[0].quality=="优") quality="优";
				else if(msg[0].quality=="良") quality="良";
				else if(msg[0].quality=="轻度污染") quality="轻污";
				else if(msg[0].quality=="中度污染") quality="中污";
				else if(msg[0].quality=="重度污染") quality="重污";
				else quality="严污";
				setCookie('outQlt', quality);
				var pm25 = msg[0].pm2_5;          // PM2.5
				setCookie('pm25', pm25);
				setCookie('pm2', msg[0].pm2_5);
				var oq = getCookie('pm2');		  // 突出显示
				if((oq!=null)&&(oq!=0))
			  	{   if(oq>250) document.getElementById("face").src
			  			="../www/img/yanzhong.png";
					else if(oq>150) document.getElementById("face").src
			  			="../www/img/zhongdu.png";
					else if(oq>115) document.getElementById("face").src
			  			="../www/img/qingdu.png";
				    else if(oq>75) document.getElementById("face").src
			  			="../www/img/liang.png";
				    else if(oq>35) document.getElementById("face").src
			  			="../www/img/you.png";
				    else document.getElementById("face").src
				  		="../www/img/you.png";
			  		document.getElementById("face").innerHTML
			  			= oq + "," + getCookie('outQlt');
			  	}
		    },
		    error:function(msg)					  // 请求不成功
			{ 	var oq = getCookie('pm25');		  // 突出显示
				if((oq!=null)&&(oq!=0))
			  	{   if(oq>250) document.getElementById("face").src
			  			="../www/img/yanzhong.png";
					else if(oq>150) document.getElementById("face").src
			  			="../www/img/zhongdu.png";
					else if(oq>115) document.getElementById("face").src
			  			="../www/img/qingdu.png";
				    else if(oq>75) document.getElementById("face").src
			  			="../www/img/liang.png";
				    else if(oq>35) document.getElementById("face").src
			  			="../www/img/you.png";
				    else document.getElementById("face").src
				  		="../www/img/you.png";
			  		document.getElementById("face").innerHTML
			  			= oq + "," + getCookie('outQlt');
			  	}
			}
		});
} 
//----------------------------------------------------------------------------------------------------------------------
function setCookie(name, value)					  // 本地缓存
{	var Days = 30;
	var exp = new Date();
	exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
	document.cookie = name + "=" + escape(value) + ";expires="
			+ exp.toGMTString();
}
function getCookie(name)
{	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if (arr = document.cookie.match(reg))
	   return unescape(arr[2]);
	else return null;
}
//----------------------------------------------------------------------------------------------------------------------
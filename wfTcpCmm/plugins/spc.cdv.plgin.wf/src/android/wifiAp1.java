package spc.cdv.plgin.wf;

import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaWebView;

import android.content.Context;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Method;

import android.app.Activity;
import android.net.wifi.WifiConfiguration;
import android.net.wifi.WifiManager;
import android.os.Bundle;



public class wifiAp extends CordovaPlugin
{
  private WifiManager wifiManager;
  private String flg,user,pw,ecpt;
  private Context mcontext;
  //private BroadcastReceiver wifiReceiver = null;
  
    public void initialize(CordovaInterface cordova, CordovaWebView webView) 
	{  //初始化 
		super.initialize(cordova, webView);  
		mcontext = this.cordova.getActivity().getApplicationContext();  
	//	mcontext = null; 
		wifiManager = (WifiManager)mcontext.getSystemService(Context.WIFI_SERVICE); //获取wifi管理服务

		flg=""; 
		user="";
		pw="";
		ecpt="";   
                 
	} 
  @Override
  public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException   
  { 
           
	  // 通过按钮事件设置热点
	  if(action.equals("wfAP"))	//开关wifi热点功能		  			  		  							
	 {
//	 	 flg=args.getString(0);
//		 user=args.getString(1);
//		 pw=args.getString(2);
//		 ecpt=args.getString(3);

			// 如果是打开状态就关闭，如果是关闭就打开

//			if (flg.equals("enb")) 
//			{ 
//				// 打开热点
//				setWifiApEnabled(true);
//				callbackContext.success("1");
//                
//
//			} else 
//			{ // Wifi开启
//					 if (!wifiManager.isWifiEnabled()) 
//					 {
//						if (wifiManager.getWifiState() != WifiManager.WIFI_STATE_ENABLING) 
//						{
//
//							wifiManager.setWifiEnabled(true);
//						}
//					 }
//					callbackContext.success("2");
//                
//			}
			callbackContext.success("44");
			return true;
	 }
	 return false;
  }

  // wifi热点开关
  public boolean setWifiApEnabled(boolean enabled) 
  {
	if (enabled) 
	{ // disable WiFi in any case
	  // wifi和热点不能同时打开，所以打开热点的时候需要关闭wifi
	  wifiManager.setWifiEnabled(false);
	}try 
	   {
		  // 热点的配置类
		  WifiConfiguration apConfig = new WifiConfiguration();
		  // 配置热点的名称(可以在名字后面加点随机数什么的)
		  apConfig.SSID = "YRCCONNECTION";

		  // 配置热点的密码
		  apConfig.preSharedKey = "12122112";

		  // 安全加密
		  apConfig.allowedKeyManagement.set(WifiConfiguration.KeyMgmt.WPA_PSK);
		  // 通过反射调用设置热点
		  Method method = wifiManager.getClass().getMethod(
				   "setWifiApEnabled", WifiConfiguration.class, Boolean.TYPE);
		  // 返回热点打开状态
		  return (Boolean) method.invoke(wifiManager, apConfig, enabled);
		} catch (Exception e) 
	    {
			return false;
		}
  }
}

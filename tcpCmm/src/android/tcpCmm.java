package spc.cdv.plugin.tcpCmm;

import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaWebView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.SocketAddress;
import java.net.SocketException;
import java.util.Enumeration;
import android.app.Activity;

import android.content.Intent;
import android.os.Message;
import android.os.StrictMode;
import android.text.method.ScrollingMovementMethod;
import android.util.Log;

/**
 * This class echoes a string called from JavaScript.
 */
public class tcpCmm extends CordovaPlugin {                           //连接客户端和服务端，收发信息 

	private ServerSocket serverSocket;
	private boolean serverRuning;
	private boolean isConnecting;
	private Thread mThreadServer,mThreadClient,mThreadMessage;
	private Socket mSocketServer,mSocketClient;
	static BufferedReader mBufferedReaderServer,mBufferedReaderClient;
	static PrintWriter mPrintWriterServer,mPrintWriterClient;
	private String recvMessageServer,recvMessageClient,recvMessage;
	private String msgText,sIP,sPort;
	private char[] buffer;
	private static String recvText;
	private String msg0,msg1;
	private StringBuffer sb;
	private String terminalMessage;
//----------------------------------------------------------------------------------------------------------------------
	//数据初始化
	public void initialize(CordovaInterface cordova, CordovaWebView webView)
	{	
		super.initialize(cordova, webView);
		serverSocket = null;serverRuning = false;
		isConnecting = false;buffer = null;
		mSocketServer = null;mSocketClient = null;
		mBufferedReaderServer = null;mBufferedReaderClient = null;
		mPrintWriterServer = null;mPrintWriterClient = null;
		recvMessageServer = "";recvMessageClient = "";
		recvMessage = "";sIP = "";sPort = "";		
		recvText = "";msgText = "";terminalMessage = "";
    }
//----------------------------------------------------------------------------------------------------------------------
	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException
	{	
    //------------------------------------------------------------------------------------------------------------------
		if (action.equals("updateMsg"))                               //fetch information
		{	mThreadMessage = new Thread(messagerunnable);
			mThreadMessage.start();
			callbackContext.success(msg0);
			return true;
		}
    //------------------------------------------------------------------------------------------------------------------
		if (action.equals("tcpSvr"))                                  //server set up service
		{
			if (args.getString(0).equals("enb"))
			{
				if(serverRuning)
				{
					try
					{
						if(serverSocket!=null)
						{	serverSocket.close();
							serverSocket = null;
						}
						if(mSocketServer!=null)
						{	mSocketServer.close();
							mSocketServer = null;
						}
					}
					catch (IOException e)
					{   e.printStackTrace();  
					}
					mThreadServer.interrupt();
					mThreadServer = new Thread(mcreateRunnable);
					mThreadServer.start();
				}
				else
				{	serverRuning = true;
					mThreadServer = new Thread(mcreateRunnable);
					mThreadServer.start();
				}
			}
			else
			{	serverRuning = false;
				try
				{
					if(serverSocket!=null)
					{	serverSocket.close();
						serverSocket = null;
					}
					if(mSocketServer!=null)
					{	mSocketServer.close();
						mSocketServer = null;
					}
				}
				catch (IOException e)
				{	e.printStackTrace();
				}
				mThreadServer.interrupt();
			}
			return true;
		}
    //------------------------------------------------------------------------------------------------------------------
		if (action.equals("tcpCnct"))                                 //client set up connection
		{	msgText = args.getString(1);
			if (args.getString(0).equals("enb"))
			{	isConnecting = true;
				mThreadClient = new Thread(mRunnable);
				mThreadClient.start();
			}
			else
			{	isConnecting = false;
				try
				{
					if(mSocketClient!=null)
					{	mSocketClient.close();
						mSocketClient = null;
						mPrintWriterClient.close();
						mPrintWriterClient = null;
					}
				}
				catch (IOException e)
				{	e.printStackTrace();
				}
				mThreadClient.interrupt();
			}
			return true;
    	}
    //------------------------------------------------------------------------------------------------------------------
		if(action.equals("tcpSdMsg"))                                 //send message
		{
			if ( isConnecting || serverRuning )
			{	msgText =args.getString(0);                                     //get the content of MsgBox
				if(msgText.length()<=0)
				{	recvText += "发送内容不能为空！/";
				}
				else
				{	sendServerMessage();
					sendClientMessage();
				}
			}else
			{	recvText += "没有连接"+ "/";
			}
			return true;
		}
    //------------------------------------------------------------------------------------------------------------------
		if(action.equals("rcvMsg"))                                   //send message
		{	String a[] = terminalMessage.split(",");
			callbackContext.success(a[1]+","+a[2]);
			return true;
		}
		return false;
	}
//----------------------------------------------------------------------------------------------------------------------
	private Runnable mcreateRunnable = new Runnable()                 //the thread of server
	{
		public void run()
		{
			try
			{	serverSocket = new ServerSocket(8355);                          //fixed port number
  //			serverSocket = new ServerSocket(0);                             //dynamic port number
				SocketAddress address = null;
				if(!serverSocket.isBound())
				{	serverSocket.bind(address, 0);
				}
				getLocalIpAddress();						                    //get the IP and port of the localhost
				mSocketServer = serverSocket.accept();	                	    //wait for the connection of client
				mBufferedReaderServer = new BufferedReader(                     //get the BufferedReader object of client
				    new InputStreamReader(mSocketServer.getInputStream()));
				//send message to client
				mPrintWriterServer = new PrintWriter(mSocketServer.getOutputStream(),true);
				recvText += "Server: client已经连接上！"+ "/";
			}
			catch (IOException e)
			{	recvText += "Server: 服务停止"+ "/";
			}
			getServerMessage();
		}
	};
//----------------------------------------------------------------------------------------------------------------------
	private Runnable mRunnable = new Runnable()                                 //the thread of client
	{
		public void run()
		{
			if(msgText.length()<=0)
			{	recvText += "Client: IP不能为空！/";
			}
			else
			{	int start = msgText.indexOf(":");
				if( (start == -1) ||(start+1 >= msgText.length()) )
				{	recvText += "Client: IP地址不合法/";
				}else
				{	sIP = msgText.substring(0, start);
					sPort = msgText.substring(start+1);
					int port = Integer.parseInt(sPort);
					try
					{	mSocketClient = new Socket(sIP, port);                  //connect server
						//get inputStream
						mBufferedReaderClient = new BufferedReader(
						   new InputStreamReader(mSocketClient.getInputStream()));
						//outputStream
						mPrintWriterClient = new PrintWriter(mSocketClient.getOutputStream(), true);
						recvText += "Client: 已经连接server!"+ "/";
					}
					catch (Exception e)
					{	recvText += "Client: 连接IP异常:" + e.toString() + e.getMessage() + "/";
					}
					getClientMessage();
				}
			}
		}
	};
//----------------------------------------------------------------------------------------------------------------------
	private Runnable messagerunnable = new Runnable()                 //the thread of cutOutMsg
	{
		public void run()
		{	msg0="";
			msg1=""; 
			int k= recvText.length();
			for (int i = 0; i < k; i++)
			{
				if (recvText.substring(i, i + 1).equals("/"))
				{	msg0=recvText.substring(0,i).trim() + "\n";
					msg1=recvText.substring(i+1,k).trim();
					recvText = msg1;
					break;
				}
			}
		}
	};
//----------------------------------------------------------------------------------------------------------------------
	private String getLocalIpAddress()                                //get the IP and port of localhost
	{
		try
		{
			for (Enumeration<NetworkInterface> en = NetworkInterface.getNetworkInterfaces(); en.hasMoreElements();)
			{	NetworkInterface intf = en.nextElement();
				for (Enumeration<InetAddress> enumIpAddr = intf.getInetAddresses();	enumIpAddr.hasMoreElements();) 
				{   InetAddress inetAddress = enumIpAddr.nextElement();
					if (!inetAddress.isLoopbackAddress() && !inetAddress.isLinkLocalAddress() && 
					    inetAddress.isSiteLocalAddress()) 
					{	recvText += "Server: 请连接IP："+inetAddress.getHostAddress()+":"+ 
						serverSocket.getLocalPort()+ "/";
					}
				}
			}
		}
		catch (SocketException ex)
		{   recvText += "Server: 获取IP地址异常:" + ex.getMessage() + "/";
		}
		return null;
	};
//----------------------------------------------------------------------------------------------------------------------
	private String getInfoBuff(char[] buff,int count)                 //change the byte to string
	{	char[] temp = new char[count];
		for(int i=0; i<count; i++)
		{	temp[i] = buff[i];
		}
		return new String(temp);
	};
//----------------------------------------------------------------------------------------------------------------------
	private String sendServerMessage()                                //send ServerMessage
	{
		try 
		{
			if (mSocketServer!=null) 
			{	mPrintWriterServer.print(msgText);                              //服务器发送消息
				mPrintWriterServer.flush();
				if(!isConnecting)
				{	recvText +="Server:"+ msgText  + "/";
				}
			}
		}
		catch (Exception e) 
		{	recvText += "Server：发送异常：" + e.getMessage() + "/";
		}
		return null;
	};
//----------------------------------------------------------------------------------------------------------------------
	private String sendClientMessage()                                //send ClientMessage
	{
		try
		{
			if (mSocketClient!=null) 
			{	mPrintWriterClient.print(msgText);                              //客户端发送消息
				mPrintWriterClient.flush();
				if(!serverRuning)
				{	recvText +="Client:"+ msgText  + "/";
				}
			}
		}
		catch (Exception e)
		{	recvText += "Client: 发送异常：" + e.getMessage() + "/";
		}
		return null;
	};
//----------------------------------------------------------------------------------------------------------------------
	private String getServerMessage()                                 //get ServerMessage
	{	buffer = new char[256];
		int count = 0;
		try
		{
			while(serverRuning)
			{
				if((count = mBufferedReaderServer.read(buffer))>0);
				{	recvText += "Client:"+ getInfoBuff(buffer, count) + "/";
					terminalMessage = getInfoBuff(buffer, count);
				}
			}
		}
		catch (Exception e)
		{	recvText += "Server：接收异常:" + e.getMessage() + "/";
		}
		return null;
	};
//----------------------------------------------------------------------------------------------------------------------
	private String getClientMessage()                                 //get ClientMessage
	{	buffer = new char[256];
		int count = 0;
		try
		{
			while (isConnecting)
			{
				if((count = mBufferedReaderClient.read(buffer))>0)
				{	recvText += "Server:"+  getInfoBuff(buffer, count) + "/";
					terminalMessage = getInfoBuff(buffer, count);
				}
			}
		}
		catch (Exception e)
		{	recvText += "Client: 接收异常:" + e.getMessage() + "/";
		}
		return null;
	};
//----------------------------------------------------------------------------------------------------------------------
}

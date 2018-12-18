package com.akjava.server;

import java.io.File;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.common.io.BaseEncoding;
import com.google.common.io.Files;

public class FileSaveServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private boolean clearImages(){
		File file=new File(getBaseDirectory());
		if(!file.exists()){
			System.out.println("not exist:"+getBaseDirectory());
			return false;
		}

		String[] names=file.list();
		for(String name:names){
			if(name.toLowerCase().endsWith(".png")){
				new File(file,name).delete();
			}
		}
		
		
		return true;
	}
	private String getBaseDirectory(){
		String dir=getInitParameter("OutputDir");
		return dir;
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
		resp.setHeader("Access-Control-Allow-Headers", "*");
		resp.setHeader("Access-Control-Allow-Origin", "*");
		
		//image clear command
		String command = req.getParameter("command");
		if (command != null && command.equals("clear")) {
			boolean result = clearImages();
			resp.getWriter().println("clearImages:" + result);
			return;
		}
		
		//just send filename & data & simply write it
		String name=req.getParameter("name");
		if(name==null){
			resp.sendError(500,"no name");
			return;
		}
		String data=req.getParameter("data");
		
		if(data==null){
			resp.sendError(500,"no data");
			return;
		}
		byte[] bytes=null;
		if(data.startsWith("data:")){
			//TODO more check
			int index=data.indexOf(";base64,");
			if(index==-1){
				resp.sendError(500,"not base64");
				return;
				
			}
			bytes=BaseEncoding.base64().decode(data.substring(index+";base64,".length()));
		}else{
			bytes=data.getBytes();
		}
		//don't care encode. TODO modify directory
		String dir=getBaseDirectory();
		File file=new File(dir+name);
		
		Files.write(bytes, file);
		
		
		resp.getWriter().println(bytes.length);
		//TODO
		//call nona,optional 
	}
}

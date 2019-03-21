Sidebar.TimelinerAnimationToImage=function(ap){
	var scope=this;
	this.frameIndex=0;
	this.started=false;
	this.dataUrl;
	
	
	this.fps=60;
	this.loop=3;
	this.useJsZip=false;
	
	//debug
	this.fps=1;
	this.loop=1;
	this.useJsZip=true;
	
	this.maxFrame=0;
	this.resolution="854x1440";
	this.startIndex=0;
	this.header="";
	this.enableownload=false;

	this.logging=false;

	this.fileNameAsSecond=false;
	this.wait=50;
	
	this.jsZip=null;
	

	this.prepareTime=1000;
	
	function makeDataUrl(time){
		
		defaultOnRender();
		var dataUrl=AppUtils.toPngDataUrl(ap.renderer);
		
		var number=parseInt(time*1000);
		
		if(scope.logging)
			console.log("makeDataUrl",time,"startIndex",scope.startIndex);
		
		var baseName=scope.fileNameAsSecond?number:scope.frameIndex+scope.startIndex;
		var fileName=scope.header+AppUtils.padNumber(baseName,5)+".png";
		
		
		if(scope.useJsZip){
			AppUtils.dataUrlToJsZip(jsZip,fileName,dataUrl);
		}else{
			var link=AppUtils.generateBase64DownloadLink(dataUrl,"image/png",fileName,fileName,false);
			link.click();
		}
		
		scope.frameIndex++;
		
		
	}
	
	ap.getSignal("timelinerSeeked").add(function(time){
		
		if(!scope.enableownload)
			return;
		
		
		makeDataUrl(time);
	});
	
	var titlePanel=new UI.TitlePanel("Timeliner Animation To Image");
	
	
	function getDuration(){
		if(ap.timeliner)
			return ap.timeliner.context.totalTime;
		else
			return 0;
	}
	
	function updateFrameNumber(){
		var duration=getDuration();
		var v=parseInt(scope.fps*scope.loop*duration);
		frameRow.text2.setValue(v+1);
		scope.maxFrame=v+1;	//add last frame
	}
	
	
	var loop=new UI.NumberButtons("Loop",1,30,3,scope.loop,function(v){scope.loop=v;updateFrameNumber()},[1,3,10]);
	titlePanel.add(loop);
	var fps=new UI.NumberButtons("Fps",1,60,60,scope.fps,function(v){scope.fps=v;updateFrameNumber()},[1,10,30,60]);
	titlePanel.add(fps);
	
	var row=new UI.Row();
	titlePanel.add(row);
	var frameRow=new UI.TextSpan("Frames","0");
	row.add(frameRow);
	frameRow.text2.setWidth("40px");

	var minusBt=new UI.ButtonSpan("-",function(){
		var v=startAt.getValue();
		v-=parseInt(frameRow.getValue());
		v=Math.max(0,v);
		startAt.setValue(v);
	});
	row.add(minusBt);
	
	var plusBt=new UI.ButtonSpan("+",function(){
		var v=startAt.getValue();
		v+=parseInt(frameRow.getValue());
		startAt.setValue(v);
	});
	row.add(plusBt);
	
	var startAt=new UI.IntegerSpan("StartAt",0,Infinity,1,0,function(v){
		
		scope.startIndex=v;
	});
	startAt.text.setWidth("50px");
	startAt.number.setWidth("40px");
	startAt.setMarginLeft("16px");
	row.add(startAt);
	
	var options=[
		"2560x1440","854x1440","426x720","1280x1440","720x406","1280x720","854x480","640x720","426x720","640x480"
	]
	
	var resolution=new UI.ListRow("Resolution",options,function(v){
		scope.resolution=v;
	},scope.resolution);
	titlePanel.add(resolution);
	
	function updateResolution(){
		var wh=scope.resolution.split("x");
		var w=wh[0];
		var h=wh[1];
		
		
		ap.camera.aspect =w / h;
		ap.camera.updateProjectionMatrix();
		ap.renderer.setSize( w, h );
	}
	var previewBt=new UI.ButtonSpan("Preview",function(){
		ap.getSignal("cameraControlerUpdate").dispatch();
		updateResolution();
		updateFrameNumber();
	});
	resolution.add(previewBt);
	
	
	titlePanel.add(new UI.Subtitle("FileName Option"));
	
	var header=new UI.InputRow("Header","",function(v){
		scope.header=v;
	});
	titlePanel.add(header);
	
	/*var startIndex=new UI.IntegerRow("StartIndex",0,10000,1,0,function(v){
		scope.startIndex=v;
	});
	titlePanel.add(startIndex);
	startIndex.text.setWidth("70px");
	startIndex.number.setWidth("40px");*/
	
	var defaultOnRender=null;
	
	
	function startRecord(){
		if(scope.useJsZip){
			jsZip= new JSZip();
			scope.wait=0;
		}else{
			scope.wait=50;
		}
		scope.frameIndex=0;
		recordControlBt.button.setLabel("Stop");
		var duration=getDuration();
		
		
		updateResolution();
		updateFrameNumber();
		
		defaultOnRender=ap.onRender;
		ap.onRender=function(){};
		
		var frametime=1.0/fps.getValue();
		var c=0;
		
		//sometime browser skip download
		
		
		function seek(second){
			
			if(scope.frameIndex>=scope.maxFrame){
				console.log("Finished.maybe generation Zip");
				if(scope.useJsZip){
					var anchor=AppUtils.jsZipToAnchor(jsZip,"images.zip","download");
					anchor.click();
					console.log(anchor);
					URL.revokeObjectURL(anchor.href);
				}
				
				stopRecord();
				return;
			}
			//console.log("call seek",second);
			ap.timeliner.context.dispatcher.fire("time.update",second);
			
			c+=frametime;	
			if(c>duration)
				c-=duration;
			if(scope.enableownload)
				setTimeout(seek, scope.wait,c);
		}
		seek(c);
	}
	
	function stopRecord(){
		scope.jszip=null;
		scope.enableownload=false;
		scope.frameIndex=0;
		recordControlBt.button.setLabel("Start Record");
		ap.onRender=defaultOnRender
		
		ap.signals.windowResize.dispatch();
		
	}
	
	var row=new UI.Row();
	titlePanel.add(row);
	var recordControlBt=new UI.ButtonSpan("Start Record",function(){
		
		
		ap.getSignal("cameraControlerUpdate").dispatch();
		ap.timeliner.context.dispatcher.fire("time.update",0);
		
		scope.enableownload=!scope.enableownload;
		if(scope.enableownload){
			setTimeout(function(){
				startRecord();
			},scope.prepareTime);
			
		}
		else{	
			stopRecord();
		}
	});
	recordControlBt.setWidth("120px");
	row.add(recordControlBt);
	
	var jsZipCheck=new UI.CheckboxSpan("Use JsZip(slow)",this.useJsZip,function(v){scope.useJsZip=v});
	jsZipCheck.text.setMarginLeft("12px");
	jsZipCheck.text.setWidth("120px");
	row.add(jsZipCheck);
	
	
	
	return titlePanel;
}
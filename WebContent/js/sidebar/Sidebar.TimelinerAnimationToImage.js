Sidebar.TimelinerAnimationToImage=function(ap){
	var scope=this;
	this.frameIndex=0;
	this.started=false;
	this.dataUrl;
	this.fps=60;
	this.stepTime=1.0/scope.fps;
	this.loop=3;
	this.maxFrame=0;
	this.resolution="2560x1440";
	this.startIndex=0;
	this.header="";
	this.enableownload=false;
	

	this.fileNameAsSecond=false;
	
	
	function makeDataUrl(time){
		console.log("makeDataUrl",time);
		defaultOnRender();
		var dataUrl=AppUtils.toPngDataUrl(ap.renderer);
		
		var number=parseInt(time*1000);
		
		console.log(scope.startIndex);
		var baseName=scope.fileNameAsSecond?number:scope.frameIndex+scope.startIndex;
		var fileName=scope.header+AppUtils.padNumber(baseName,5)+".png";
		
		
		var link=AppUtils.generateBase64DownloadLink(dataUrl,"image/png",fileName,fileName,false);
		
		
		
		
		//switch max frame
		link.addEventListener( 'click', function ( event ) {
			
		} );
		scope.frameIndex++;
		
		link.click();
	}
	
	ap.getSignal("timelinerSeeked").add(function(time){
		
		if(!scope.enableownload)
			return;
		
		
		makeDataUrl(time);
	});
	
	var titlePanel=new UI.TitlePanel("Timeliner Animation To Image");
	
	
	function getDuration(){
		return ap.timeliner.context.totalTime;
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

	var startAt=new UI.IntegerSpan("StartAt",0,Infinity,1,0,function(v){
		
		scope.startIndex=v;
	});
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
	
	
	
	
	var enableownload=new UI.SwitchRow("Stop","Start Record",false,function(v){
		scope.enableownload=v;
	
		var duration=getDuration();
		scope.frameIndex=0;
		if(v){
			updateResolution();
			updateFrameNumber();
			
			defaultOnRender=ap.onRender;
			ap.onRender=function(){};
			
			var frametime=1.0/fps.getValue();
			var c=0;
			
			var wait=50;
			
			
			function seek(second){
				
				if(scope.frameIndex>=scope.maxFrame){
					console.log("finished");
					return;
				}
				//console.log("call seek",second);
				ap.timeliner.context.dispatcher.fire("time.update",second);
				
				c+=frametime;	
				if(c>duration)
					c-=duration;
				if(scope.enableownload)
					setTimeout(seek, wait,c);
			}
			seek(c);
		}
		
		else{
			
			ap.onRender=defaultOnRender
			
			ap.signals.windowResize.dispatch();
		}
	});
	
	titlePanel.add(enableownload);
	
	
	return titlePanel;
}
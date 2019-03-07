Sidebar.AnimationToImagePanel=function(ap){
	var scope=this;
	this.frameIndex=0;
	this.started=false;
	this.dataUrl;
	this.fps=4
	this.stepTime=1.0/scope.fps;
	this.duration=1;
	this.maxFrame=0;
	this.resolution="720x406";
	this.startIndex=0;
	this.header="";
	this.autoDownload=false;
	
	function makeDataUrl(){
		scope.started=true;
		
		ap.getSignal("clipPlayerUpdate").dispatch();
		defaultOnRender();
		
		
		var dataUrl=AppUtils.toPngDataUrl(ap.renderer);
		
		var fileName=scope.header+AppUtils.padNumber(scope.frameIndex,5)+".png";
		
		var link=AppUtils.generateBase64DownloadLink(dataUrl,"image/png",fileName,fileName,true);
		span.dom.appendChild(link);
		
		
		
		//switch max frame
		link.addEventListener( 'click', function ( event ) {
			if(scope.frameIndex>=scope.maxFrame){
				return;//finishd
			}
			makeDataUrl();
		} );
		scope.frameIndex++;
		
		//link.click();
		if(scope.autoDownload){
			link.click();
		}
	}
	
	var titlePanel=new UI.TitlePanel("Animation To Image");
	
	function update(){
		var v=parseInt(scope.fps*scope.duration);
		frameRow.text2.setValue(v);
		scope.maxFrame=v;
	}
	
	var duration=new UI.NumberButtons("Duration",0.2,30,1,scope.duration,function(v){scope.duration=v;update()},[1,2,10]);
	titlePanel.add(duration);
	var fps=new UI.NumberButtons("Fps",1,60,1,scope.fps,function(v){scope.fps=v;update()},[10,20,30]);
	titlePanel.add(fps);
	
	var frameRow=new UI.TextRow("Frames","0");
	titlePanel.add(frameRow);

	
	
	var options=[
		"720x406","1280x720","854x480","640x720","426x720","640x480"
	]
	
	var resolution=new UI.ListRow("Resolution",options,function(v){
		scope.resolution=v;
	},scope.resolution);
	titlePanel.add(resolution);
	
	titlePanel.add(new UI.Subtitle("FileName Option"));
	
	var header=new UI.InputRow("Header","",function(v){
		scope.header=v;
	});
	titlePanel.add(header);
	
	var startIndex=new UI.IntegerRow("StartIndex",0,10000,1,0,function(v){
		scope.startIndex=v;
	});
	titlePanel.add(startIndex);
	startIndex.text.setWidth("70px");
	startIndex.number.setWidth("40px");
	
	var autodownload=new UI.CheckboxText("Auto Download",false,function(v){
		scope.autoDownload=v;
	});
	autodownload.text.setWidth("120px");
	
	startIndex.add(autodownload);
	
	var row=new UI.Row();
	titlePanel.add(row);
	
	var bt=new UI.Button("Start");
	
	row.add(bt);
	
	var defaultOnRender=null;
	
	var onNewUpdateMixer=function(){
		
		var step=scope.started?scope.stepTime:0;
		ap.mixer.update(step);
	};
	
	bt.onClick(function(){
		
		//stop
		if(scope.started){
			skip.setDisabled(true);
			
			ap.getSignal("clipPlayerStopped").dispatch();
			scope.frameIndex=scope.startIndex;
			//ap.signals.rendered.active=true;
			ap.signals.windowResize.active=true;
			scope.started=false;
			bt.setTextContent("Start");
			
			//span.dom.innerHTML = ''			
			AppUtils.clearAllChildren(span.dom);

			ap.onRender=defaultOnRender;
			
			ap.signals.rendered.add(ap.onUpdateMixer);
			ap.signals.rendered.remove(onNewUpdateMixer);
			
			ap.signals.windowResize.dispatch();
		}else{//play
		
		
		//ap.clipPlayerRow.setDisplay("none");
		//ap.signals.rendered.active=false;
		
		defaultOnRender=ap.onRender;
		ap.onRender=function(){};
		
		ap.signals.windowResize.active=false;
		ap.getSignal("clipPlayerPlayed").dispatch();
			
		if(!ap.mixer){
			console.log("not ready.maybe not clip upload");
			ap.signals.windowResize.active=true;
			ap.onRender=defaultOnRender;
			return;
		}
		
		skip.setDisabled(false);
		
		scope.stepTime=1.0/scope.fps;
		
		//start at
		ap.mixer.update(scope.stepTime*scope.startIndex);
		
		ap.signals.rendered.remove(ap.onUpdateMixer);
		ap.signals.rendered.add(onNewUpdateMixer);
		defaultOnRender();
		//change resolution
		var wh=scope.resolution.split("x");
		var w=wh[0];
		var h=wh[1];
		
		
		ap.camera.aspect =w / h;
		ap.camera.updateProjectionMatrix();
		ap.renderer.setSize( w, h );
			
		
		
		ap.getSignal("clipPlayerUpdate").dispatch();
		makeDataUrl();
		bt.setTextContent("Stop");
		
		}
	});
	
	var skip=new UI.Button("Skip");
	skip.setMarginRight("6px");
	skip.setDisabled(true);
	row.add(skip);
	skip.onClick(function(){
		AppUtils.clearAllChildren(span.dom);
		if(scope.frameIndex>=scope.maxFrame){
			return;//finishd
		}
		makeDataUrl();
	})
	
	var span=new UI.Span();
	row.add(span);
	
	update();
	
	return titlePanel;
}
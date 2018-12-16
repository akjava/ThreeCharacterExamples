var AnimationToImagePanel=function(ap){
	var scope=this;
	this.frameIndex=0;
	this.started=false;
	this.dataUrl;
	this.fps=4
	this.stepTime=1.0/scope.fps;
	this.duration=1;
	this.maxFrame=0;
	this.resolution="720x406";
	
	function makeDataUrl(){
		scope.stepTime=1.0/scope.fps;
		var step=scope.started?scope.stepTime:0;
		scope.started=true;
		
		
		ap.mixer.update(step);
		ap.clipPlayerRow.update();
		ap.renderer.render( ap.scene, ap.camera );
		
		var dataUrl=AppUtils.toPngDataUrl(ap.renderer);
		
		var fileName=AppUtils.padNumber(scope.frameIndex,5)+".png";
		
		var link=AppUtils.generateBase64DownloadLink(dataUrl,"image/png",fileName,fileName,true);
		span.dom.appendChild(link);
		
		
		
		//switch max frame
		link.addEventListener( 'click', function ( event ) {
			if(scope.frameIndex==scope.maxFrame){
				return;//finishd
			}
			makeDataUrl();
		} );
		scope.frameIndex++;
		
		
	}
	
	var titlePanel=new UI.TitlePanel("Animation To Image");
	
	function update(){
		var v=parseInt(scope.fps*scope.duration);
		frameNumber.setValue(v);
		scope.maxFrame=v;
	}
	
	var duration=new UI.NumberButtons("Duration",0.2,30,1,scope.duration,function(v){scope.duration=v;update()},[1,2,10]);
	titlePanel.add(duration);
	var fps=new UI.NumberButtons("Fps",1,60,1,scope.fps,function(v){scope.fps=v;update()},[10,20,30]);
	titlePanel.add(fps);
	
	var frameRow=new UI.TextRow("Frames");
	titlePanel.add(frameRow);
	var frameNumber=new UI.Text("0");
	frameRow.add(frameNumber);
	
	
	var options=[
		"720x406","1280x720","854x480","640x720","426x720","640x480"
	]
	
	var resolution=new UI.ListRow("Resolution",options,function(v){
		scope.resolution=v;
	},scope.resolution);
	titlePanel.add(resolution);
	
	
	
	var row=new UI.Row();
	titlePanel.add(row);
	
	var bt=new UI.Button("Start");
	
	row.add(bt);
	
	bt.onClick(function(){
		//stop
		if(scope.started){
			skip.setDisabled(true);
			ap.clipPlayerRow.setDisplay("");
			ap.clipPlayerRow.stop();
			scope.frameIndex=0;
			ap.signals.rendered.active=true;
			ap.signals.windowResize.active=true;
			scope.started=false;
			bt.setTextContent("Start");
			
			//span.dom.innerHTML = ''			
			AppUtils.clearAllChildren(span.dom);

			
			ap.signals.windowResize.dispatch();
		}else{//play
		skip.setDisabled(false);
		ap.clipPlayerRow.stop();
		ap.clipPlayerRow.setDisplay("none");
		ap.clipPlayerRow.play();
		ap.signals.rendered.active=false;
		ap.signals.windowResize.active=false;
			
		//change resolution
		var wh=scope.resolution.split("x");
		var w=wh[0];
		var h=wh[1];
		
		
		ap.camera.aspect =w / h;
		ap.camera.updateProjectionMatrix();
		ap.renderer.setSize( w, h );
			
		
		
		update();
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
		if(scope.frameIndex==scope.maxFrame){
			return;//finishd
		}
		makeDataUrl();
	})
	
	var span=new UI.Span();
	row.add(span);
	
	update();
	
	return titlePanel;
}
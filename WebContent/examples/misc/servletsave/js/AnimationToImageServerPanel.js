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
	this.startIndex=0;
	this.header="";
	
	function encodeQueryString(decodedURLComponent){
	    var regexp = /%20/g;
	    return encodeURIComponent(decodedURLComponent).replace(regexp, "+");
		};
		
	function post(fileName,data,listener){
		var xmlHttpRequest = new XMLHttpRequest();
		xmlHttpRequest.onreadystatechange = function()
		{
		    var READYSTATE_COMPLETED = 4;
		    var HTTP_STATUS_OK = 200;

		    if( this.readyState == READYSTATE_COMPLETED
		     && this.status == HTTP_STATUS_OK )
		    {
		        listener( this.responseText );
		    }
		}
		xmlHttpRequest.open( 'POST', 'http://127.0.0.1:8888/write' );
		xmlHttpRequest.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );

		var query="name="+encodeQueryString(fileName)+"&"+"data="+encodeQueryString(data);
		
		xmlHttpRequest.send(query);
	}
	
	function makeDataUrl(){
		scope.stepTime=1.0/scope.fps;
		var step=scope.started?scope.stepTime:0;
		scope.started=true;
		
		
		ap.mixer.update(step);
		ap.clipPlayerRow.update();
		ap.renderer.render( ap.scene, ap.camera );
		
		var dataUrl=AppUtils.toPngDataUrl(ap.renderer);
		
		var fileName=scope.header+AppUtils.padNumber(scope.frameIndex,5)+".png";
		
		var link=AppUtils.generateBase64DownloadLink(dataUrl,"image/png",fileName,fileName,true);
		//span.dom.appendChild(link);
		post(fileName,dataUrl,function(length){
			scope.frameIndex++;
			if(scope.frameIndex==scope.maxFrame){
				stop();
				return;//finishd
			}
			makeDataUrl();
		});
		
		//copy from GWT
		
		
		
		
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
	
	
	var row=new UI.Row();
	titlePanel.add(row);
	
	var bt=new UI.Button("Start");
	
	row.add(bt);
	
	function stop(){
		skip.setDisabled(true);
		ap.clipPlayerRow.setDisplay("");
		ap.clipPlayerRow.stop();
		scope.frameIndex=scope.startIndex;
		ap.signals.rendered.active=true;
		ap.signals.windowResize.active=true;
		scope.started=false;
		bt.setTextContent("Start");
		
		//span.dom.innerHTML = ''			
		AppUtils.clearAllChildren(span.dom);

		
		ap.signals.windowResize.dispatch();
	}
	
	bt.onClick(function(){
		//stop
		if(scope.started){
			stop();
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
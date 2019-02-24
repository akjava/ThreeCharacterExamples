Sidebar.BackgroundVideo=function(ap){
	var scope=this;
	var titlePanel=new UI.TitlePanel("Background Video");
	
	var row1=new UI.Row();
	titlePanel.add(row1);
	
	var fileInput=new UI.BlobFile(".mp4,.webm");
	row1.add(fileInput);
	
	var bgWidth=0;
	var bgHeight=0;
	var texture=null;
	var video=null;
	
	this.updateTimeLiner=false;
	
	titlePanel.loadVideo=function(fileName,url){
		if(url==null){
			scope.texture=null;
			ap.scene.background=undefined;
			return;
		}
		
		var video = document.createElement("video");
	    video.src = url;
	    video.addEventListener('loadeddata', function() {
	    	   console.log("duration",video.duration);
	    	   duration.setValue(video.duration.toFixed(2));
	    	}, false);
	    video.addEventListener('play',function(){console.log("play")},false);
	    video.addEventListener('pause',function(){console.log("pause")},false);
	    video.addEventListener('ended',function(){console.log("ended")},false);
	    video.addEventListener('timeupdate',function(){
	    	current.setValue(video.currentTime);
	    	if(scope.updateTimeLiner && ap.timeliner){
	    		ap.timeliner.context.dispatcher.fire("time.update",video.currentTime);
	    	}
	    	},false);
	    video.load();
	    ap.video=video;
	    
	   
	    
	    texture = new THREE.VideoTexture(video);
	    texture.minFilter = THREE.LinearFilter;
	    texture.magFilter = THREE.LinearFilter;
	    texture.format = THREE.RGBFormat;
	    //texture.wrapS = THREE.RepeatWrapping;
       // texture.wrapT = THREE.RepeatWrapping;
        
        ap.scene.background=texture;
	    
		//onResize();
	}
	
	fileInput.onChange(function(fileName,blobUrl){
		
		
		titlePanel.loadVideo(fileName,blobUrl);
		
	});
	
	var bt=new UI.ButtonRow("play",function(){
		ap.video.play();
	})
	titlePanel.add(bt);
	
	var stopBt=new UI.Button("Stop").onClick(function(){
		ap.video.pause();
		ap.video.currentTime=0;
	});
	bt.add(stopBt);
	var pauseBt=new UI.Button("Pause").onClick(function(){
		ap.video.pause();
	});
	bt.add(pauseBt);
	
	var check=new UI.CheckboxText("Call Timeliner",false,function(v){
		scope.updateTimeLiner=v;
	});
	bt.add(check);
	
	var timeRow=new UI.Row();
	titlePanel.add(timeRow);
	
	var seek1=new UI.Button("--").onClick(function(){
		var time=ap.video.currentTime-1;
		if(time<0){
			time=0;
		}
		ap.video.currentTime=time;
	});
	titlePanel.add(seek1);
	var seek1=new UI.Button("-").onClick(function(){
		var time=ap.video.currentTime-.1;
		if(time<0){
			time=time;
		}
		ap.video.currentTime=time;
	});
	titlePanel.add(seek1);
	
	var current=new UI.Number(0);
	current.min=0;
	current.onChange(function(){
		ap.video.currentTime=current.getValue();
	})
	current.setWidth("30px");
	titlePanel.add(current);
	
	var seek1=new UI.Button("+").onClick(function(){
		var time=ap.video.currentTime+0.1;
		if(time>ap.video.duration){
			time=ap.video.duration;
		}
		ap.video.currentTime=time;
	});
	titlePanel.add(seek1);
	var seek1=new UI.Button("++").onClick(function(){
		var time=ap.video.currentTime+1;
		if(time>ap.video.duration){
			time=ap.video.duration;
		}
		ap.video.currentTime=time;
	});
	titlePanel.add(seek1);
	
	var o=new UI.Text(" of ");
	o.setWidth("20px");
	titlePanel.add(o);
	
	var duration=new UI.Text("");
	titlePanel.add(duration);
	
	ap.getSignal("timelinerSeeked").add(function(time){
		if(scope.updateTimeLiner){
			return;//not update from timeliner
		}
		if(ap.video!==undefined &&ap.video!=null){
			var d=ap.video.duration;
			if(time>d){
				time=time%d;
			}
			ap.video.currentTime=time;
		}
	});
	
	
	return titlePanel;
}
var ClipPlayerRow=function(ap,getClipFunction){
	if(getClipFunction==undefined){
		getClipFunction=function(){return ap.clip};
	}
	var scope=this;
	var row=new UI.Row();
	this.action=null;
	this.paused=false;
	this.duration=0;
	
	row.setDuration=function(v){
		scope.duration=v;
		row.update();
	}
	
	
	var playBt=new UI.Button("Play");
	row.add(playBt);
	var play=function(){
		var clip=getClipFunction();
		if(!clip){
			console.error("ClipPlayerRow:no clip");
			return;
		}
		if(ap.mixer==undefined){
			Logics.initializeSkinnedMeshMixer(ap);
		}
		
		var mixer=ap.mixer;
		
		mixer.uncacheClip(clip.name);
		
		AnimeUtils.resetPose(ap.skinnedMesh);
		AnimeUtils.resetMesh(ap.skinnedMesh);
		
		row.setDuration(clip.duration);
		
		scope.action=mixer.clipAction(clip).play();
		playBt.setDisabled(true);
		pauseBt.setDisabled(false);
		stopBt.setDisabled(false);
		scope.paused=false;
	};
	
	ap.getSignal("clipPlayerPlayed").add(function(){
		stop();
		play();
	});
	ap.getSignal("clipPlayerStopped").add(function(){
		stop();
	})
	
	row.play=play;
	playBt.onClick(play);
	var pauseBt=new UI.Button("Pause");
	pauseBt.setDisabled(true);
	pauseBt.setWidth("100px");
	row.add(pauseBt);
	var pause=function(){
		scope.paused=!scope.paused;
		if(scope.paused){
			pauseBt.setTextContent("Unpause");
		}else{
			pauseBt.setTextContent("Pause");
		}
		if(scope.action!=null){
			scope.action.paused=scope.paused;
		}
	};
	row.pause=pause;
	pauseBt.onClick(pause);
	var stopBt=new UI.Button("Stop");
	row.add(stopBt);
	stopBt.setDisabled(true);
	
	//Support stop when pose changed.
	var stop=function(){
		playBt.setDisabled(false);
		pauseBt.setDisabled(true);
		stopBt.setDisabled(true);
		
		scope.paused=false;
		pauseBt.setTextContent("Pause");
		
		if(scope.action!=null){
			scope.action.stop();
		}
	};
	row.stop=stop;
	stopBt.onClick(stop);
	
	ap.signals.loadingModelFinished.add(function(){
		stop();
		
		Logics.disposeSkinnedMeshMixer(ap);
			
	})
	
	//Support update duration when clip updated
	var timeLabel=new UI.Text("0.00/0.00");
	timeLabel.setMarginLeft("4px");
	var update=function(){
		if(scope.action==null){
			return;
		}
		var t=scope.action!=null?scope.action.time:0;
		timeLabel.setValue(t.toFixed(2)+"/"+scope.duration.toFixed(2));
	};
	row.update=update;
	ap.signals.rendered.add(update);
	row.add(timeLabel);
	
	
	return row;
}
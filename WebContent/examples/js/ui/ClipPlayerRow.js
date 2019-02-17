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
	
	var updateMixer=function (){
		var delta = ap.clock.getDelta();
		ap.mixer.update(delta);
	};
	
	
	
	var playBt=new UI.Button("Play");
	row.add(playBt);
	var play=function(){
		var clip=getClipFunction();
		if(!clip){
			console.error("ClipPlayerRow:no clip");
			return;
		}
		if(ap.mixer==undefined){
			console.info("ap.mixer is undefined,mixer created,warn signals calling oeder is not sure.if frame dropped make mixer update first");
			ap.mixer=new THREE.AnimationMixer(ap.skinnedMesh);
			ap.clock=new THREE.Clock();
			
			ap.signals.rendered.add(updateMixer);
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
		console.log("call stopped");
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
		ap.signals.rendered.remove(updateMixer);
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
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
		var mixer=ap.mixer;
		if(mixer==undefined){
			console.error("ap.mixer is undefined");
			return;
		}
		mixer.uncacheClip(clip.name);
		
		AnimeUtils.resetPose(ap.skinnedMesh);
		AnimeUtils.resetMesh(ap.skinnedMesh);
		
		scope.action=mixer.clipAction(clip).play();
		playBt.setDisabled(true);
		pauseBt.setDisabled(false);
		stopBt.setDisabled(false);
		scope.paused=false;
	};
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
		var mixer=ap.mixer;
		if(mixer==undefined){
			console.error("ap.mixer is undefined");
			return;
		}
		if(scope.action!=null){
			scope.action.stop();
		}
		playBt.setDisabled(false);
		pauseBt.setDisabled(true);
		stopBt.setDisabled(true);
		
		scope.paused=false;
		pauseBt.setTextContent("Pause");
	};
	row.stop=stop;
	stopBt.onClick(stop);
	
	//Support update duration when clip updated
	var timeLabel=new UI.Text("0.00/0.00");
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
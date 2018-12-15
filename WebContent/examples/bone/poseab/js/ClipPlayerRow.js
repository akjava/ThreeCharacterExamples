var ClipPlayerRow=function(ap,getClipFunction){
	if(getClipFunction==undefined){
		getClipFunction=function(){return ap.clip};
	}
	var scope=this;
	var row=new UI.Row();
	this.action=null;
	this.paused=false;
	
	var playBt=new UI.Button("Play");
	row.add(playBt);
	playBt.onClick(function(){
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
		scope.action=mixer.clipAction(clip).play();
		playBt.setDisabled(true);
		pauseBt.setDisabled(false);
		stopBt.setDisabled(false);
		scope.paused=false;
	});
	var pauseBt=new UI.Button("Pause");
	pauseBt.setDisabled(true);
	pauseBt.setWidth("100px");
	row.add(pauseBt);
	pauseBt.onClick(function(){
		scope.paused=!scope.paused;
		if(scope.paused){
			pauseBt.setTextContent("Unpause");
		}else{
			pauseBt.setTextContent("Pause");
		}
		if(scope.action!=null){
			scope.action.paused=scope.paused;
		}
	});
	var stopBt=new UI.Button("Stop");
	row.add(stopBt);
	stopBt.setDisabled(true);
	
	//Support stop when pose changed.
	stopBt.onClick(function(){
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
	});
	
	//Support update duration when clip updated
	var time=new UI.Text("0.00");
	ap.signals.rendered.add(function(){
		if(scope.action==null){
			return;
		}
		var t=scope.action.time;
		time.setValue(t.toFixed(2));
	});
	row.add(time);
	
	
	return row;
}
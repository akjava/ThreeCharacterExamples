Sidebar.TimelinerBackgroundClip=function(ap){
	var titlePanel=new UI.TitlePanel("Timeliner Background Clip");
	var scope=this;
	this.clip=null;
	this.time=0;
	this._action=null;;
	
	var loadClipRow=new LoadClipRow(function(clip){
		scope.mixer.stopAllAction();
		this._action=null;
		
		scope.clip=clip;
		
		if(clip!=null){//ready clip
			scope._action=scope.mixer.clipAction(scope.clip).play();
			durationRow.setValue(String(clip.duration)+" sec");
		}else{
			durationRow.setValue("0 sec");
		}
		
		seeked(scope.time);
	});
	
	titlePanel.add(loadClipRow);
	
	var durationRow=new UI.TextRow("Duration","0 sec");
	titlePanel.add(durationRow);
	
	ap.signals.loadingModelFinished.add(function(mesh){
		if(scope.mixer!=null){
			scope.mixer.stopAllAction();
		}
		scope.mixer=new THREE.AnimationMixer(mesh);
	});
	
	function seeked(t){
		scope.time=t;
		if(scope.clip==null){
			return;
		}
		
		scope._action.time = t;
		scope.mixer.update( 0 );
	}
	
	ap.getSignal("timelinerSeeked").add(seeked);
	
	
	return titlePanel;
}
Sidebar.ImportTimelinerBackground=function(ap){
	var container=new UI.TitlePanel("Import Timeliner Background");
	
	if(ap.signals.timelinerDisplayTimeChanged==undefined){
		console.error("ImportTimelinerBackground need ap.signals.timeliner_displayTimeChanged");
		return container;
	}
	
	var scope=this;
	
	var row1=new UI.Row();
	container.add(row1);
	
	
	var fileInput=new UI.TextFile(".json");
	row1.add(fileInput);
	
	//TODO move to arg
	function callUpdate(){
		if(scope.mixer==null){
			return;
		}
		if(scope.clip==null){
			return;
		}
		var time=ap.timeliner.context.currentTime;
	
		scope.action.time = time;
		scope.mixer.update( 0 );
	}
	
	
	
	ap.signals.timelinerDisplayTimeChanged.add(callUpdate);
	
	this.mixer=null;
	this.clip=null;
	
	
	fileInput.onChange(function(fileName,text){
		if(scope.mixer==null){
			scope.mixer=new THREE.AnimationMixer(ap.skinnedMesh);
			console.log("mixer initialized");
		}
		var mixer=scope.mixer;
		mixer.stopAllAction();
		AnimeUtils.resetPose(ap.skinnedMesh);
		AnimeUtils.resetMesh(ap.skinnedMesh);
		
		if(text==null){//just Reset
			scope.clip=null;
			mixer.stopAllAction();
			return;
		}
		
		var json = JSON.parse( text );//TODO catch
		
		
		
		
		var clip=THREE.AnimationClip.parse(json);
		if(json.boneNames!==undefined){
			clip.boneNames=json.boneNames;
		}
		
		scope.clip=clip;
		scope.action=mixer.clipAction(clip).play();
		callUpdate();
		
	});
	
	return container;
}
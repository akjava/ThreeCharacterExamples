Sidebar.ImportPose=function(ap){
	var container=new UI.TitlePanel("Import Single Any Frame Clip");
	
	var row1=new UI.Row();
	container.add(row1);
	
	
	var fileInput=new UI.TextFile(".json");
	row1.add(fileInput);
	
	function callUpdate(){
		ap.getSignal("poseChanged").dispatch();
		//boneAttachControler update
		//ikControler resetAllIkTargets
		//translateControler updatePosition
	}
	this.mixer=null;
	
	var scope=this;
	fileInput.onChange(function(fileName,text){
		if(scope.mixer==null){
			scope.mixer=new THREE.AnimationMixer(ap.skinnedMesh);
			//console.log("mixer initialized");
		}
		var mixer=scope.mixer;
		mixer.stopAllAction();
		AnimeUtils.resetPose(ap.skinnedMesh);
		AnimeUtils.resetMesh(ap.skinnedMesh);
		
		if(text==null){//just Reset
			callUpdate();
			return;
		}
		
		var json = JSON.parse( text );//TODO catch
		
		
		
		
		var clip=THREE.AnimationClip.parse(json);
		if(json.boneNames!==undefined){
			clip.boneNames=json.boneNames;
		}
		
		
		
		
		mixer.uncacheClip(clip.name);
		mixer.clipAction(clip).play();
		mixer.update();
		//mixer.stopAllAction();
		
		callUpdate();
		
	});
	
	return container;
}
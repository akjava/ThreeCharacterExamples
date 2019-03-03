Sidebar.Import=function(ap){
	var container=new UI.TitlePanel("Import Pose");
	
	var row1=new UI.Row();
	container.add(row1);
	
	
	var fileInput=new UI.TextFile(".json");
	row1.add(fileInput);
	
	fileInput.onChange(function(fileName,text){
		var mixer=ap.mixer;
		mixer.stopAllAction();
		AnimeUtils.resetPose(ap.skinnedMesh);
		
		if(text==null){//just Reset
			if(ap.signals.poseChanged){
				ap.signals.poseChanged.dispatch();
			}
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
		mixer.stopAllAction();
		
		if(ap.signals.poseChanged){
			ap.signals.poseChanged.dispatch();
		}
	});
	
	return container;
}
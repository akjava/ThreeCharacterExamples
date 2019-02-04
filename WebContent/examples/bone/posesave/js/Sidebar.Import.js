Sidebar.Import=function(ap){
	var container=new UI.TitlePanel("Import");
	
	var row1=new UI.Row();
	container.add(row1);
	
	
	var fileInput=new UI.TextFile(".json");
	row1.add(fileInput);
	
	function callUpdate(){
		//for some ik control
		if(ap.ikControler){
			ap.skinnedMesh.updateMatrixWorld(true);
			ap.ikControler.boneAttachControler.update();
		}
		
		if(ap.signals.skinnedMeshTransformeFinished){
			ap.signals.skinnedMeshTransformeFinished.dispatch("ObjectTranslate");
			ap.signals.skinnedMeshTransformeFinished.dispatch("ObjectRotate");
			}
		//maybe duplicate,usually skinnedMeshTransformed call poseChanged
		if(ap.signals.poseChanged){
			ap.signals.poseChanged.dispatch();
			}
	}
	
	fileInput.onChange(function(fileName,text){
		var mixer=ap.mixer;
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
		mixer.stopAllAction();
		
		callUpdate();
		
	});
	
	return container;
}
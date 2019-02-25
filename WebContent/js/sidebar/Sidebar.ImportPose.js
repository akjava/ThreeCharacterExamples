Sidebar.ImportPose=function(ap){
	var container=new UI.TitlePanel("Import Single Any Frame Clip");
	
	var scope=this;
	
	var row1=new UI.Row();
	container.add(row1);
	
	
	var fileInput=new UI.TextFile(".json");
	row1.add(fileInput);
	
	this.clip=null;
	
	function callUpdate(){
		if(container.logging){
			console.log("Import Pose Clip",scope.clip);
			if(scope.clip!=null){
				scope.clip.tracks.forEach(function(track){
					console.log(track.name);
				});
			}	
				
			
		}
		if(container.logging){
			console.log("sidebar-importPose dispatch poseChanged");
		}
		ap.getSignal("poseChanged").dispatch();
		//boneAttachControler update
		//ikControler resetAllIkTargets
		//translateControler updatePosition
	}
	this.mixer=null;
	ap.signals.loadingModelFinished.add(function(mesh){
		if(scope.mixer!=null){
			scope.mixer.stopAllAction();
		}
		scope.mixer=new THREE.AnimationMixer(mesh);
		if(container.logging){
			console.log("sidebar-importPose create new mixer");
		}
	});
	
	var scope=this;
	fileInput.onChange(function(fileName,text){
		var mixer=scope.mixer;
		mixer.stopAllAction();
		AnimeUtils.resetPose(ap.skinnedMesh);
		AnimeUtils.resetMesh(ap.skinnedMesh);
		if(container.logging){
			console.log("sidebar-importPose resetPose & resetMesh");
		}
		
		if(text==null){
			scope.clip=null;
			callUpdate();
			return;
		}
		
		var json = JSON.parse( text );//TODO catch
		
		
		
		
		var clip=THREE.AnimationClip.parse(json);
		if(json.boneNames!==undefined){
			clip.boneNames=json.boneNames;
		}
		scope.clip=clip;
		
		
		
		mixer.uncacheClip(clip.name);
		mixer.clipAction(clip).play();
		mixer.update();
		
		callUpdate();
		
	});
	
	return container;
}
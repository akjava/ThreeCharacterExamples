Sidebar.TimelinerBones = function ( application ) {
	var ap=application;
	var scope=this;
	var container = new UI.TitlePanel("Timeliner");
	
	
	var row=new UI.Row();
	container.add(row);
	
	var targets=["Mesh Position","Mesh Quaternion","Bone Position","Bone Rotations"];
	var targetList=new UI.List(targets,function(){},targets[0]);
	row.add(targetList);
	
	var commands=["Reset Value","Clear Key","Set Value"];
	var commandList=new UI.List(commands,function(){},commands[0]);
	row.add(commandList);
	
	
	//setDisplayTime is fix some problem.
	function clearKeyFrame(key){
		ap.timeliner.context.dispatcher.fire('keyframe',key,true);
		ap.timeliner.context.controller.setDisplayTime(0);
		ap.timeliner.context.controller.setDisplayTime(ap.timeliner.context.currentTime);
		ap.timeliner.context.dispatcher.fire('keyframe',key);
		ap.timeliner.context.controller.setDisplayTime(0);
		ap.timeliner.context.controller.setDisplayTime(ap.timeliner.context.currentTime);
	}
	function setKeyFrame(key){
		ap.timeliner.context.dispatcher.fire('keyframe',key,true);
	}
	
	var execBt=new UI.Button("Exec").onClick(function(){
		var target=targetList.getValue();
		var command=commandList.getValue();
		
		
		
		if(command==commands[0]){//reset
			switch(target){
			case "Mesh Position":
				ap.skinnedMesh.position.set(0,0,0);
				setKeyFrame(target);
				break;
			case "Mesh Quaternion":
				ap.skinnedMesh.quaternion.set(0,0,0,1);
				setKeyFrame(target);
				break;
			case "Bone Position":
				var initialPosition=new THREE.Vector3().setFromMatrixPosition(
						ap.ikControler.boneAttachControler.defaultBoneMatrixs[0]
						);
				ap.skinnedMesh.skeleton.bones[0].position.copy(initialPosition);
				setKeyFrame(target);
				break;
			case "Bone Rotations":
				//Do all
				var boneList=BoneUtils.getBoneList(ap.skinnedMesh);
				ap.timeliner_boneNames.forEach(function(boneName){
					var index=BoneUtils.findBoneIndexByEndsName(boneList,boneName);
					ap.skinnedMesh.skeleton.bones[index].quaternion.set(0,0,0,1);//TODO copy from default
					setKeyFrame(boneName);
				});
				
				break;
			}
			
			
			
		}else if(command==commands[1]){//clear
			switch(target){
			case "Mesh Position":
				clearKeyFrame(target);
				break;
			case "Mesh Quaternion":
				clearKeyFrame(target);
				break;
			case "Bone Position":
				clearKeyFrame(target);
				break;
			case "Bone Rotations":
				//Do all
				var boneList=BoneUtils.getBoneList(ap.skinnedMesh);
				ap.timeliner_boneNames.forEach(function(boneName){
					clearKeyFrame(boneName);
				});
				
				break;
			}
		}else{
			switch(target){
			case "Mesh Position":
				setKeyFrame(target);
				break;
			case "Mesh Quaternion":
				setKeyFrame(target);
				break;
			case "Bone Position":
				setKeyFrame(target);
				break;
			case "Bone Rotations":
				//Do all
				var boneList=BoneUtils.getBoneList(ap.skinnedMesh);
				ap.timeliner_boneNames.forEach(function(boneName){
					setKeyFrame(boneName);
				});
				
				break;
			}
		}
	});
	row.add(execBt);
	
	return container;
}
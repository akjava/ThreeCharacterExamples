Sidebar.TimelinerBones=function(ap){
	var container=new UI.TitlePanel("Timeliner Bones");
	
	var rootPositionName='Bone Position';
	var clipboard={};
	var scope=this;
	this.logging=false;
	
	function copyFrame(key){
		var value;
		var boneList=BoneUtils.getBoneList(ap.skinnedMesh);
		
		if(key==rootPositionName){
			value=boneList[0].position;
		}else{
			value=boneList[key].quaternion;
		}
		clipboard[String(key)]=value.clone();
	}
	function pasteFrames(){
		ap.getSignal("transformSelectionChanged").dispatch(null);//selected ik not move
		
		var boneList=BoneUtils.getBoneList(ap.skinnedMesh);
		Object.keys(clipboard).forEach(function(key){
			var value=clipboard[key];
			if(key==rootPositionName){
				boneList[0].position.copy(value);
				ap.getSignal("boneTranslateFinished").dispatch(0);
				//ap.timeliner.context.dispatcher.fire('keyframe',key,true);
			}else{
				var index=Number(key);
				boneList[index].quaternion.copy(value);
				ap.getSignal("boneRotationChanged").dispatch(index);
				ap.getSignal("boneRotationFinished").dispatch(index);
				//ap.timeliner.context.dispatcher.fire('keyframe',boneList[index].name,true);
			}
		});
	}
	var keyGroups={};
	var row=new UI.Row();
	container.add(row);

	
	var cutBt=new UI.Button("Cut").onClick(function(){
		var targets=keyGroups[targetList.getValue()];
		var boneList=BoneUtils.getBoneList(ap.skinnedMesh);
			clipboard={};
			targets.forEach(function(target){
				copyFrame(target);
				if(target==rootPositionName){
					Logics.timeliner_clearFrame(ap,target);
				}else{
					var index=Number(target);
					Logics.timeliner_clearFrame(ap,boneList[index].name);
				}
				
			});
	});
	row.add(cutBt);
	var copyBt=new UI.Button("Copy").onClick(function(){
		var targets=keyGroups[targetList.getValue()];
			clipboard={};
			targets.forEach(function(target){
				copyFrame(target);
			});
	});
	row.add(copyBt);
	var pasteBt=new UI.Button("Paste(No care target)").onClick(function(){
			pasteFrames();
	});
	row.add(pasteBt);
	
	
	var targetList=new UI.ListRow("Target",[],function(v){
		//do nothing
	});
	
	container.add(targetList);

	
	ap.signals.loadingModelFinished.add(function(mesh){
		if(ap.timeliner!==undefined){
			//
			ap.timeliner.context.controller.setScene(mesh);
			ap.timeliner.context.dispatcher.fire("time.update",0);//reset,Option not move just update
			return;
		}
		
		
		var onUpdate=function(time){
			ap.getSignal("poseChanged").remove(onPoseChanged);
			ap.getSignal("poseChanged").dispatch();
			ap.getSignal("poseChanged").add(onPoseChanged);
			ap.getSignal("timelinerSeeked").dispatch(time);
			//ap.skinnedMesh.updateMatrixWorld(true);
			ap.signals.rendered.dispatch();//Timeliner mixer and default mixer conflicted and it make fps slow.
		}
		
		
		
		var trackInfo = [
			//Limitedlly only support root;[0]
			{
				type: THREE.VectorKeyframeTrack,
				label:rootPositionName,
				propertyPath: '.bones[0].position',
				initialValue: ap.skinnedMesh.skeleton.bones[0].position.toArray(),
				interpolation: THREE.InterpolateLinear
			},

		];
		var boneNames=[];
		var boneIndices=[];
		//for bones
		var bones=BoneUtils.getBoneList(ap.skinnedMesh);
		for(var i=0;i<bones.length;i++){
			var name=bones[i].name;
			if(Mbl3dUtils.isFingerBoneName(name) || Mbl3dUtils.isTwistBoneName(name)){
				continue;
			}
			var info={type: THREE.QuaternionKeyframeTrack,
					label:name,
					propertyPath:".bones["+i+"].quaternion",
					initialValue: [ 0, 0, 0, 1 ],//TODO check
					interpolation: THREE.InterpolateLinear
					}
			trackInfo.push(info);
			boneIndices.push(i);
			boneNames.push(name);
		}
		ap.timeliner_boneNames=boneNames;
		
		var timeliner=new Timeliner( new THREE.TimelinerController( ap.skinnedMesh, trackInfo, onUpdate ) );
		ap.timeliner=timeliner;
		
		timeliner.context.dispatcher.fire('totalTime.update',3);
		timeliner.context.timeScale=120;
		timeliner.context.fileName="timeline_mesh_animation";
		
		function getBoneName(index){
			return BoneUtils.getBoneList(ap.skinnedMesh)[index].name;
		}
		
		//listers
		ap.getSignal("boneTranslateFinished").add(function(index){
			console.log("translated",index);
			ap.timeliner.context.dispatcher.fire('keyframe',rootPositionName,true);
		});
		function onPoseChanged(){
			if(scope.logging)
				console.log("pose changed");
			
			ap.timeliner.context.dispatcher.fire('keyframe',rootPositionName,true);
			ap.timeliner_boneNames.forEach(function(name){
				ap.timeliner.context.dispatcher.fire('keyframe',name,true);
			});
		}
		
		ap.getSignal("poseChanged").add(onPoseChanged);
		ap.getSignal("boneRotationFinished").add(function(index){
			if(scope.logging)
				console.log("bone changed",index);
			
			if(boneIndices.indexOf(index)!=-1)
				ap.timeliner.context.dispatcher.fire('keyframe',getBoneName(index),true);
			else
				console.log("ignore index "+index);
		});
		


		
		keyGroups["Both"]=[rootPositionName];
		keyGroups["Position"]=[rootPositionName];
		keyGroups["Bone Rotation"]=[];
		boneIndices.forEach(function(index){
			keyGroups["Both"].push(index);
			keyGroups["Bone Rotation"].push(index);
		});
		targetList.setList(Object.keys(keyGroups));
		targetList.setValue("Both");
		
	});
	
	
	return container;
}
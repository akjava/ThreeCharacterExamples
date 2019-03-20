var HumanoidBoneControler=function(ap){
	this.boneNames=[];
	this.boneNames=this.boneNames.concat(HumanoidBoneControler.bodyHumanBoneNames);
	this.boneNames=this.boneNames.concat(HumanoidBoneControler.leftArmBoneNames);
	this.boneNames=this.boneNames.concat(HumanoidBoneControler.rightArmBoneNames);
	this.boneNames=this.boneNames.concat(HumanoidBoneControler.leftLegBoneNames);
	this.boneNames=this.boneNames.concat(HumanoidBoneControler.rightLegBoneNames);
	
	this.boneNames=this.boneNames.concat(VrmUtils.getHumanoidFingerBoneNames());
	//TODO support fingers or etc
	
	var scope=this;
	this.logging=false;
	this.allBoneList=null;
	this.humanoidBoneMap={};
	this.humanoidBoneMapReverse={};
	
	this.rootPosition=new THREE.Vector3();//for limited root position;
	
	this.humanoidBones=[];
	this.boneNames.forEach(function(name){
		console.log(name);
		var dummyBone={name:name,quaternion:new THREE.Quaternion(),position:new THREE.Vector3()};
		scope.humanoidBones.push(dummyBone);
	});
	
	
	ap.getSignal("loadingModelFinished").add(function(model){
		
		var vrm=ap.vrm;
		var node=VrmUtils.getNodes(vrm);
		var humanoid=VrmUtils.getHumanoid(vrm);
		
		
		scope.allBoneList=model.skeleton.bones;
		
		scope.humanoidBoneMap={};
		scope.humanoidBoneMapReverse={};
		humanoid.humanBones.forEach(function(hb){
			var name=VrmUtils.getNodeBoneName(vrm,hb.node);
			if(name){
				var index=BoneUtils.findBoneIndexByEndsName(scope.allBoneList,name);
				if(index!=-1){
					console.log(scope.humanoidBones);
					var humanBone=BoneUtils.findBoneByEndsName(scope.humanoidBones,hb.bone);
					if(humanBone==null){
						console.log("HumanoidBoneControler:not found ",name);
						
					}else{
						scope.humanoidBoneMap[String(index)]=humanBone;
						console.log(humanBone);
						scope.humanoidBoneMapReverse[humanBone.name]=String(index);
					}
					
				}else{
					console.log("HumanoidBoneControler:not found in  bone list skipped ",name);
				}
			}else{
				console.log("HumanoidBoneControler:not found in node lsit skipped ",hb);
			}
			
		});
		scope.resetBones();
		
		if(scope.logging){
			console.log("humanoidBoneMap",scope.humanoidBoneMap);
		}
		
	},1);//before timeliner
	
	ap.getSignal("boneRotationChanged").add(function(index){
		if(index){
			var target=scope.humanoidBoneMap[String(index)];
			
			if(target){
				target.quaternion.copy(scope.allBoneList[index].quaternion);
			}
		}
	});
	ap.getSignal("boneTranslateChanged").add(function(index){
		if(index==0){
			
			scope.rootPosition.copy(scope.allBoneList[0].position);
			
			if(scope.logging)
				console.log("boneTranslateChanged",scope.rootPosition);
		}
	});
	
}

	
HumanoidBoneControler.prototype.resetBones=function(){
	var scope=this;
	
	this.rootPosition.copy(this.allBoneList[0].position);
	
	this.humanoidBones.forEach(function(humanoidBone){
		var index=scope.humanoidBoneMapReverse[humanoidBone.name];
		var bone=scope.allBoneList[index];
		if(bone){
			humanoidBone.quaternion.copy(bone.quaternion);
			humanoidBone.position.copy(bone.position);
		}else{
			humanoidBone.quaternion.set(0,0,0,1);
			humanoidBone.position.set(0,0,0);
		}
	});
	if(this.logging)
		console.log("root pos reset",scope.rootPosition);
}

HumanoidBoneControler.prototype.getHumanoidBoneName=function(index){
	var target=this.humanoidBoneMap[String(index)];
	if(target){
		return target.name;
	}else{
		return null;
	}
}

HumanoidBoneControler.prototype.update=function(){
	var scope=this;
	Object.keys(this.humanoidBoneMap).forEach(function(index){
		var target=scope.humanoidBoneMap[String(index)];
		if(target){
			scope.allBoneList[index].quaternion.copy(target.quaternion);
		}
		
	});	
	
	//TODO support other position;
	if(this.logging)
		console.log("root pos copied",scope.rootPosition);
	this.allBoneList[0].position.copy(this.rootPosition);
}


HumanoidBoneControler.bodyHumanBoneNames=["hips","spine","chest","upperChest","neck","head"];;
HumanoidBoneControler.leftArmBoneNames=["leftShoulder","leftUpperArm","leftLowerArm","leftHand"];
HumanoidBoneControler.rightArmBoneNames=["rightShoulder","rightUpperArm","rightLowerArm","rightHand"];
HumanoidBoneControler.leftLegBoneNames=["leftUpperLeg","leftLowerLeg","leftFoot"];
HumanoidBoneControler.rightLegBoneNames=["rightUpperLeg","rightLowerLeg","rightFoot"];

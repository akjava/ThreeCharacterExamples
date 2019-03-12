var HumanoidBoneControler=function(ap){
	this.boneName=[];
	this.boneName=this.boneName.concat(HumanoidBoneControler.bodyHumanBoneNames);
	this.boneName=this.boneName.concat(HumanoidBoneControler.leftArmBoneNames);
	this.boneName=this.boneName.concat(HumanoidBoneControler.rightArmBoneNames);
	this.boneName=this.boneName.concat(HumanoidBoneControler.leftLegBoneNames);
	this.boneName=this.boneName.concat(HumanoidBoneControler.rightLegBoneNames);
	//TODO support fingers
	
	this.boneNameMap={};
	
	ap.getSignal("loadingModelFinished").add(function(model){
		this.boneNameMap={};
		var bones=model.skeleton.bones;
		for(var i=0;i<bones;i++){
			
		}
		
		
	});
}

HumanoidBoneControler.prototype.copyTo=function(bone){
	
}


HumanoidBoneControler.prototype.bodyHumanBoneNames=["hips","spine","chest","upperChest","neck","head"];;
HumanoidBoneControler.prototype.leftArmBoneNames=["leftShoulder","leftUpperArm","leftLowerArm","leftHand"];
HumanoidBoneControler.prototype.rightArmBoneNames=["rightShoulder","rightUpperArm","rightLowerArm","rightHand"];
HumanoidBoneControler.prototype.leftLegBoneNames=["leftUpperLeg","leftLowerLeg","leftFoot"];
HumanoidBoneControler.prototype.rightLegBoneNames=["rightUpperLeg","rightLowerLeg","rightFoot"];

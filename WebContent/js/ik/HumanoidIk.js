var HumanoidIk=function(ap){
	
	this.ikTargets={};
	this.ap=ap;
	this.endSites=[];
	var scope=this;
	this.bodyHumanBoneNames=["hips","spine","chest","upperChest","neck","head"];
	
	var nodes=ap.vrm.parser.json.nodes;
	var humanBones=ap.vrm.userData.gltfExtensions.VRM.humanoid.humanBones;
	
	function getBoneName(index){
		VrmUtils.getNodeBoneName(ap.vrm,index);
	}

	var humanBoneMap={};
	humanBones.forEach(function(humanBone){
		//TODO check
		humanBoneMap[humanBone.bone]=getBoneName(humanBone.node);
	});
	this.humanBoneMap=humanBoneMap;
	
	if(ap.ikControler.logging){
		console.log(humanBoneMap);
	}
	
	
	this.boneList=BoneUtils.getBoneList(ap.skinnedMesh);
	
	
	
	
	var headIkHumanBoneNames=["spine","chest","upperChest","neck","head"];
	
	var headBoneNames=[];
	headIkHumanBoneNames.forEach(function(name){
		var boneName=humanBoneMap[name];
		if(boneName){
			headBoneNames.push(boneName);
		}else{
			//possible not exist
		}
	});
	this.headBoneNames=headBoneNames;
	this.registIk(this.ikTargets,"Head",headBoneNames);
	
	
	function resolveMapBoneName(humanBoneNames){
		var result=[];
		humanBoneNames.forEach(function(name){
			var boneName=humanBoneMap[name];
			if(boneName){
				
				var bone=BoneUtils.findBoneByEndsName(scope.boneList,boneName);
				if(bone!=null){
					result.push(boneName);
				}else{
					console.log("humanBoneMap:found on map not in bonelist",boneName);
				}
				
			}else{
				//possible not exist
				console.log("humanBoneMap:not map found",name);
			}
		});
		return result;
	}
	
	this.leftArmBoneNames=resolveMapBoneName(["leftShoulder","leftUpperArm","leftLowerArm","leftHand"]);
	this.registIk(this.ikTargets,"LeftArm",this.leftArmBoneNames);
	
	this.rightArmBoneNames=resolveMapBoneName(["rightShoulder","rightUpperArm","rightLowerArm","rightHand"]);
	this.registIk(this.ikTargets,"rightArm",this.rightArmBoneNames);
	
	this.leftLegBoneNames=resolveMapBoneName(["leftUpperLeg","leftLowerLeg","leftFoot"]);
	this.registIk(this.ikTargets,"LeftLeg",this.leftLegBoneNames);

	this.rightLegBoneNames=resolveMapBoneName(["rightUpperLeg","rightLowerLeg","rightFoot"]);
	this.registIk(this.ikTargets,"rightLeg",this.rightLegBoneNames);
	
	
	this.hipBoneNames=resolveMapBoneName(["hips","spine"]);
	if(this.hipBoneNames.length>1){
		this.registIk(this.ikTargets,"hip",this.hipBoneNames);
	}
	
	
	/*//this.registIk(this.ikTargets,"Hip",["root","spine01"]);//
	this.registIk(this.ikTargets,"Hip",["pelvis","spine01"]);//
	this.registIk(this.ikTargets,"Head",["spine01","spine02","spine03","neck","head"]);
	//this.registIk(this.ikTargets,"LeftArm",["clavicle_L","upperarm_L","lowerarm_L","hand_L","middle00_L"]);
	//this.registIk(this.ikTargets,"RightArm",["clavicle_R","upperarm_R","lowerarm_R","hand_R","middle00_R"]);
	this.registIk(this.ikTargets,"LeftArm",["clavicle_L","upperarm_L","lowerarm_L","hand_L"]);
	this.registIk(this.ikTargets,"RightArm",["clavicle_R","upperarm_R","lowerarm_R","hand_R"]);
	this.registIk(this.ikTargets,"LeftLeg",["thigh_L","calf_L","foot_L"]);
	this.registIk(this.ikTargets,"hip",["thigh_R","calf_R","foot_R"]);*/
	
	this.initlimitBone();
	
}

HumanoidIk.prototype.registIk=function(ikTargets,ikName,jointNames){
	var ap=this.ap;
	
	
	var indices=[];
	ap.ikControler.iks[ikName]=indices;
	
	var scope=this;
	
	jointNames.forEach(function(name){

		var index=BoneUtils.findBoneIndexByEndsName(scope.boneList,name);
		
		if(index==-1){
			console.error("registIk:bone not contain,"+name);
		}
		indices.push(index);
	});
	
	//add endsite
	var list=ap.boneAttachControler.containerList;
	/*
	var diff=list[indices[indices.length-1]].position.clone().sub(list[indices[indices.length-2]].position);
	diff.setLength(10);*/
	//diff.add(list[indices[indices.length-1]].position);
	
	var endsite=new THREE.Mesh(new THREE.BoxGeometry(2,2,2),new THREE.MeshBasicMaterial({color:0x008800,depthTest:false,transparent:true,opacity:.5}));
	endsite.renderOrder = 2;
	list[indices[indices.length-1]].add(endsite);
	list[indices[indices.length-1]].userData.endsite=endsite;
	//endsite.position.copy(diff);
	endsite.material.visible=false;
	endsite.userData.endSiteIndex=indices[indices.length-1];//TODO switch to name
	endsite.userData.endSiteParentIndex=indices[indices.length-2];//TODO switch to name
	
	var joint=AppUtils.lineTo(list[indices[indices.length-1]],endsite);
	joint.material.depthTest=false;
	joint.material.transparent=true;
	joint.material.opacity=0.25;
	joint.renderOrder = 2;
	joint.material.visible=false;
	endsite.userData.joint=joint;
	
	scope.endSites.push(endsite);
	
	var ikBox=new THREE.Mesh(new THREE.BoxGeometry(5,5,5),new THREE.MeshBasicMaterial({color:0x880000,depthTest:false,transparent:true,opacity:.5}));
	ikBox.name="ik-c-"+ikName;
	ikBox.renderOrder = 1;
	var index=indices.length-1;
	//ikBox.position.copy(ap.ikControler.boneAttachControler.containerList[indices[indices.length-1]].position);
	ikBox.ikName=ikName;//TODO move userData
	ikBox.userData.transformSelectionType="BoneIk";
	if(ap.objects==undefined){
		ap.objects=[];
		if(ap.ikControler.logging){
			console.log("HumanoidIk initialize ap.objects");
		}
	}
	ap.objects.push(ikBox);//TODO do at init for switch
	ikTargets[ikName]=ikBox;
	ap.scene.add(ikBox);

	
}


		 HumanoidIk.prototype.limitBone=function(boneList,humanoidBoneName,minX,minY,minZ,maxX,maxY,maxZ){
			 
			var endName=this.humanBoneMap[humanoidBoneName];
			if(!endName){
				endName=humanoidBoneName;//maybe root
				console.log("humanoidBoneName not exist map.Use directly name ",humanoidBoneName);
			}
			
			var ap=this.ap;
			var name=endName;

			
			ap.ikControler.ikLimitMin[name]={};
			ap.ikControler.ikLimitMax[name]={};
			ap.ikControler.ikLimitMin[name].x=minX;
			ap.ikControler.ikLimitMin[name].y=minY;
			ap.ikControler.ikLimitMin[name].z=minZ;
			ap.ikControler.ikLimitMax[name].x=maxX;
			ap.ikControler.ikLimitMax[name].y=maxY;
			ap.ikControler.ikLimitMax[name].z=maxZ;
			
		}

HumanoidIk.prototype.initlimitBone=function(){
			var ap=this.ap;
			var boneList=this.boneList;
			
			//body
			this.limitBone(boneList,"root",-180,-180,-180,180,180,180);
			this.limitBone(boneList,"hips",-180,-180,-180,180,180,180);
			this.limitBone(boneList,"spine",-15,-45,-30,15,45,30);
			this.limitBone(boneList,"chest",-45,-45,-30,45,45,30);
			this.limitBone(boneList,"upperChest",-45,-45,-30,45,45,30);
			this.limitBone(boneList,"neck",-45,-45,-10,45,45,10);
			this.limitBone(boneList,"head",-15,-15,-20,15,15,20);
			
			this.limitBone(boneList,"leftShoulder",0,0,0,0,15,45);
			this.limitBone(boneList,"leftUpperArm",-45,-75,-85,45,45,45);
			this.limitBone(boneList,"leftLowerArm",-0,-150,0,0,0,0);
			this.limitBone(boneList,"leftHand",0,0,-65,0,45,45);
			
			this.limitBone(boneList,"rightShoulder",0,-15,-45,0,0,0);
			this.limitBone(boneList,"rightUpperArm",-45,-45,-45,45,75,85);
			this.limitBone(boneList,"rightLowerArm",0,0,0,0,150,0);
			this.limitBone(boneList,"rightHand",0,-45,-45,0,0,65);
			
			
			
			
			this.limitBone(boneList,"leftUpperLeg",-120,0,-75,60,0,75);
			this.limitBone(boneList,"leftLowerLeg",-160,0,0,0,0,0);
			this.limitBone(boneList,"leftFoot",-15,-5,-5,15,5,5);
			
			this.limitBone(boneList,"rightUpperLeg",-120,0,-75,60,0,75);
			this.limitBone(boneList,"rightLowerLeg",-160,0,0,0,0,0);
			this.limitBone(boneList,"rightFoot",-15,-5,-5,15,5,5);
			
			/*boneList.forEach(function(bone){
				limitBone(boneList,bone.name,-180,-180,-180,180,180,180);
			});*/
			
			/*
			this.limitBone(boneList,"thigh_R",-120,0,-70,60,0,75);
			this.limitBone(boneList,"calf_R",0,0,0,160,0,0);
			this.limitBone(boneList,"foot_R",-15,-5,-5,15,5,5);
			
			this.limitBone(boneList,"hand_R",0,-45,-45,0,0,65);
			this.limitBone(boneList,"lowerarm_R",0,0,0,0,150,0);
			this.limitBone(boneList,"upperarm_R",-45,-45,-45,45,75,85);
			this.limitBone(boneList,"clavicle_R",0,-15,-45,0,0,0);
			
			
			this.limitBone(boneList,"thigh_L",-120,0,-70,60,0,75);
			this.limitBone(boneList,"calf_L",0,0,0,160,0,0);
			this.limitBone(boneList,"foot_L",-15,-5,-5,15,5,5);
			
			this.limitBone(boneList,"hand_L",0,0,-65,0,45,45);
			this.limitBone(boneList,"lowerarm_L",-0,-150,0,0,0,0);
			this.limitBone(boneList,"upperarm_L",-45,-75,-85,45,45,45);
			this.limitBone(boneList,"clavicle_L",0,0,0,0,15,45);
			
			
			this.limitBone(boneList,"root",-180,-180,-180,180,180,180);
			this.limitBone(boneList,"pelvis",-180,-180,-180,180,180,180);
			this.limitBone(boneList,"spine01",-15,-45,-30,15,45,30);
			this.limitBone(boneList,"spine02",-45,-45,-30,45,45,30);
			this.limitBone(boneList,"spine03",-45,-45,-30,45,45,30);
			this.limitBone(boneList,"neck",-45,-45,-10,45,45,10);
			this.limitBone(boneList,"head",-15,-15,-20,15,15,20);*/
			
			
			
			
			 
			//copy to default
			Object.keys(ap.ikControler.ikLimitMin).forEach(function(key){
				ap.ikControler.ikDefaultLimitMin[key]={};
				ap.ikControler.ikDefaultLimitMin[key].x=ap.ikControler.ikLimitMin[key].x;
				ap.ikControler.ikDefaultLimitMin[key].y=ap.ikControler.ikLimitMin[key].y;
				ap.ikControler.ikDefaultLimitMin[key].z=ap.ikControler.ikLimitMin[key].z;
				ap.ikControler.ikDefaultLimitMax[key]={};
				ap.ikControler.ikDefaultLimitMax[key].x=ap.ikControler.ikLimitMax[key].x;
				ap.ikControler.ikDefaultLimitMax[key].y=ap.ikControler.ikLimitMax[key].y;
				ap.ikControler.ikDefaultLimitMax[key].z=ap.ikControler.ikLimitMax[key].z;
			});
			
			//send ref
			if(ap.signals.boneLimitLoaded){
				ap.signals.boneLimitLoaded.dispatch(ap.ikControler.ikLimitMin,ap.ikControler.ikLimitMax);
			}else{
				console.log("No ap.signals.boneLimitLoaded,Skipped Dispatch");
			}
			
		}
		

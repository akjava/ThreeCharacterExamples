var HumanoidFingerIk=function(ap){
	//TODO refactoring
	this.ikTargets={};
	this.ap=ap;
	this.endSites=[];
	var scope=this;
	this.bodyHumanBoneNames=["hips","spine","chest","upperChest","neck","head"];
	
	var nodes=ap.vrm.parser.json.nodes;
	var humanBones=ap.vrm.userData.gltfExtensions.VRM.humanoid.humanBones;
	
	function getBoneName(index){
		return VrmUtils.getNodeBoneName(ap.vrm,index);
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
	
	var parts=["Thumb","Index","Middle","Ring","Little"];
	var levels=["Proximal","Intermediate","Distal"];
		parts.forEach(function(part){
			var names=[];
			levels.forEach(function(level){
				names.push("left"+part+level);
			});
			var resolved=resolveMapBoneName(names);
			scope.registIk(scope.ikTargets,part,resolved);
		});
	
	
	
	
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

HumanoidFingerIk.prototype.registIk=function(ikTargets,ikName,jointNames){
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
	
	var endsite=new THREE.Mesh(new THREE.BoxGeometry(.5,.5,.5),new THREE.MeshBasicMaterial({color:0x008800,depthTest:false,transparent:true,opacity:.5}));
	endsite.renderOrder = 2;
	list[indices[indices.length-1]].add(endsite);
	list[indices[indices.length-1]].userData.endsite=endsite;
	//endsite.position.copy(diff);
	endsite.material.visible=false;
	endsite.userData.endSiteIndex=indices[indices.length-1];//TODO switch to name
	endsite.userData.endSiteParentIndex=indices[indices.length-2];//TODO switch to name
	endsite.userData.length=1;
	var joint=AppUtils.lineTo(list[indices[indices.length-1]],endsite);
	joint.material.depthTest=false;
	joint.material.transparent=true;
	joint.material.opacity=0.25;
	joint.renderOrder = 2;
	joint.material.visible=false;
	endsite.userData.joint=joint;
	
	scope.endSites.push(endsite);
	
	var ikBox=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial({color:0x880000,depthTest:false,transparent:true,opacity:.5}));
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


		 HumanoidFingerIk.prototype.limitBone=function(boneList,humanoidBoneName,minX,minY,minZ,maxX,maxY,maxZ){
			 
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

HumanoidFingerIk.prototype.initlimitBone=function(){
			var ap=this.ap;
			var boneList=this.boneList;
			var scope=this;
			
			var parts=["Thumb","Index","Middle","Ring","Little"];
			var levels=["Proximal","Intermediate","Distal"];
				parts.forEach(function(part){
					
					levels.forEach(function(level){
						var name="left"+part+level;
						if(part=="Thumb"){
							scope.limitBone(boneList,name,-90,-30,-90,90,30,90);
						}else{
							if(level=="Proximal"){
								scope.limitBone(boneList,name,0,-30,-30,0,30,90);
							}else{
								scope.limitBone(boneList,name,0,0,0,0,0,90);
							}
						}
					});
					
				});
				
			
			
			
			
			
			 
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
		

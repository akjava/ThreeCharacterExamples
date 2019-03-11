/*
 * for vrm
 */
var SecondaryAnimationControler=function(ap){
	this.ap=ap
	this._pos=new THREE.Vector3();
	
	this.logging=true;
	
	this.lockX=false;
	this.lockY=false;
	this.lockZ=false;
	
	this.allowAngleX=30;
	this.allowAngleY=30;
	this.allowAngleZ=30;
	
	this.baseHitRadius=100;
	this.baseStiffiness=250;
	
	this.damping=1;
	//this.stiffness=100;
	this.bodyDamping=0.5;
	
	this.mass=1;
	
	this._enabled=true;
	this.allSpheres=[];
	this.colliderSpheres=[];
	this.boneGroups=undefined;
	
	this.scale=100;
	this.minSize=0.5;//or broken
	
	this.maxDistanceRatio=2;
	this.enableLimitDistance=true;
	
	this.addEndsite=false;
	
	
	this.targetSphere2=true;
	this.isRootStatic=true;
	
	this.endSiteRatio=0.5;
	
	this.connectHorizontal=false;
	this.hconstraint=[];
	
}

SecondaryAnimationControler.prototype.initialize=function(ammoControler,boneAttachControler){
	var scope=this;
	this.ammoControler=ammoControler;
	this.boneAttachControler=boneAttachControler;
	
	//TODO parse
}


SecondaryAnimationControler.prototype.addBoneLinks=function(links,hitRadius,group,hcontainer){
	//console.log(links,hitRadius,stiffiness);
	var scope=this;
	var bac=this.boneAttachControler;
	var rootContainer=null;
	var hitR=scope.baseHitRadius*hitRadius;
	
	var spheres=[];
	links.forEach(function(boneName){
		var isRoot=false;
		var bone=BoneUtils.findBoneByEndsName(bac.boneList,boneName);
		var position=null;
		var bonePosition=bac.getContainerByBoneName(boneName).position.clone();
		if(rootContainer==null){
			
			rootContainer=bac.getContainerByBoneName(bone.parent.name);
			isRoot=true;
			position=bonePosition.sub(rootContainer.position.clone());
		}else{
			position=bonePosition;
		}
		
		var mass=scope.isRootStatic&&isRoot?0:scope.mass;
		
		var sphere=scope.createSphereBox(hitR,mass,position);//no 0 style not good at skirt
		sphere.name=boneName+"-pos";
		spheres.push(sphere);
		scope.allSpheres.push(sphere);
		if(isRoot){
			//Mesh to Body
			rootContainer.add(sphere.getMesh());
			if(!scope.isRootStatic){
				AmmoUtils.setLinearFactor(sphere.getBody(),1,1,1);
				AmmoUtils.setAngularFactor(sphere.getBody(),1,1,1);
				sphere.syncBone=true;
				sphere.rotationSync=false;
			}
				
			
			sphere.syncWorldMatrix=true;
			sphere.syncBodyToMesh=false;
			sphere.getMesh().updateMatrixWorld(true);
			sphere.syncTransform(scope.ammoControler);
			
			sphere.isRoot=true;
			//
		}else{
			sphere.syncBone=true;
			sphere.syncWorldMatrix=false;
			sphere.syncTransform(scope.ammoControler);
			sphere.getMesh().updateMatrixWorld(true);
		}
	});
	var bodyDamping=scope.bodyDamping;
	for(var i=0;i<links.length;i++){
		var boneName=links[i];
		var bone=BoneUtils.findBoneByEndsName(bac.boneList,boneName);
		var sphere1=spheres[i];
		var sphere2=null;
		var isLeaf=false;
		sphere1.getMesh().userData.group=group;
		sphere1.getBody().setDamping(bodyDamping,bodyDamping);
		
		if(i<links.length-1){
			sphere2=spheres[i+1];
		}else{
			//create endsite
			if(this.addEndsite){
				var parentName=bone.parent.name;
				var parentPos=bac.getContainerByBoneName(parentName).position.clone();
				var bonePos=bac.getContainerByBoneName(boneName).position.clone();
				var endSitePos=bonePos.clone().sub(parentPos).multiplyScalar(this.endSiteRatio).add(bonePos);
				sphere2=this.createSphereBox(hitR,scope.mass,endSitePos);
				scope.allSpheres.push(sphere2);
				sphere2.syncBone=true;
				sphere2.syncWorldMatrix=false;
				sphere2.syncTransform(scope.ammoControler);
				sphere2.getMesh().updateMatrixWorld(true);
				isLeaf=true;
				sphere2.getMesh().userData.group=group;
				
				//I'm not sure
				sphere2.getBody().setDamping(bodyDamping,bodyDamping);
			}
			
		}
		if(this.targetSphere2){
			if(sphere2!=null)
				sphere2.targetBone=bone;
		}else
			sphere1.targetBone=bone;
		
		if(!sphere1.isRoot)
			sphere1.positionTargetBone=bone;
		
		bone.userData.defaultPosition=bone.position.clone();
		if(sphere2!=null){
			sphere2.name=sphere2.name+":"+bone.name+"-rot";
			var constraint=scope.makeConstraint(sphere1,sphere2,group.stiffiness);
			sphere2.getMesh().userData.constraint=constraint;
			sphere2.getMesh().userData.dof=constraint.constraint;
			
		}
		
		
		var list=hcontainer[i];
		if(list==undefined){
			list=[];
			hcontainer.push(list);
		}
		list.push(sphere1);
	}
}

SecondaryAnimationControler.prototype.findSphereByName=function(name){
	var match=null;
	this.allSpheres.forEach(function(sphere){
		//console.log(sphere.name,name);
		if(sphere.name==name){
			match= sphere;
		}
	})
	return match;
}

SecondaryAnimationControler.prototype.createSphereBox=function(size,mass,position,color,isCollid){
	
	isCollid=isCollid==undefined?false:isCollid;
	
	color=color==undefined?0x000088:color;
	 if(!size){
		 console.error("need size");
	 }
	 if(!mass && mass!==0){
		 console.error("need mass");
	 }
	 if(size<this.minSize){
		 size=this.minSize;
	 }
	 var group=isCollid?2:1;
	 var mask=isCollid?1:2;
	
	 var sphere=this.ammoControler.createSphere(size, mass, position.x,position.y,position.z, 
						new THREE.MeshPhongMaterial({color:color}),group,mask
				);
	 return sphere;
}

SecondaryAnimationControler.prototype.makeConstraint=function(box1,box2,stiffiness){
	
	 var box1Pos=new THREE.Vector3().setFromMatrixPosition(box1.getMesh().matrixWorld);
	 var box2Pos=new THREE.Vector3().setFromMatrixPosition(box2.getMesh().matrixWorld);
	 var diff=box2Pos.sub(box1Pos);
	
	 box2.parent=box1;
	 box2.maxDistance=new THREE.Vector3().distanceTo(diff)*this.maxDistanceRatio;
	
	 
	 var body=box2.getBody();
	
	 
	 AmmoUtils.setLinearFactor(body,1,1,1);
	 var factorX=this.lockX==true?0:1;
	 var factorY=this.lockY==true?0:1;
	 var factorZ=this.lockZ==true?0:1;
	 AmmoUtils.setAngularFactor(body,factorX,factorY,factorZ);//no z
	 
	 
	
	 body.setActivationState(AmmoUtils.DISABLE_DEACTIVATION);
	 
	 //connect
	var frameInA=application.ammoControler.makeTemporaryTransform();
	var frameInB=application.ammoControler.makeTemporaryTransform();
	AmmoUtils.copyFromVector3(frameInA.getOrigin(),diff.clone().negate());//I'm not sure use negate
	var constraint=application.ammoControler.createGeneric6DofSpringConstraint(
			box2,box1, frameInA,frameInB,false,true);
	
	var dof=constraint.constraint;
	
	AmmoUtils.seteAllEnableSpring(dof,true);
	var sti=this.baseStiffiness*stiffiness;
	
	AmmoUtils.seteAllStiffness(dof,sti);
	AmmoUtils.seteAllDamping(dof,this.damping);
	
	var limit=0;//TODO
	dof.setLinearLowerLimit(application.ammoControler.makeTemporaryVector3(-limit, -limit,-limit));
	dof.setLinearUpperLimit(application.ammoControler.makeTemporaryVector3(limit, limit, limit));

	var angleX=THREE.Math.degToRad(this.allowAngleX);
	var angleY=THREE.Math.degToRad(this.allowAngleY);
	var angleZ=THREE.Math.degToRad(this.allowAngleZ);
	
	dof.setAngularLowerLimit(application.ammoControler.makeTemporaryVector3(-angleX, -angleY,-angleZ));
	dof.setAngularUpperLimit(application.ammoControler.makeTemporaryVector3(angleX, angleY, angleZ));
	
	return constraint;
	
	
}


SecondaryAnimationControler.prototype.setEnabled=function(v){
	this._enabled=v;
}

SecondaryAnimationControler.prototype._destroySecondaryAnimation=function(){
	var scope=this;
	 function destroy(box){
		 if(box.getMesh().userData.constraint)
			 scope.ammoControler.destroyConstraintAndLine(box.getMesh().userData.constraint);
		 
		 scope.ammoControler.destroyBodyAndMesh(box);
	 }
	 
	this.allSpheres.forEach(function(sphere){
		destroy(sphere);
	});
	this.allSpheres=[];
	
	this.colliderSpheres.forEach(function(sphere){
		destroy(sphere);
	});
	this.colliderSpheres=[];
	
	this.hconstraint.forEach(function(constraint){
		scope.ammoControler.destroyConstraintAndLine(constraint);
	});
	this.hconstraint=[];
	
	
}

SecondaryAnimationControler.prototype.dispose=function(){
	 this._destroySecondaryAnimation();
	 if(this.headBox){
		 this.ammoControler.destroyBodyAndMesh(this.headBox);
		 this.headBox=null;
	 }
}

/*SecondaryAnimationControler.prototype.getDistance=function(isBreastR){
	var target=isBreastR==true?this.breastBoxR:this.breastBoxL;
	var pos=target.getMesh().userData.breastBase.getMesh().getWorldPosition(this._pos);
	var distance=pos.distanceTo(target.getMesh().position);
	return distance;
}*/

SecondaryAnimationControler.prototype.update=function(force){
	if(!force){
		if(!this._enabled || !this.ap.ammoControler.isEnabled()){
			return;
		}
	}
	
	var scope=this;
	
	if(this.enableLimitDistance){
		this.allSpheres.forEach(function(sphere){
			if(sphere.parent){
				var parent=sphere.parent;
				var parentPos;
				if(parent.syncWorldMatrix){
					parentPos=new THREE.Vector3().setFromMatrixPosition(parent.getMesh().matrixWorld);
				}else{
					parentPos=parent.getMesh().position;
				}
					 
				
				var distance=sphere.getMesh().position.clone().distanceTo(parentPos);
				
				if(distance>sphere.maxDistance){
					
					//console.log("max",sphere.name);
					var divided=distance/sphere.maxDistance;
					var diff=sphere.getMesh().position.clone().sub(parentPos);
					diff.divideScalar(divided).add(parentPos);
					
					AmmoUtils.setPosition(sphere.getBody(),diff.x,diff.y,diff.z);
					sphere.syncTransform(scope.ap.ammoControler);
					
					//AmmoUtils.setLinearVelocity(sphere.getBody(),new THREE.Vector3(0,0,0));
					//AmmoUtils.setAngularVelocity(sphere.getBody(),new THREE.Vector3(0,0,0));
					console.log("reset");
				}
			}
		});
	}
	
	
	
/*	var scope=this;
	if(this.autoResetPosition && this.breastBoxR && this.breastBoxL){
		function doReset(box){
			var pos=box.getMesh().userData.breastBase.getMesh().getWorldPosition(scope._pos);
			var distance=pos.distanceTo(box.getMesh().position);
			if(distance>scope.maxDistance){
				if(scope.logging)
					console.log("BreastControler:force reseted");
				
				AmmoUtils.setPosition(box.getBody(),pos.x,pos.y,pos.z);
			}
		}
		doReset(this.breastBoxR);
		doReset(this.breastBoxL);
	}*/
}


SecondaryAnimationControler.prototype.updateSpringValues=function(){
	this.setSpringValues(this.baseStiffiness,this.damping,this.bodyDamping);
}
SecondaryAnimationControler.prototype.setSpringValues=function(baseStiffiness,damping,bodyDamping){
	function change(box){
		var dof=box.getMesh().userData.dof;
		var stiffiness=box.getMesh().userData.group.stiffiness;
		//var bdamping=1.0-box.getMesh().userData.group.dragForce;
		if(dof){
			AmmoUtils.seteAllStiffness(dof,baseStiffiness*stiffiness);
			AmmoUtils.seteAllDamping(dof,damping);
			box.getBody().setDamping(bodyDamping,bodyDamping);
		}
		
	}
	
	this.allSpheres.forEach(function(sphere){
		change(sphere);
	});
}

SecondaryAnimationControler.prototype.newSecondaryAnimation=function(){
	
	if(!this.colliderGroups){
		console.log("SecondaryAnimationControler:parse vrm first");
		return;
	}
	
	var enabled=this.ammoControler.isEnabled();
	this.ammoControler.setEnabled(false);
	this.ap.skinnedMesh.skeleton.pose();
	this.ap.boneAttachControler.update(true);
	var scope=this;
	
	this._destroySecondaryAnimation();
	//this.ammoControler.printCount();
	
	
	scope.newColliderGroups();
	 
	 
	 this.boneGroups.forEach(function(group){
		 var hlinks=[];
		 group.boneLinkList.forEach(function(linkList){
			 scope.addBoneLinks(linkList,group.hitRadius,group,hlinks);
		 });
	 if(scope.connectHorizontal){
		 if(hlinks.length>1){
				//skip first line
				var links=hlinks[1];
				var first=links[0];
				
				if(links.length>2){
					for(var i=0;i<links.length;i++){
						var one=links[i];
						var two=i<links.length-1?links[i+1]:first;
						var constraint=scope.makeConstraint(one,two,group.stiffiness);
						scope.hconstraint.push(constraint);
					}
				}
				
			}
	 }
		
	 });
		

		
		//this.ammoControler.printCount();
		this.ammoControler.setEnabled(enabled);
		
		this.ammoControler.setVisibleAll(this.ap.ammoVisible);
}
SecondaryAnimationControler.prototype.newColliderGroups=function(){
	
	if(!this.boneGroups){
		console.log("SecondaryAnimationControler:parse vrm first");
		return;
	}
	
	var scope=this;

	 
	 
	 this.colliderGroups.forEach(function(group){
		 var bac=scope.ap.boneAttachControler;
		 var container=bac.getContainerByBoneName(group.boneName);
		
		 group.colliders.forEach(function(collider){
			var pos= collider.offset.clone().multiplyScalar(scope.scale);
			var size=collider.radius*scope.scale;
			
			var sphere=scope.createSphereBox(size,0,pos,0x008800,true);
			sphere.syncWorldMatrix=true;
			sphere.syncBodyToMesh=false;
			sphere.getMesh().updateMatrixWorld(true);
			sphere.syncTransform(scope.ammoControler);
			container.add(sphere.getMesh());
			scope.colliderSpheres.push(sphere);
		 });
	 });
		

}

SecondaryAnimationControler.prototype.parse=function(vrm){
	var scope=this;
	var nodes=vrm.parser.json.nodes;
	var secondaryAnimation=vrm.userData.gltfExtensions.VRM.secondaryAnimation;
	
	
	function getBoneName(index){
		return nodes[index].name;
	}
	
	function getBoneLinks(name){
		var boneList=vrm.scene.skeleton.bones;//made by vrmutils
		
		var bone=BoneUtils.findBoneByEndsName(boneList,name);
		var result=[];
		result.push(bone.name);
		while(bone.children && bone.children.length>0){
			
			bone=bone.children[0];
			result.push(bone.name);
			if(bone.children.length>1){
				console.error("unsupported multiple children exist");
			}
		}
		return result;
	}
	
	this.boneGroups=[];
	
	secondaryAnimation.boneGroups.forEach(function(group){
		var bones=group.bones;
		
		var linkList=[];
		
		bones.forEach(function(boneIndex){
			var boneName=getBoneName(boneIndex);
			var boneLinks=getBoneLinks(boneName);
			linkList.push(boneLinks);
		});
		
		scope.boneGroups.push(new BodyGroup(linkList,group))
	});
	
	
	this.colliderGroups=[];
	secondaryAnimation.colliderGroups.forEach(function(group){
		var name=getBoneName(group.node);
		scope.colliderGroups.push(new ColliderGroup(name,group))
	});
	
	this.ap.getSignal("secondaryAnimationParsed").dispatch();
}

var BodyGroup=function(boneLinkList,raw){
	this.boneLinkList=boneLinkList;//solved raw node-index(bone)
	this.raw=raw;
	this.hitRadius=raw.hitRadius;
	this.defaultHitRadius=this.hitRadius;
	this.stiffiness=raw.stiffiness;
	this.defaultStiffiness=this.stiffiness;
	this.dragForce=raw.dragForce;//drag force not used yet.
	this.defaultDragForce=this.dragForce;
};

var ColliderGroup=function(boneName,raw){
	this.boneName=boneName;//solved raw node-index(bone)
	this.raw=raw;
	this.colliders=[];
	var scope=this;
	raw.colliders.forEach(function(collider){
		var off=collider.offset;
		var vec3=new THREE.Vector3().set(off.x,off.y,off.z);
		scope.colliders.push(new Collider(vec3,collider.radius));
	});
};
var Collider=function(offset,radius){
	this.offset=offset;//vec3
	this.radius=radius;
};




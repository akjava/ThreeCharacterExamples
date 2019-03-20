/*
 * for vrm
 */
var SecondaryAnimationControler=function(ap){
	this.ap=ap;
	var scope=this;
	this._pos=new THREE.Vector3();
	
	this.logging=false;
	
	this.lockX=false;
	this.lockY=false;
	this.lockZ=false;
	
	this.allowAngleX=60;
	this.allowAngleY=60;
	this.allowAngleZ=60;
	
	this.baseHitRadius=60;//not sure which one is better for everyone 50,75,100
	
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
	this.enableLimitDistance=false;
	this.clearForceWhenResetted=false;
	
	this.connectHorizontal=false;
	this.hconstraint=[];
	
	this.isEffectDragForceBodyDamping=false;//stop so fast
	this.isEffectDragForceAngle=true;
	
	
	this.isSyncPosition=true;
	
	this._rootSpheres={};
	
	this.enableFollowBoneAttach=false;
	this.followBoneRatio=0.5;
	this.followBoneClearForceRatio=0.5;
	
	this._needFollowBoneAttach=false;
	this.isClearFollowBoneAttach=false;
	
	this.onNeedFollowBone=function(){
		if(scope.enableFollowBoneAttach)
			scope._needFollowBoneAttach=true;
		
	
	};
	
	this._ammoBodyDepthTest=false;
	
}

SecondaryAnimationControler.prototype.initialize=function(ammoControler,boneAttachControler){
	this.ap.getSignal("boneRotationChanged").add(this.onNeedFollowBone);
	this.ap.getSignal("boneTranslateChanged").add(this.onNeedFollowBone);
	this.ap.getSignal("meshTransformChanged").add(this.onNeedFollowBone);
	this.ap.getSignal("poseChanged").add(this.onNeedFollowBone);
	
	var scope=this;
	this.ammoControler=ammoControler;
	this.boneAttachControler=boneAttachControler;
	
}


SecondaryAnimationControler.prototype.validateBoneNames=function(boneNames){
	for(var i=0;i<boneNames.length;i++){
		var boneName=boneNames[i];
		var bac=this.boneAttachControler;
		var bone=BoneUtils.findBoneByEndsName(bac.boneList,boneName);
		if(bone==null){
			console.error("validateBoneNames faild",boneName);
			return false;
		}
	}
	return true;
}

SecondaryAnimationControler.prototype.getRootSphere=function(parentName,hitR,group){
	var bac=this.boneAttachControler;
	var scope=this;
	var cache=this._rootSpheres[parentName];
	if(cache){
	//	console.log("exist in cache",parentName,cache.name);
		return cache;
	}
		
	
	
	var sphere=scope.createSphereBox(hitR,0,new THREE.Vector3(),null);
	sphere.getMesh().userData.group=group;//no effect ,just compatibel
	scope.updateBodyDamping(sphere);
	
	var rootContainer=bac.getContainerByBoneName(parentName);
	rootContainer.add(sphere.getMesh());
	sphere.name=parentName+"-pos";
	
	
	scope.allSpheres.push(sphere);
	sphere.syncWorldMatrix=true;
	sphere.syncBodyToMesh=false;
	sphere.getMesh().updateMatrixWorld(true);
	sphere.syncTransform(scope.ammoControler);
	sphere.isRoot=true;
	
	
	
	//console.log("no cache create",sphere.name);
	this._rootSpheres[parentName]=sphere;
	return sphere;
}
SecondaryAnimationControler.prototype.addBoneLinks=function(links,hitRadius,group,hcontainer){
	
	/*if(!this.validateBoneNames(links)){
		return;
	}*/
	//console.log(links,hitRadius,stiffiness);
	
	
	if(!hitRadius){
		console.log("0 hitRadius.min size will be set",group);
	}
	
	var scope=this;
	var bac=this.boneAttachControler;
	var rootContainer=null;
	var hitR=scope.baseHitRadius*hitRadius;
	
	
	var mass=group.AMMO_mass>0?group.AMMO_mass:this.mass;

	
	var spheres=[];
	
	//add container
	
	
	var index=0;
	var firstOne=false;
	links.forEach(function(boneName){
		var isRoot=false;
		var bone=BoneUtils.findBoneByEndsName(bac.boneList,boneName);
		if(bone==null ){
			console.error("no bone",boneName);
		}else{
			var position=null;
			var bonePosition=bac.getContainerByBoneName(boneName).position.clone();
			
			var test=true;
			
			if(rootContainer==null){
				//create bone parent spehere
				rootContainer=bac.getContainerByBoneName(bone.parent.name);
				
				var pos=rootContainer.position.clone();
				
				var sphere=scope.getRootSphere(bone.parent.name,hitR,group);
				
				spheres.push(sphere);
				
				
				isRoot=true;
				position=bonePosition.clone().sub(rootContainer.position.clone());
				
				if(!test)
					position=bonePosition;
			}else{
				position=bonePosition;
			}
			
			
			
			var hr=hitR;
			
			
			
			var sphere=scope.createSphereBox(hr,mass,position,isRoot?null:group);//no 0 style not good at skirt
			 if(group){
				 sphere.syncBoneRatio=group.AMMO_syncBoneRatio;
			 }
			sphere.getMesh().userData.group=group;
			scope.updateBodyDamping(sphere);
			
			
			sphere.name=boneName+"-pos";
			spheres.push(sphere);
			scope.allSpheres.push(sphere);
			
			
			if(isRoot & test){
				//Mesh to Body
				rootContainer.add(sphere.getMesh());
				
				AmmoUtils.setLinearFactor(sphere.getBody(),0,0,0);
				AmmoUtils.setAngularFactor(sphere.getBody(),1,1,1);
				sphere.syncBone=true;
				sphere.rotationSync=false;
					
				
				sphere.syncWorldMatrix=true;
				sphere.syncBodyToMesh=false;
				sphere.getMesh().updateMatrixWorld(true);
				sphere.syncTransform(scope.ammoControler);
				
				sphere.isRoot=true;
				//
			}else{
				AmmoUtils.setLinearFactor(sphere.getBody(),0,0,0);
				sphere.syncBone=true;
				sphere.syncWorldMatrix=false;
				sphere.syncTransform(scope.ammoControler);
				sphere.getMesh().updateMatrixWorld(true);
				
				
				/*//trying fixed position
				var c=bac.getContainerByBoneName(bone.name);
				sphere.syncWorldMatrix=true;
				sphere.rotationSync=false;
				sphere.syncBodyToMesh=false;
				
				c.add(sphere.getMesh());
				AmmoUtils.setLinearFactor(sphere.getBody(),0,0,0);
				sphere.syncTransform(scope.ammoControler);
				sphere.getMesh().updateMatrixWorld(true);*/
			}
		}
		
		index++;
	});
	var bodyDamping=scope.bodyDamping;
	
	for(var i=0;i<spheres.length-1;i++){
	//for(var i=0;i<links.length;i++){
		
		var boneName=links[i];
		if(!boneName){
			break;
		}
		var bone=BoneUtils.findBoneByEndsName(bac.boneList,boneName);
		var sphere1=spheres[i];
		if(!sphere1){
			break;//maybe something _end bone
		}
		
		var sphere2=null;
		
		
		if(i<spheres.length-1){
			sphere2=spheres[i+1];
		}
		
		
		bone.userData.defaultPosition=bone.position.clone();//maybe reset's problem is here
		
		if(sphere2!=null){
			sphere2.name=sphere2.name+":"+bone.name+"-rot";
			
			sphere2.targetBone=bone;
			
			if(!sphere2.isRoot && scope.isSyncPosition) //&& false
				sphere2.syncBonePosition=true;
		
			
			var constraint=scope.makeConstraint(sphere1,sphere2,group);
			sphere2.getMesh().userData.constraint=constraint;
			sphere2.getMesh().userData.dof=constraint.constraint;
			sphere2.getMesh().userData.sphere1=sphere1;
			
		}else{
			console.error("no sphere2",boneName);
		}
		
		
		var list=hcontainer[i];
		if(list==undefined){
			list=[];
			hcontainer.push(list);
		}
		list.push(sphere1);
		
		//some test
		/*if(i==links.length-1 && links.length>2){
			scope.ends.push(sphere1);
		}*/
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

SecondaryAnimationControler.prototype.createSphereBox=function(size,mass,position,bodyGroup,color){
	var colliders=bodyGroup?bodyGroup.colliderGroups:null;

	
	color=color==undefined?0x000088:color;
	 if(!size){
		 console.error("need size,min size will set");
	 }
	 if(!mass && mass!==0){
		 console.error("need mass");
	 }
	 if(size<this.minSize){
		 size=this.minSize;
	 }
	 
	
	 var group=0;
	 var mask=0;
	 if(colliders){
		 group=1;
		 
		 colliders.forEach(function(index){
				var bit= 1<<(index+1);
				mask=mask | bit;
			 });
		 
		// mask+=1;
		 
			 if(this.logging)
				 console.log("sphere mask",bodyGroup.boneLinkList[0][0],mask,colliders);
			
	 }
	 
	
	 var sphere=this.ammoControler.createSphere(size, mass, position.x,position.y,position.z, 
						new THREE.MeshPhongMaterial({color:color,depthTest:this._ammoBodyDepthTest,transparent:!this._ammoBodyDepthTest,opacity:.5}),group,mask
				);
	 
	
	 
	 
	 return sphere;
}


SecondaryAnimationControler.prototype.setAmmoDepthTest=function(value){
	var scope=this;
	this._ammoBodyDepthTest=value;
	this.allSpheres.forEach(function(sphere){
		sphere.getMesh().material.depthTest=scope._ammoBodyDepthTest;
		sphere.getMesh().material.transparent=!scope._ammoBodyDepthTest;
		sphere.getMesh().material.needsUpdate=true;
	});
	this.colliderSpheres.forEach(function(sphere){
		sphere.getMesh().material.depthTest=scope._ammoBodyDepthTest;
		sphere.getMesh().material.transparent=!scope._ammoBodyDepthTest;
		sphere.getMesh().material.needsUpdate=true;
	});
	
};
		
SecondaryAnimationControler.prototype.createColliderSphereBox=function(size,mass,position,color,collidarGroup){
	var index=collidarGroup.colliderIndex;
	var boneName=collidarGroup.boneName;
	 color=color==undefined?0x000088:color;
	 if(!size){
		 console.error("need size,min size will set");
	 }
	 if(!mass && mass!==0){
		 console.error("need mass");
	 }
	 
	 if(size<this.minSize){
		 console.log("min size used from ",size," to ",this.minsize);
		 size=this.minSize;
	 }
	 
	 var group=1<<(index+1);
	 var mask=1;//very important
	 if(this.logging)
		 console.log("collider",boneName,"index",index,"group",group);

	
	 //not set mask here
	 //var mask=group+1;
	
	
	
	 var sphere=this.ammoControler.createSphere(size, mass, position.x,position.y,position.z, 
						new THREE.MeshPhongMaterial({color:color,depthTest:this._ammoBodyDepthTest,transparent:!this._ammoBodyDepthTest,opacity:.5}),group,mask
				);
	 return sphere;
}

SecondaryAnimationControler.prototype.makeConstraint=function(box1,box2,group){
	 var stiffiness=group.stiffiness;
	
	 var box1Pos=new THREE.Vector3().setFromMatrixPosition(box1.getMesh().matrixWorld);
	 var box2Pos=new THREE.Vector3().setFromMatrixPosition(box2.getMesh().matrixWorld);
	 var diff=box2Pos.sub(box1Pos);
	
	 //diff.multiplyScalar(0.5); not good
	
	
	 box2.parent=box1;
	 box2.defaultDistance=new THREE.Vector3().distanceTo(diff);
	
	 
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
	AmmoUtils.copyFromVector3(frameInA.getOrigin(),diff.clone());//I'm not sure use negate,but it no gravity effect than other
	var disableCollisionsBetweenLinkedBodies=true;
	var constraint=application.ammoControler.createGeneric6DofSpringConstraint( //no advantage using createGeneric6DofConstraint,createConeTwistConstraint
			box2,box1, frameInB,frameInA,disableCollisionsBetweenLinkedBodies,true);
	
	var dof=constraint.constraint;
	
	AmmoUtils.seteAllEnableSpring(dof,true);
	var sti=this.baseStiffiness*stiffiness;
	
	AmmoUtils.seteAllStiffness(dof,sti);
	AmmoUtils.seteAllDamping(dof,this.damping);
	
	
	var limit=0;//TODO support
	dof.setLinearLowerLimit(application.ammoControler.makeTemporaryVector3(-limit, -limit,-limit));
	dof.setLinearUpperLimit(application.ammoControler.makeTemporaryVector3(limit, limit, limit));

	var angleX=THREE.Math.degToRad(this.allowAngleX);
	var angleY=THREE.Math.degToRad(this.allowAngleY);
	var angleZ=THREE.Math.degToRad(this.allowAngleZ);
	
	if(this.isEffectDragForceAngle){
		angleX*=group.dragForce;
		angleY*=group.dragForce;
		angleZ*=group.dragForce;
	}
	
	//var tmp={x:angleX,y:angleY,z:angleZ};
	//AppUtils.printDeg(tmp,"final limit angle");*/
	
	
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
	
	this._rootSpheres={};
}

SecondaryAnimationControler.prototype.dispose=function(){
	 this._destroySecondaryAnimation();
	 this.ap.getSignal("boneRotationChanged").remove(this.onNeedFollowBone);
	 this.ap.getSignal("boneTranslateChanged").remove(this.onNeedFollowBone);
	 this.ap.getSignal("meshTransformChanged").remove(this.onNeedFollowBone);
	 this.ap.getSignal("poseChanged").remove(this.onNeedFollowBone);
	 
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
	
	/*much better limit angle 1,TODO can do some limitation.
	 * this.ends.forEach(function(sphere){
		console.log(sphere.name);
		AmmoUtils.setLinearVelocity(sphere.getBody(),new THREE.Vector3(0,-0,0));
		AmmoUtils.setAngularVelocity(sphere.getBody(),new THREE.Vector3(0,0,0));
	});*/
	
	
	/*
	 * not so good
	 */
	if(this._needFollowBoneAttach){//set true via boneRotationChanged; but this not care stretch
		if(this.logging)
		console.log("enableFollowBoneAttach");
		
		
		
		this.allSpheres.forEach(function(sphere){
				if(sphere.targetBone ){
					 var bone=sphere.targetBone;
					 var bac=scope.ap.boneAttachControler;
					 var container=bac.getContainerByBoneName(bone.name);
					 var pos=container.position;
					 if(scope.followBoneRatio!=1){
						 var current=sphere.getMesh().position;
						 var diff=pos.clone().sub(current);
						 diff.multiplyScalar(scope.followBoneRatio);
						 pos=diff.add(current);
					 }
					
					 
					 
					 
					 	var transform=AmmoUtils.getSharedBtTransform();
					 	var q=container.quaternion;
					 	var btQuaternion=AmmoUtils.getSharedBtQuaternion(q.x,q.y,q.z,q.w);
						transform.setRotation(btQuaternion);
						
						AmmoUtils.copyFromXYZ(transform.getOrigin(),pos.x,pos.y,pos.z);
						sphere.body.setCenterOfMassTransform(transform);
						sphere.body.getMotionState().setWorldTransform(transform);
						sphere.syncTransform(scope.ap.ammoControler);
				}
				if(scope.followBoneClearForceRatio==0){
					
					AmmoUtils.setLinearVelocity(sphere.getBody(),new THREE.Vector3(0,0,0));
					AmmoUtils.setAngularVelocity(sphere.getBody(),new THREE.Vector3(0,0,0));
				}else if (scope.followBoneClearForceRatio!=1){
					var linear=AmmoUtils.getLinearVelocity(sphere.getBody());
					var angular=AmmoUtils.getAngularVelocity(sphere.getBody());
					linear.multiplyScalar(scope.followBoneClearForceRatio);
					angular.multiplyScalar(scope.followBoneClearForceRatio);
					AmmoUtils.setLinearVelocity(sphere.getBody(),linear);
					AmmoUtils.setAngularVelocity(sphere.getBody(),angular);
					
				}
				
			});
		
		this._needFollowBoneAttach=false;
	}
	
	if(this.enableLimitDistance){
		this.allSpheres.forEach(function(sphere){
			if(sphere.parent && !sphere.isRoot){
				var parent=sphere.parent;
				var parentPos;
				if(parent.syncWorldMatrix){
					parentPos=new THREE.Vector3().setFromMatrixPosition(parent.getMesh().matrixWorld);
				}else{
					parentPos=parent.getMesh().position;
				}
				var childPos;
				if(sphere.syncWorldMatrix){
					childPos=new THREE.Vector3().setFromMatrixPosition(sphere.getMesh().matrixWorld);
				}else{
					childPos=sphere.getMesh().position;
				}
				
				var distance=childPos.clone().distanceTo(parentPos);
				var max=sphere.defaultDistance*scope.maxDistanceRatio;
				if(distance>max){
					
					
					//console.log("max",sphere.name);
					var divided=distance/max;
					var diff=sphere.getMesh().position.clone().sub(parentPos);
					diff.divideScalar(divided).add(parentPos);
					
					AmmoUtils.setPosition(sphere.getBody(),diff.x,diff.y,diff.z);
					sphere.syncTransform(scope.ap.ammoControler);
					
					if(scope.clearForceWhenResetted){
						AmmoUtils.setLinearVelocity(sphere.getBody(),new THREE.Vector3(0,0,0));
						AmmoUtils.setAngularVelocity(sphere.getBody(),new THREE.Vector3(0,0,0));
					}
					
					if(scope.logging)
					console.log("reset",sphere.name,max,distance,sphere.defaultDistance,scope.maxDistanceRatio);
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
SecondaryAnimationControler.prototype.calculateBodyDamping=function(dragForce,bodyDamping){
	if(this.isEffectDragForceBodyDamping){
		return 1.0-dragForce;
	}else{
		return bodyDamping;
	}
}

SecondaryAnimationControler.prototype.updateBodyDamping=function(box){
	var value=this.calculateBodyDamping(box.getMesh().userData.group.dragForce,this.bodyDamping);
	
	box.getBody().setDamping(value,value);
}
SecondaryAnimationControler.prototype.setSpringValues=function(baseStiffiness,damping,bodyDamping){
	var scope=this;
	function change(box){
		var dof=box.getMesh().userData.dof;
		var stiffiness=box.getMesh().userData.group.stiffiness;
		
		scope.updateBodyDamping(box);
		//var bdamping=1.0-box.getMesh().userData.group.dragForce;
		if(dof){
			var sf=baseStiffiness*stiffiness;
			//console.log("final setSpringValues",sf,damping,bdamping,bodyDamping,scope.isEffectDragForceBodyDamping);
			AmmoUtils.seteAllStiffness(dof,sf);
			AmmoUtils.seteAllDamping(dof,damping);
			
			
			
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
	this.ap.skinnedMesh.rotation.set(0,0,0);
	
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
		 if(hlinks.length>2){
				//skip second line,first is bone static,second no positoin move
				var links=hlinks[2];
				var first=links[0];
				
				if(links.length>2){
					for(var i=0;i<links.length;i++){
						var one=links[i];
						var two=i<links.length-1?links[i+1]:first;
						var constraint=scope.makeConstraint(one,two,group);
						scope.hconstraint.push(constraint);
					}
				}
				
			}
	 }
		
	 });
	
	 //debug bone linking
	 if(this.logging){
		 this.allSpheres.forEach(function(sphere){
			    var targetName=sphere.targetBone?sphere.targetBone.name:"";
			    
			   
				console.log(sphere.getMesh().name,targetName,sphere.syncBone,sphere.syncBonePosition);
			});
	 }
	
		

		
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
			
			var sphere=scope.createColliderSphereBox(size,0,pos,0x008800,group);
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
		return VrmUtils.getNodeBoneName(vrm,index);
	}
	
	function getBoneLinks(name){
		var boneList=vrm.scene.skeleton.bones;//made by vrmutils
		
		var bone=BoneUtils.findBoneByEndsName(boneList,name);
		if(bone==null){
			console.error("no bone name skipped",name,nodes,boneList);
			return null;
		}
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
	
	var tmp={};
	secondaryAnimation.boneGroups.forEach(function(group){
		var bones=group.bones;
		
		
		
		var linkList=[];
		
		bones.forEach(function(boneIndex){
			var boneName=getBoneName(boneIndex);
			var boneLinks=getBoneLinks(boneName);
			if(boneLinks!=null){//possible contain not exist bone
				linkList.push(boneLinks);
			}
			
		});
		
		var group=new BodyGroup(linkList,group);
		var key=group.toBoneKey();
		if(!tmp[key]){
			scope.boneGroups.push(group);
			tmp[key]=true;
		}else{
			if(scope.logging)
			console.log("SecondaryAnimationControler.parse:Bone Group exist skipped",key,group);
		}
		
		
	});
	
	
	this.colliderGroups=[];
	 var index=0;
	secondaryAnimation.colliderGroups.forEach(function(group){
		var name=getBoneName(group.node);
		scope.colliderGroups.push(new ColliderGroup(name,index,group));
		index++;
	});
	
	this.ap.getSignal("secondaryAnimationParsed").dispatch();
}

var BodyGroup=function(boneLinkList,raw){
	this.boneLinkList=boneLinkList;//solved raw node-index(bone)
	this.raw=raw;
	
	this.colliderGroups=[];
	this.colliderGroups=this.colliderGroups.concat(raw.colliderGroups);
	
	this.hitRadius=raw.hitRadius;
	this.defaultHitRadius=this.hitRadius;
	this.stiffiness=raw.stiffiness;
	this.defaultStiffiness=this.stiffiness;
	this.dragForce=raw.dragForce;//drag force not used yet.
	this.defaultDragForce=this.dragForce;
	
	this.AMMO_mass=undefined;
	this.AMMO_syncBoneRatio=undefined;
};

BodyGroup.prototype.toBoneKey=function(){
	var bones=this.raw.bones;
	var result="";
	for(var i=0;i<bones.length;i++){
		var index=bones[i];
		if(i!=0){
			result+=",";
		}
		result+=index;
	}
	return result;
}


SecondaryAnimationControler.prototype.getColliderGroupName=function(index){
	var cgroup=this.colliderGroups[index];
	if(!cgroup){
		return null;
	}
	return cgroup.boneName+"("+cgroup.colliders.length+")";
}

var ColliderGroup=function(boneName,index,raw){
	this.colliderIndex=index;
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




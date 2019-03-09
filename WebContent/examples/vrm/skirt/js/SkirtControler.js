/*
 * for vrm
 */
var SkirtControler=function(ap){
	this.ap=ap
	this._pos=new THREE.Vector3();
	
	this.logging=true;
	
	this.lockX=false;
	this.lockY=false;
	this.lockZ=false;
	
	this.allowAngleX=180;
	this.allowAngleY=180;
	this.allowAngleZ=180;
	
	this.size=1;
	
	
	this.damping=1;
	this.stiffness=100;
	this.bodyDamping=0.75;
	
	this.mass=1;
	
	this._enabled=true;
	this.allSpheres=[];
}

SkirtControler.prototype.initialize=function(ammoControler,boneAttachControler){
	var scope=this;
	this.ammoControler=ammoControler;
	this.boneAttachControler=boneAttachControler;
	

	//TODO add collisions
}


SkirtControler.prototype.addLink=function(links){
	var scope=this;
	var bac=this.boneAttachControler;
	var rootContainer=null;
	
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
		var sphere=scope.createSphereBox(scope.size,isRoot?0:scope.mass,position);
		spheres.push(sphere);
		scope.allSpheres.push(sphere);
		if(isRoot){
			//Mesh to Body
			rootContainer.add(sphere.getMesh());

			sphere.syncWorldMatrix=true;
			sphere.syncBodyToMesh=false;
			sphere.getMesh().updateMatrixWorld(true);
			sphere.syncTransform(scope.ammoControler);
		}else{
			sphere.syncBone=true;
			//childSphere.targetBone=parentBone;
			sphere.syncWorldMatrix=false;
			sphere.getMesh().updateMatrixWorld(true);
		}
	});
	for(var i=0;i<links.length;i++){
		var boneName=links[i];
		var bone=BoneUtils.findBoneByEndsName(bac.boneList,boneName);
		var sphere1=spheres[i];
		var sphere2=null;
		var isLeaf=false;
		if(i<links.length-1){
			sphere2=spheres[i+1];
		}else{
			//create endsite
			var parentName=bone.parent.name;
			var parentPos=bac.getContainerByBoneName(parentName).position.clone();
			var bonePos=bac.getContainerByBoneName(boneName).position.clone();
			var endSitePos=bonePos.clone().sub(parentPos).add(bonePos);
			sphere2=this.createSphereBox(this.size,this.mass,endSitePos);
			scope.allSpheres.push(sphere2);
			sphere2.syncBone=true;
			sphere2.syncWorldMatrix=false;
			sphere2.getMesh().updateMatrixWorld(true);
			isLeaf=true;
		}
		sphere2.targetBone=bone;
		if(!isLeaf){
			sphere1.positionTargetBone=bone;
		}
		
		sphere2.name=bone.name;
		
		bone.userData.defaultPosition=bone.position.clone();
		
		scope.makeConstraint(sphere1,sphere2);
	}
}

SkirtControler.prototype.findSphereByName=function(name){
	var match=null;
	this.allSpheres.forEach(function(sphere){
		//console.log(sphere.name,name);
		if(sphere.name==name){
			match= sphere;
		}
	})
	return match;
}

SkirtControler.prototype.createSphereBox=function(size,mass,position,isRoot){
	 var sphere=this.ammoControler.createSphere(size, mass, position.x,position.y,position.z, 
						new THREE.MeshPhongMaterial({color:0x000088})
				);
	 return sphere;
}

SkirtControler.prototype.makeConstraint=function(box1,box2){

	
	 var box1Pos=new THREE.Vector3().setFromMatrixPosition(box1.getMesh().matrixWorld);
	 var box2Pos=new THREE.Vector3().setFromMatrixPosition(box2.getMesh().matrixWorld);
	 var diff=box2Pos.sub(box1Pos);
	
	var body=box2.getBody();
	
	 
	 AmmoUtils.setLinearFactor(body,1,1,1);
	 var factorX=this.lockX==true?0:1;
	 var factorY=this.lockY==true?0:1;
	 var factorZ=this.lockZ==true?0:1;
	 AmmoUtils.setAngularFactor(body,factorX,factorY,factorZ);//no z
	 
	 
	 body.setDamping(this.bodyDamping,this.bodyDamping);
	 body.setActivationState(AmmoUtils.DISABLE_DEACTIVATION);
	 
	 //connect
	var frameInA=application.ammoControler.makeTemporaryTransform();
	var frameInB=application.ammoControler.makeTemporaryTransform();
	AmmoUtils.copyFromVector3(frameInA.getOrigin(),diff.clone().negate());//I'm not sure use negate
	var constraint=application.ammoControler.createGeneric6DofSpringConstraint(
			box2,box1, frameInA,frameInB,false,true);
	
	var dof=constraint.constraint;
	
	AmmoUtils.seteAllEnableSpring(dof,true);
	AmmoUtils.seteAllStiffness(dof,this.stiffness);
	AmmoUtils.seteAllDamping(dof,this.damping);
	
	var limit=0;//TODO
	dof.setLinearLowerLimit(application.ammoControler.makeTemporaryVector3(-limit, -limit,-limit));
	dof.setLinearUpperLimit(application.ammoControler.makeTemporaryVector3(limit, limit, limit));

	var angleX=THREE.Math.degToRad(this.allowAngleX);
	var angleY=THREE.Math.degToRad(this.allowAngleY);
	var angleZ=THREE.Math.degToRad(this.allowAngleZ);
	
	dof.setAngularLowerLimit(application.ammoControler.makeTemporaryVector3(-angleX, -angleY,-angleZ));
	dof.setAngularUpperLimit(application.ammoControler.makeTemporaryVector3(angleX, angleY, angleZ));
	
	box2.getMesh().userData.constraint=constraint;
	box2.getMesh().userData.dof=dof;
}


SkirtControler.prototype.setEnabled=function(v){
	this._enabled=v;
}

SkirtControler.prototype._destroySkirt=function(){
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
}

SkirtControler.prototype.dispose=function(){
	 this._destroySkirt();
	 if(this.headBox){
		 this.ammoControler.destroyBodyAndMesh(this.headBox);
		 this.headBox=null;
	 }
}

/*SkirtControler.prototype.getDistance=function(isBreastR){
	var target=isBreastR==true?this.breastBoxR:this.breastBoxL;
	var pos=target.getMesh().userData.breastBase.getMesh().getWorldPosition(this._pos);
	var distance=pos.distanceTo(target.getMesh().position);
	return distance;
}*/

SkirtControler.prototype.update=function(){
	if(!this._enabled){
		return;
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


SkirtControler.prototype.updateSpringValues=function(){
	this.setSpringValues(this.stiffness,this.damping,this.bodyDamping);
}
SkirtControler.prototype.setSpringValues=function(stiffness,damping,bodyDamping){
	function change(box){
		var dof=box.getMesh().userData.dof;
		if(dof){
			AmmoUtils.seteAllStiffness(dof,stiffness);
			AmmoUtils.seteAllDamping(dof,damping);
			box.getBody().setDamping(bodyDamping,bodyDamping);
		}
		
	}
	
	this.allSpheres.forEach(function(sphere){
		change(sphere);
	});
}

SkirtControler.prototype.newSkirt=function(){
	console.log(this);
	var enabled=this.ammoControler.isEnabled();
	this.ammoControler.setEnabled(false);
	this.ap.skinnedMesh.skeleton.pose();
	this.ap.boneAttachControler.update(true);
	var scope=this;
	
	 this._destroySkirt();
	 this.ammoControler.printCount();
	 
		var linkGroups=[];
		
		linkGroups.push(["skirt_01_01","skirt_01_02"]);
		linkGroups.push(["skirt_02_01","skirt_02_02"]);
		linkGroups.push(["skirt_03_01","skirt_03_02"]);
		linkGroups.push(["skirt_04_01","skirt_04_02"]);
		linkGroups.push(["skirt_05_01","skirt_05_02"]);
		linkGroups.push(["skirt_06_01","skirt_06_02"]);
		linkGroups.push(["skirt_07_01","skirt_07_02"]);
		linkGroups.push(["skirt_08_01","skirt_08_02"]);
		linkGroups.push(["skirt_09_01","skirt_09_02"]);
		linkGroups.push(["skirt_10_01","skirt_10_02"]);

		linkGroups.forEach(function(group){
			scope.addLink(group);
		});
		this.ammoControler.printCount();
		this.ammoControler.setEnabled(enabled);
}






/*
 * for vrm
 */
var MituamiControler=function(){
	
	this._pos=new THREE.Vector3();
	this.autoResetPosition=true;
	this.logging=true;
	
	this.lockX=false;
	this.lockY=false;
	this.lockZ=true;
	
	this.allowAngleX=180;
	this.allowAngleY=180;
	this.allowAngleZ=180;
	this.breastPosZ=6;
	
	this.breastSize=1;
	
	
	this.damping=1;
	this.stiffness=100;
	this.bodyDamping=0.75;
	
	this.autoResetPosition=true;
	this.breastMass=1;
	
	this._enabled=true;
	
	
	this.headIndex=undefined;
	this.spheres=[];
}

MituamiControler.prototype.initialize=function(ammoControler,boneAttachControler){
	var scope=this;
	this.ammoControler=ammoControler;
	this.boneAttachControler=boneAttachControler;
	
	//attach
	var boneList=boneAttachControler.getBoneList();
	
	var mituamiNames=["mituami1","mituami2","mituami3","mituami4"];//"mituami_F"
	
	this.mituamiBoneIndices=[];
	
	mituamiNames.forEach(function(name){
		var bone=BoneUtils.findBoneIndexByEndsName(boneList,name);
		scope.mituamiBoneIndices.push(bone);
	});
	
	this.headIndex=BoneUtils.findBoneIndexByEndsName(boneList,"head");
	
	
	var mituamiContainer=boneAttachControler.getContainerByBoneIndex(this.headIndex);
	this.mituamiContainer=mituamiContainer;
	
	var p=mituamiContainer.position;
	var headBox=this.ammoControler.createSphere(new THREE.Vector3(10), 0, 0,0,0, 
				new THREE.MeshPhongMaterial({color:0x008800})
				);
				
	 this.headBox=headBox;
	 mituamiContainer.add(headBox.getMesh());
	 
	 headBox.syncWorldMatrix=true;
	 headBox.syncBodyToMesh=false;
	 headBox.getMesh().updateMatrixWorld(true);
	 headBox.syncTransform(ammoControler);//update here
	 
	 
}

MituamiControler.prototype.setEnabled=function(v){
	this._enabled=v;
}

MituamiControler.prototype._destroyMituami=function(){
	var scope=this;
	 function destroy(box){
		 if(box.getMesh().userData.constraint)
			 scope.ammoControler.destroyConstraintAndLine(box.getMesh().userData.constraint);
		 
		 scope.ammoControler.destroyBodyAndMesh(box);
	 }
	 
	this.spheres.forEach(function(sphere){
		destroy(sphere);
	});
	this.spheres=[];
}

MituamiControler.prototype.dispose=function(){
	 this._destroyMituami();
	 if(this.headBox){
		 this.ammoControler.destroyBodyAndMesh(this.headBox);
		 this.headBox=null;
	 }
}
MituamiControler.prototype.resetPosition=function(){
	var scope=this;
	function reset(box){
		var pos=box.getMesh().userData.resetBox.getWorldPosition(scope._pos);
		AmmoUtils.setPosition(box.getBody(),pos.x,pos.y,pos.z);
	}
	reset(this.breastBoxR);
	reset(this.breastBoxL);
}

/*MituamiControler.prototype.getDistance=function(isBreastR){
	var target=isBreastR==true?this.breastBoxR:this.breastBoxL;
	var pos=target.getMesh().userData.breastBase.getMesh().getWorldPosition(this._pos);
	var distance=pos.distanceTo(target.getMesh().position);
	return distance;
}*/

MituamiControler.prototype.update=function(){
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


MituamiControler.prototype.updateSpringValues=function(){
	this.setSpringValues(this.stiffness,this.damping,this.bodyDamping);
}
MituamiControler.prototype.setSpringValues=function(stiffness,damping,bodyDamping){
	function change(box){
		var dof=box.getMesh().userData.dof;
		if(dof){
			AmmoUtils.seteAllStiffness(dof,stiffness);
			AmmoUtils.seteAllDamping(dof,damping);
			box.getBody().setDamping(bodyDamping,bodyDamping);
		}
		
	}
	
	this.spheres.forEach(function(sphere){
		change(sphere);
	});
}

MituamiControler.prototype.newMituami=function(){

	
	 this._destroyMituami();
	 
	 var boneList=this.boneAttachControler.getBoneList();
	 
	 var parentBone=null;
	 var parentSphere=null;
	 var parentSphere2=null;
	 
	 for(var i=0;i<this.mituamiBoneIndices.length;i++){
		var index=this.mituamiBoneIndices[i];
		var pos=this.boneAttachControler.clonePositionAt(index);
		var size=1;
		
		
		var childSphere= this.createMituamiBox(this.mituamiContainer,pos,parentBone,parentSphere,size,parentSphere2);
		parentBone=boneList[index];
		
		parentSphere=childSphere;
		parentSphere2=childSphere;
		if(i==1){
			//parentSphere.defaultBoneRotation=new THREE.Euler(0,THREE.Math.degToRad(180),0);
		}
		
		this.spheres.push(childSphere);
	 }
	 
	 //ap.signals.visibleAmmoChanged.dispatch();
}

/*
 * ammoContainer must be head,directlly set mituami1(which rotate)
 */
MituamiControler.prototype.createMituamiBox=function (ammoContainer,childPos,parentBone,parentSphere,size,parentSphere2){
	
	var ammoControler=this.ammoControler;
	//var size=1;
	var mass=100;
	
	var childSphere=null;
	var diff=null;
	if(parentSphere==null){
		 var parentPos=ammoContainer.position;
		 var diff=childPos.clone().sub(parentPos);
		 childSphere=ammoControler.createBox(new THREE.Vector3(2,2,2), 0, diff.x,diff.y,diff.z, 
		//childSphere=ammoControler.createSphere(size, 0, diff.x,diff.y,diff.z, 
				new THREE.MeshPhongMaterial({color:0x000088})
		);
		childSphere.getBody().setDamping(1,1);
		
		ammoContainer.add(childSphere.getMesh());

		childSphere.syncWorldMatrix=true;
		childSphere.syncBodyToMesh=false;
		childSphere.getMesh().updateMatrixWorld(true);
		childSphere.syncTransform(ammoControler);
		
		return childSphere
	}else{
		
		//no container
		 childSphere=ammoControler.createBox(new THREE.Vector3(2,2,2), mass, childPos.x,childPos.y,childPos.z, 
		//childSphere=ammoControler.createSphere(size, mass, childPos.x,childPos.y,childPos.z, 
				new THREE.MeshPhongMaterial({color:0x000088})
		);
		childSphere.getMesh().updateMatrixWorld(true);
		
		
		childSphere.syncBone=true;
		childSphere.targetBone=parentBone;
		 
		childSphere.syncWorldMatrix=false;
		childSphere.parentBodyAndMesh=parentSphere2;
		childSphere.parentBone=parentBone.parent;//somehow notwork
	}
	 var parentPos=new THREE.Vector3().setFromMatrixPosition(parentSphere.getMesh().matrixWorld);
	 var diff=childPos.clone().sub(parentPos);
	// console.log(childPos,parentPos,diff);
	
	var body=childSphere.getBody();
	
	 
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
	AmmoUtils.copyFromVector3(frameInA.getOrigin(),diff.clone().negate());
	var constraint=application.ammoControler.createGeneric6DofSpringConstraint(
			childSphere,parentSphere, frameInA,frameInB,false,true);
	
	var dof=constraint.constraint;
	
	AmmoUtils.seteAllEnableSpring(dof,true);
	AmmoUtils.seteAllStiffness(dof,this.stiffness);
	AmmoUtils.seteAllDamping(dof,this.damping);
	
	var limit=0;
	dof.setLinearLowerLimit(application.ammoControler.makeTemporaryVector3(-limit, -limit,-limit));
	dof.setLinearUpperLimit(application.ammoControler.makeTemporaryVector3(limit, limit, limit));

	//dont need z-rotation
	
	
	var angleX=THREE.Math.degToRad(this.allowAngleX);
	var angleY=THREE.Math.degToRad(this.allowAngleY);
	var angleZ=THREE.Math.degToRad(this.allowAngleZ);
	
	dof.setAngularLowerLimit(application.ammoControler.makeTemporaryVector3(-angleX, -angleY,-angleZ));
	dof.setAngularUpperLimit(application.ammoControler.makeTemporaryVector3(angleX, angleY, angleZ));
	
	childSphere.getMesh().userData.constraint=constraint;
	childSphere.getMesh().userData.dof=dof;
	childSphere.getMesh().userData.parent=parentSphere;
	
	 return childSphere;
}






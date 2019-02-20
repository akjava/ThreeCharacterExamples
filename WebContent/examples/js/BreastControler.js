var BreastControler=function(){
	
	this._pos=new THREE.Vector3();
	this.autoResetPosition=true;
	this.logging=true;
	
	this.lockX=false;
	this.lockY=false;
	this.lockZ=false;
	
	this.allowAngleX=45;
	this.allowAngleY=30;
	this.allowAngleZ=90;
	this.breastPosZ=6;
	
	this.breastSize=5;
	this.breastPosX=0;
	this.breastPosY=-2;
	this.breastPosZ=6;
	
	this.damping=1;
	this.stiffness=100;
	this.bodyDamping=0.75;
	
	this.autoResetPosition=true;
	
	this._enabled=true;
}

BreastControler.prototype.initialize=function(ammoControler,boneAttachControler){
	this.ammoControler=ammoControler;
	this.boneAttachControler=boneAttachControler;
	
	//attach
	var boneList=boneAttachControler.getBoneList();
	
	var sprine03=BoneUtils.findBoneIndexByEndsName(boneList,"spine03");
	var breastR=BoneUtils.findBoneIndexByEndsName(boneList,"breast_R");
	this.breastR=breastR;
	var breastL=BoneUtils.findBoneIndexByEndsName(boneList,"breast_L");
	this.breastL=breastL;
	
	var ammoContainer=boneAttachControler.getContainerByBoneIndex(sprine03);
	this.ammoContainer=ammoContainer;
	
	var p=ammoContainer.position;
	var sprine03Box=this.ammoControler.createBox(new THREE.Vector3(80, 80, 10), 0, 0,0,-5, 
				new THREE.MeshPhongMaterial({color:0x008800})
						);
				
	 this.sprineBox03=sprine03Box;
	 ammoContainer.add(sprine03Box.getMesh());
	 sprine03Box.syncWorldMatrix=true;
	 sprine03Box.syncBodyToMesh=false;
	 sprine03Box.getMesh().updateMatrixWorld(true);
	 sprine03Box.syncTransform(ammoControler);
	 
	 this.breastRContainer=boneAttachControler.getContainerByBoneIndex(this.breastR);
	 this.breastLContainer=boneAttachControler.getContainerByBoneIndex(this.breastL);
}

BreastControler.prototype.setEnabled=function(v){
	this._enabled=v;
}


BreastControler.prototype._destroyBreast=function(){
	var scope=this;
	 function destory(box){
		 if( box.getMesh().userData.resetBox.parent!=null)//possible parent disposed
			 box.getMesh().userData.resetBox.parent.remove(box.getMesh().userData.resetBox);
		 
		 
		 scope.ammoControler.destroyBodyAndMesh(box.getMesh().userData.breastBase);
		 scope.ammoControler.destroyConstraintAndLine(box.getMesh().userData.constraint);
		 scope.ammoControler.destroyBodyAndMesh(box);
		 
		 
	 }
	 
	 if(this.breastBoxR!=null){
		 destory(this.breastBoxR);
		 destory(this.breastBoxL);
		 this.breastBoxR=null;
		 this.breastBoxL=null;
	 }
}

BreastControler.prototype.dispose=function(){
	
	 this._destroyBreast();
	 if(this.sprineBox03){
		 this.ammoControler.destroyBodyAndMesh(this.sprineBox03);
		 this.sprineBox03=null;
	 }
	 
	 
}
BreastControler.prototype.resetPosition=function(){
	var scope=this;
	function reset(box){
		var pos=box.getMesh().userData.resetBox.getWorldPosition(scope._pos);
		AmmoUtils.setPosition(box.getBody(),pos.x,pos.y,pos.z);
	}
	reset(this.breastBoxR);
	reset(this.breastBoxL);
}

BreastControler.prototype.getDistance=function(isBreastR){
	var target=isBreastR==true?this.breastBoxR:this.breastBoxL;
	var pos=target.getMesh().userData.breastBase.getMesh().getWorldPosition(this._pos);
	var distance=pos.distanceTo(target.getMesh().position);
	return distance;
}

BreastControler.prototype.update=function(){
	if(!this._enabled){
		return;
	}
	var scope=this;
	if(this.autoResetPosition){
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
	}
}

BreastControler.prototype.setSpringValues=function(stiffness,damping,bodyDamping){
	function change(box){
		var dof=box.getMesh().userData.dof;
		AmmoUtils.seteAllStiffness(dof,stiffness);
		AmmoUtils.seteAllDamping(dof,damping);
		box.getBody().setDamping(bodyDamping,bodyDamping);
	}
	change(this.breastBoxR);
	change(this.breastBoxL);
}

BreastControler.prototype.newBreast=function(){

	
	 this._destroyBreast();
	 
	 var boneList=this.boneAttachControler.getBoneList(); 
	 this.breastBoxR=this.createBreastBox(this.breastRContainer,boneList[this.breastR],true);
	 this.breastBoxL=this.createBreastBox(this.breastLContainer,boneList[this.breastL]);
	 
	 //ap.signals.visibleAmmoChanged.dispatch();
}

BreastControler.prototype.createBreastBox=function (breastContainer,targetBone,opposite){
	var ammoContainer=this.ammoContainer;
	var ammoControler=this.ammoControler;
	
	 opposite==undefined?false:opposite;
	 var op=1;
	 if(opposite){
		 op=-1;
	 }
	 var diff=new THREE.Vector3(this.breastPosX*op,this.breastPosY,this.breastPosZ);
	 
	 this.maxDistance=diff.length()*2;
	 
	 
	 
	 var bdiff=breastContainer.position.clone().sub(ammoContainer.position);
	 var breastBase=this.ammoControler.createBox(new THREE.Vector3(1, 1, 1), 0, bdiff.x,bdiff.y,bdiff.z, 
				new THREE.MeshPhongMaterial({color:0x000088})
		);
	 ammoContainer.add(breastBase.getMesh());
	 breastBase.syncWorldMatrix=true;
	 breastBase.syncBodyToMesh=false;
	 breastBase.getMesh().updateMatrixWorld(true);
	 breastBase.syncTransform(ammoControler);
	 
	 var p=new THREE.Vector3().setFromMatrixPosition(breastBase.getMesh().matrixWorld);
	 var breastBox=this.ammoControler.createSphere(this.breastSize, .1,p.x+ diff.x,p.y+diff.y,p.z+diff.z, 
							new THREE.MeshPhongMaterial({color:0x000088})
				 );
	 
	 var resetBox=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial({color:0x00ff00}));
	 resetBox.material.visible=false;
	 resetBox.position.copy(diff);
	 breastBase.getMesh().add(resetBox);
	 
	 AmmoUtils.setLinearFactor(breastBox.getBody(),1,1,1);
	 var factorX=this.lockX==true?0:1;
	 var factorY=this.lockY==true?0:1;
	 var factorZ=this.lockZ==true?0:1;
	 AmmoUtils.setAngularFactor(breastBox.getBody(),factorX,factorY,factorZ);//no z
	 
	 
	 breastBox.getBody().setDamping(this.bodyDamping,this.bodyDamping);
	 breastBox.getBody().setActivationState(AmmoUtils.DISABLE_DEACTIVATION);
	 breastBox.syncBone=true;
	 breastBox.targetBone=targetBone;
	 
	 breastBox.syncWorldMatrix=false;
	 breastBox.parentBodyAndMesh=breastBase;
	 //connect
	var frameInA=application.ammoControler.makeTemporaryTransform();
	var frameInB=application.ammoControler.makeTemporaryTransform();
	AmmoUtils.copyFromVector3(frameInA.getOrigin(),diff.clone().negate());
	var constraint=application.ammoControler.createGeneric6DofSpringConstraint(
			breastBox,breastBase, frameInA,frameInB,false,true);
	
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
	
	breastBox.getMesh().userData.constraint=constraint;
	breastBox.getMesh().userData.dof=dof;
	breastBox.getMesh().userData.breastBase=breastBase;
	breastBox.getMesh().userData.resetBox=resetBox;
	
	 return breastBox;
}






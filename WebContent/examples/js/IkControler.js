var IkControler=function(boneAttachControler,ap){
if(ap==undefined){
	console.error("IkControler need ap to catch signals");
	return;
}
this.ap=ap;

this.iks={};
this.ikTarget=null;
this.ikIndices=null;

this.ikLockX=false;
this.ikLockY=false;
this.ikLockZ=false;

this.boneLocked={};
this.ikBoneSelectedOnly=false;
this.ikLimitkRotationEnabled=true;

this.ikLimitMin={};
this.ikLimitMax={};
this.ikDefaultLimitMin={};
this.ikDefaultLimitMax={};

this.maxAngle=1;
this.iteration=25;

this.boneSelectedIndex=0;

this.boneAttachControler=boneAttachControler;
this.lastTargetMovedPosition=new THREE.Vector3();
this._euler=new THREE.Euler();
this.logging=false;

this.ikTargets={};

this.ikBoneRatio={};

this.followOtherIkTargets=true;

this.ikPresets=null;

this._pos=new THREE.Vector3();


this.onIkSelectionChanged=function(ikName){
	var newTarget=ap.ikControler.getIkTargetFromName(ikName);
	ap.signals.transformSelectionChanged.dispatch(newTarget);
	}

if(!ap.signals){
	console.error("call after signals initialized");
	return;
	}

if(ap.signals.ikSelectionChanged){
	ap.signals.ikSelectionChanged.add(this.onIkSelectionChanged);
	}


this._initialized=false;
this._enabled=true;//just visible
};

IkControler.prototype.setEnabled=function(enabled){
	this._enabled=enabled;
	var scope=this;
	var values=scope.getIkTargetsValue();
	values.forEach(function(target){
		target.material.visible=enabled;
		var name=scope.getIkNameFromTarget(target);
		var enableEndSite=scope.isEnableEndSiteByName(name);
		if(enableEndSite){
			scope.setEndSiteVisible(name,enabled);
		}
	});
};
IkControler.prototype.isEnabled=function(){
	return this._enabled;
}


IkControler.prototype.setBoneAttachControler=function(boneAttachControler){
	this.boneSelectedIndex=0;
	this.boneAttachControler=boneAttachControler;
	this.resetIkSettings();
	
	
	this.resetAllIkTargets();
}
IkControler.prototype.resetIkSettings=function(){
	var list=this.boneAttachControler.containerList;
	this.ikSettings.endSites.forEach(function(endsite){
		var index=endsite.userData.endSiteIndex;
		list[index].add(endsite);
		list[index].add(endsite.userData.joint);
		list[index].userData.endsite=endsite;
	});
}

IkControler.prototype.initialize=function(ikSettings){
	var ap=this.ap;
	this.ikSettings=ikSettings;
	this.ikTargets=ikSettings.ikTargets;
	//TODO ikSettings move somewhere for switch settings
	
	//ap.objects.push(ikBox);//TODO do at init
	//ap.scene.add(ikBox);
	
	ap.getSignal("boneSelectionChanged").add(function(index){
		ap.ikControler.boneSelectedIndex=index;
	});
	
	ap.getSignal("poseChanged").add(function(){
		ap.ikControler.resetAllIkTargets();
	});
	ap.getSignal("solveIkCalled").add(function(){
		ap.ikControler.solveIk(true);
	});
	
	/*
	 ikControler call when onTransformFinished for editor
	 rotationControler call when edited
	 */
	ap.getSignal("boneRotationChanged").add(function(index){
		var selection=ap.ikControler.getSelectedIkName();
		ap.ikControler.resetAllIkTargets(selection);
		
		if(index==0){
			ap.signals.boneTranslateChanged.dispatch();//I'm not sure this is need?
		}
	});
	this._initialized=true;
}

IkControler.prototype.isInitialized=function(){
	return this._initialized;
}


IkControler.prototype.getIkNameFromTarget=function(target){
	if(target.userData.ikName){
		return target.userData.ikName;
	}else{
		//deprecated
		return target.ikName;
	}
}

IkControler.prototype.getIkTargetFromName=function(ikName){
	return this.ikTargets[ikName];
}
IkControler.prototype.getIkTargetsValue=function(){
	return Object.values(this.ikTargets);
}

IkControler.prototype.setPresets=function(ikPresets){
	this.ikPresets=ikPresets;
}

IkControler.prototype.getPresets=function(){
	return this.ikPresets;
}

IkControler.prototype.getBoneList=function(){
	return this.boneAttachControler.boneList;
}

IkControler.prototype.getIndices=function(name){
	return this.iks[name];
}

IkControler.prototype.setBoneRatio=function(name,ratio){
	this.ikBoneRatio[name]=ratio;
}
IkControler.prototype.getBoneRatio=function(name){
	return this.ikBoneRatio[name]==undefined?1:this.ikBoneRatio[name];
}

IkControler.prototype.getBoneList=function(){
	return this.boneAttachControler.boneList;
}

IkControler.prototype.getSelectedIkName=function(){
	return this.ikTarget!=null?this.ikTarget.ikName:null;
}

IkControler.prototype.getIkNames=function(){
	return Object.keys(this.iks);
}

IkControler.prototype.isEnableEndSiteByName=function(name){
	var target=this.ikTargets[name];
	var indices=this.iks[name];

	
	var index=indices[indices.length-1];
	var object=this.boneAttachControler.containerList[index];
	
	return this.enableEndSite(object);
}

IkControler.prototype.enableEndSite=function(object){
	return object.userData.endsite && object.userData.endsite.userData.enabled == true;
}

IkControler.prototype.resetIkTargetPosition=function(name){
	var target=this.ikTargets[name];
	var indices=this.iks[name];

	
	var index=indices[indices.length-1];
	var lastMesh=this.boneAttachControler.containerList[index];
	
	var position=this.getLastPosition(name);
	
	target.position.copy(position);
}

IkControler.prototype.getLastPosition=function(name){
	var target=this.ikTargets[name];
	var indices=this.iks[name];
	var index=indices[indices.length-1];
	var lastMesh=this.boneAttachControler.containerList[index];
	var position=lastMesh.position;
	
	if(this.enableEndSite(lastMesh)){
		position=lastMesh.userData.endsite.getWorldPosition(this._pos);
	}
	return position;
}
IkControler.prototype.setEndSiteEnabled=function(name,enabled){

	var target=this.ikTargets[name];
	if(target==undefined){
		console.error("setEndSiteEnabled:No target found ",name);
	}
	var indices=this.iks[name];

	var index=indices[indices.length-1];

	var lastMesh=this.boneAttachControler.containerList[index];

	lastMesh.userData.endsite.userData.enabled=enabled;
	lastMesh.userData.endsite.material.visible=enabled;
	lastMesh.userData.endsite.userData.joint.material.visible=enabled;
}
IkControler.prototype.setEndSiteVisible=function(name,visible){

	var target=this.ikTargets[name];
	if(target==undefined){
		console.error("setEndSiteEnabled:No target found ",name);
	}
	var indices=this.iks[name];

	var index=indices[indices.length-1];

	var lastMesh=this.boneAttachControler.containerList[index];

	lastMesh.userData.endsite.material.visible=visible;
	lastMesh.userData.endsite.userData.joint.material.visible=visible;
}

IkControler.prototype.resetAllIkTargets=function(exclude){
	var scope=this;
	this.boneAttachControler.update();
	Object.keys(this.ikTargets).forEach(function(key){
		if(key!=exclude)
			scope.resetIkTargetPosition(key);
	});
}
IkControler.prototype.setIkTarget=function(target){
	if(target==null){
		this.ikIndices=null;
		this.ikTarget=null;
	}else{
		this.ikTarget=target;
		this.ikIndices=this.iks[target.ikName];
	}
}
IkControler.prototype.solveOtherIkTargets=function(){
	var current=this.ikTarget;
	var scope=this;
	Object.values(this.ikTargets).forEach(function(target){
		scope.setIkTarget(target);
		if(current!=target){
			scope.solveIk();
		}
	});
	this.setIkTarget(current);
}


IkControler.prototype.onTransformSelectionChanged=function(target){
	var ap=this.ap;
	var scope=this;
	if(ap.signals.ikSelectionChanged){
		ap.signals.ikSelectionChanged.remove(this.onIkSelectionChanged);
		}
	
	function onNotSelected(){
		scope.setIkTarget(null);
		if(ap.signals.ikSelectionChanged){
			ap.signals.ikSelectionChanged.dispatch(null);
		}
	}
	
	if(target==null){
		onNotSelected();
	}else if(target.userData.transformSelectionType=="BoneIk"){
		ap.transformControls.setMode( "translate" );
		this.setIkTarget(target);
		ap.transformControls.attach(target);
		
		if(ap.signals.ikSelectionChanged){
			ap.signals.ikSelectionChanged.dispatch(target.ikName);
		}
	}else{//other
		onNotSelected();
	}
	if(ap.signals.ikSelectionChanged){
		ap.signals.ikSelectionChanged.add(this.onIkSelectionChanged);
		}
}

IkControler.prototype.onTransformChanged=function(target){
	if(target!=null && target.userData.transformSelectionType=="BoneIk"){
		this.solveIk();
		
		//solve others,TODO independent
		if(!this.followOtherIkTargets){
			this.solveOtherIkTargets();
		}
	}
}

IkControler.prototype.onTransformStarted=function(target){
	if(target!=null && target.userData.transformSelectionType=="BoneIk"){
		
	}
}
IkControler.prototype.onTransformFinished=function(target){
var scope=this;
if(target!=null && target.userData.transformSelectionType=="BoneIk"){
	if(!scope.ap.signals.boneRotationChanged){
		console.log("no scope.ap.signals.boneRotationChanged");
		return;
	}
	var name=this.ikTarget.ikName;
	var indices=this.iks[name];
	indices.forEach(function(index){
		scope.ap.signals.boneRotationChanged.dispatch(index);
		if(scope.ap.signals.boneRotationFinished){
			scope.ap.signals.boneRotationFinished.dispatch(index);
			}
	})
	
	}
}


IkControler.prototype.solveIk=function(forceUpdate){
	
	var forceUpdate=forceUpdate!=undefined?forceUpdate:false;
	var scope=this;
	
	function getEndSitePos(lastMesh){
		var position=lastMesh.position;
		if(scope.enableEndSite(lastMesh)){
			position=lastMesh.userData.endsite.getWorldPosition(scope._pos);
		}
		return position;
	}
	
	
	if(this.ikTarget==null){
		if(this.logging){
			console.log("ikTarget is null");
		}
		return;
	}	
	
	var lastMesh=this.boneAttachControler.containerList[this.ikIndices[this.ikIndices.length-1]];
	var targetMesh=this.ikTarget;
	
	
	
	var targetPos=targetMesh.position;
	if(this.lastTargetMovedPosition.equals(targetPos) && forceUpdate==false){
		//this Ik need move or force
		if(this.logging){
			console.log("lastTargetMovedPosition same as targetPos forceUpdate=",forceUpdate);
		}
		return;
	}
	this.lastTargetMovedPosition.copy(targetPos);
	
	
	if(this.ikTarget.position.equals(getEndSitePos(lastMesh))){
		//no need to solve,just reseted
		return;
	}
	
	
	for(var j=0;j<this.iteration;j++){
	
	
	
	var ikIndicesLength=scope.enableEndSite(lastMesh)?this.ikIndices.length:this.ikIndices.length-1;
	for(var i=0;i<ikIndicesLength;i++){
		var ikBoneIndex=this.ikIndices[i];
		if(this.ikBoneSelectedOnly && ikBoneIndex!=this.boneSelectedIndex){
			continue;
		}
		
		var lastJointPos=getEndSitePos(lastMesh);
		
		
		var bone=this.boneAttachControler.boneList[ikBoneIndex];
		var name=bone.name;
		var joint=this.boneAttachControler.containerList[this.ikIndices[i]];
		var jointPos=joint.position;
		
		if(this.boneLocked[name]){
			continue;
		}
		
		
		var jointRotQ=joint.quaternion;
		
		//TODO improve,maybe never happen exactlly equals
		if(targetPos.equals(lastJointPos)){
			if(this.logging){
				console.log("no need ik, skipped");
			}
			return;
		}
		
		//var newQ=IkUtils.calculateAngles(lastJointPos,jointPos,jointRotQ,targetPos,this.maxAngle,false);
		
		var inverseQ=bone.parent.getWorldQuaternion(new THREE.Quaternion()).inverse();
		if(!bone.parent.isBone){
			inverseQ=new THREE.Quaternion();//no parent;
		}
		
		var maxAngle=this.maxAngle*this.getBoneRatio(bone.name);
		
		var newQ=IkUtils.stepCalculate2(inverseQ,lastJointPos,jointPos,targetPos,maxAngle);
		
		
		if(newQ==null){
			//maybe so small
			continue;
		}
		
		var order=bone.rotation.order;
		var euler=this._euler.setFromQuaternion(newQ,order);
		
		var r=bone.rotation;
		
		var x=r.x;
		var y=r.y;
		var z=r.z;
		
		if(this.ikLimitkRotationEnabled){
			function toDegree(v1,v2){
				var tmp=THREE.Math.radToDeg(v1+v2);
				if(tmp>180){
					tmp-=360;
				}
				if(tmp<-180){
					tmp+=180;
				}
				//console.log(v1,v2,tmp);
				return tmp;
			}
			
			if(!this.ikLimitMin[bone.name]){
				console.log("no ikLimitMin",bone.name);
			}
			
			var tmpX=toDegree(x,euler.x);
			if(!this.ikLockX && tmpX >= this.ikLimitMin[bone.name].x && tmpX<=this.ikLimitMax[bone.name].x){
				x=x+euler.x;
			//console.log(bone.name,"ok",this.ikLimitMin[bone.name].x,this.ikLimitMax[bone.name].x,tmpX);
			}else{
				if(this.logging)
				console.log(bone.name,"limit-x",this.ikLimitMin[bone.name].x,this.ikLimitMax[bone.name].x,tmpX);
			}
			var tmpY=toDegree(y,euler.y);
			if(!this.ikLockY && tmpY >=this.ikLimitMin[bone.name].y && tmpY<=this.ikLimitMax[bone.name].y){
				y=y+euler.y;
			}else{
				if(this.logging)
				console.log(bone.name,"limit-y",this.ikLimitMin[bone.name].y,this.ikLimitMax[bone.name].y,tmpY);
			}
			var tmpZ=toDegree(z,euler.z);
			if(!this.ikLockZ && tmpZ >=this.ikLimitMin[bone.name].z && tmpZ<=this.ikLimitMax[bone.name].z){
				z=z+euler.z;
			}else{
				if(this.logging)
				console.log(bone.name,"limit-z",this.ikLimitMin[bone.name].z,this.ikLimitMax[bone.name].z,tmpZ);
			}
			
			//fix rad
			if(x>Math.PI){
				x-=Math.PI*2;
			}
			if(y>Math.PI){
				y-=Math.PI*2;
			}
			if(z>Math.PI){
				z-=Math.PI*2;
			}
			if(x<-Math.PI){
				x+=Math.PI*2;
			}
			if(y<-Math.PI){
				y+=Math.PI*2;
			}
			if(z<-Math.PI){
				z+=Math.PI*2;
			}
		}else{
			x=x+euler.x;
			y=y+euler.y;
			z=z+euler.z;
		}
		
		bone.rotation.set(x,y,z);
		this.boneAttachControler.update();
		
		
	}
	}
	
	if(this.followOtherIkTargets){
		this.resetAllIkTargets(this.ikTarget.ikName);
	}
};
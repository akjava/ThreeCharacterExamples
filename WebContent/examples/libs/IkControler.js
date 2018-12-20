var IkControler=function(boneAttachControler,ap){
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

this.followOtherIkTargets=true;
this.ap=ap;

this._pos=new THREE.Vector3();
};

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
	
	return object.userData.endsite && object.userData.endsite.material.visible;
}

IkControler.prototype.enableEndSite=function(object){
	return object.userData.endsite && object.userData.endsite.material.visible;
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

	lastMesh.userData.endsite.material.visible=enabled;
	lastMesh.userData.endsite.userData.joint.material.visible=enabled;
}

IkControler.prototype.resetAllIkTargets=function(exclude){
	var scope=this;
	this.boneAttachControler.update();
	Object.keys(this.ikTargets).forEach(function(key){
		if(key!=exclude)
			scope.resetIkTargetPosition(key);
	});
}

IkControler.prototype.onTransformSelectionChanged=function(target){
	var ap=this.ap;
	var scope=this;
	if(target==null){
		this.ikIndices=null;
		this.ikTarget=null;
	}else if(target.userData.transformSelectionType=="BoneIk"){
		ap.transformControls.setMode( "translate" );
		this.ikTarget=target;
		this.ikIndices=ap.ikControler.iks[target.ikName];
		ap.transformControls.attach(target);
	}else{//other
		this.ikTarget=null;
		this.ikIndices=null;
	}
}

IkControler.prototype.onTransformStarted=function(target){
	if(target!=null && target.userData.transformSelectionType=="BoneIk"){
		
	}
}
IkControler.prototype.onTransformFinished=function(target){
var scope=this;
if(target!=null && target.userData.transformSelectionType=="BoneIk"){
	var name=this.ikTarget.ikName;
	var indices=this.iks[name];
	indices.forEach(function(index){
		scope.ap.signals.boneRotationChanged.dispatch(index);
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
		return;
	}	
	
	var lastMesh=this.boneAttachControler.containerList[this.ikIndices[this.ikIndices.length-1]];
	var targetMesh=this.ikTarget;
	
	
	
	var targetPos=targetMesh.position;
	if(this.lastTargetMovedPosition.equals(targetPos) && forceUpdate==false){
		//this Ik need move or force
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
		
		var inverseQ=bone.parent.clone().getWorldQuaternion(new THREE.Quaternion()).inverse();
		var newQ=IkUtils.stepCalculate2(inverseQ,lastJointPos,jointPos,targetPos,this.maxAngle);
		
		
		if(newQ==null){
			//maybe so small
			continue;
		}
		
		
		var euler=this._euler.setFromQuaternion(newQ);
		
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
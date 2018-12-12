var IkControler=function(boneAttachControler,ap){
console.log("IkControler");
this.boneAttachControler=boneAttachControler;
this.lastTargetMovedPosition=new THREE.Vector3();
this._euler=new THREE.Euler();
this.logging=false;

this.ap=ap;
};

IkControler.prototype.solveIk=function(forceUpdate){
	var forceUpdate=forceUpdate!=undefined?forceUpdate:false;
	
	var ap=this.ap;
	
	if(ap.ikTarget==null){
		return;
	}	
	
	var lastMesh=this.boneAttachControler.containerList[ap.ikIndices[ap.ikIndices.length-1]];
	var targetMesh=ap.ikTarget;
	
	
	
	var targetPos=targetMesh.position;
	if(this.lastTargetMovedPosition.equals(targetPos) && forceUpdate==false){
		//this Ik need move or force
		return;
	}
	this.lastTargetMovedPosition.copy(targetPos);
	
	
	if(ap.ikTarget.position.equals(lastMesh.position)){
		//no need to solve
		return;
	}
	
	
	for(var j=0;j<ap.iteration;j++){
	
	
	
	
	for(var i=0;i<ap.ikIndices.length-1;i++){
		var ikBoneIndex=ap.ikIndices[i];
		if(ap.ikBoneSelectedOnly && ikBoneIndex!=ap.boneSelectedIndex){
			continue;
		}
		
		var lastJointPos=lastMesh.position;
		
		
		var bone=this.boneAttachControler.boneList[ikBoneIndex];
		var name=bone.name;
		var joint=this.boneAttachControler.containerList[ap.ikIndices[i]];
		var jointPos=joint.position;
		
		if(ap.boneLocked[name]){
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
		
		var newQ=IkUtils.calculateAngles(lastJointPos,jointPos,jointRotQ,targetPos,ap.maxAngle,false);
		
		var inverseQ=bone.parent.clone().getWorldQuaternion(new THREE.Quaternion()).inverse();
		var newQ=IkUtils.stepCalculate2(inverseQ,lastJointPos,jointPos,targetPos,ap.maxAngle);
		
		
		if(newQ==null){
			//maybe so small
			continue;
		}
		
		
		var euler=this._euler.setFromQuaternion(newQ);
		
		var r=bone.rotation;
		
		var x=r.x;
		var y=r.y;
		var z=r.z;
		
		if(ap.ikLimitkRotationEnabled){
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
			
			var tmpX=toDegree(x,euler.x);
			if(!ap.ikLockX && tmpX >= ap.ikLimitMin[bone.name].x && tmpX<=ap.ikLimitMax[bone.name].x){
				x=x+euler.x;
			//console.log(bone.name,"ok",ap.ikLimitMin[bone.name].x,ap.ikLimitMax[bone.name].x,tmpX);
			}else{
				if(this.logging)
				console.log(bone.name,"limit-x",ap.ikLimitMin[bone.name].x,ap.ikLimitMax[bone.name].x,tmpX);
			}
			var tmpY=toDegree(y,euler.y);
			if(!ap.ikLockY && tmpY >=ap.ikLimitMin[bone.name].y && tmpY<=ap.ikLimitMax[bone.name].y){
				y=y+euler.y;
			}else{
				if(this.logging)
				console.log(bone.name,"limit-y",ap.ikLimitMin[bone.name].y,ap.ikLimitMax[bone.name].y,tmpY);
			}
			var tmpZ=toDegree(z,euler.z);
			if(!ap.ikLockZ && tmpZ >=ap.ikLimitMin[bone.name].z && tmpZ<=ap.ikLimitMax[bone.name].z){
				z=z+euler.z;
			}else{
				if(this.logging)
				console.log(bone.name,"limit-z",ap.ikLimitMin[bone.name].z,ap.ikLimitMax[bone.name].z,tmpZ);
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
};
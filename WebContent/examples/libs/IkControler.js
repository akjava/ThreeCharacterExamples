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

this.boneAttachControler=boneAttachControler;
this.lastTargetMovedPosition=new THREE.Vector3();
this._euler=new THREE.Euler();
this.logging=false;

this.ap=ap;
};

IkControler.prototype.solveIk=function(forceUpdate){
	var forceUpdate=forceUpdate!=undefined?forceUpdate:false;
	
	var ap=this.ap;
	
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
	
	
	if(this.ikTarget.position.equals(lastMesh.position)){
		//no need to solve
		return;
	}
	
	
	for(var j=0;j<this.iteration;j++){
	
	
	
	
	for(var i=0;i<this.ikIndices.length-1;i++){
		var ikBoneIndex=this.ikIndices[i];
		if(this.ikBoneSelectedOnly && ikBoneIndex!=ap.boneSelectedIndex){
			continue;
		}
		
		var lastJointPos=lastMesh.position;
		
		
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
		
		var newQ=IkUtils.calculateAngles(lastJointPos,jointPos,jointRotQ,targetPos,this.maxAngle,false);
		
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
};
/*
 * seems somttime  work with BoneUtils.convertToZeroRotatedBoneMesh() mesh,
 * however angle still broken.
 */
var BoneAttachControler=function(skinnedMesh,param){
	param=param!==undefined?param: {color: 0x880000,boxSize:0.5};
	param.visible=false;
	var boxSize=param.boxSize;
	var material={color:param.color};
	
	this.skinnedMesh=skinnedMesh;
	skinnedMesh.updateMatrixWorld(true);
	this.boneList=BoneUtils.getBoneList(skinnedMesh);
	this.parentIndexs={};
	this.containerList=[];
	this.updateAll=true;
	
	this.object3d=new THREE.Group();
	var scope=this;
	
	this.defaultBoneMatrixs=[];
	
	this.boneList.forEach(function(bone){
		var name=bone.name;
		var list=[];
		while(bone && bone.isBone){
			list.push(bone);
			bone=bone.parent;
		}
		scope.parentIndexs[name]=list;
		var container=new THREE.Mesh( new THREE.BoxGeometry(boxSize,boxSize,boxSize), new THREE.MeshPhongMaterial( material) );
		scope.containerList.push(container);
		container.userData.bone=list[0];
		scope.object3d.add(container);
		//container.matrixAutoUpdate=false;
		
		
	});
	
	
	
	
	
	this._boneMatrix=new THREE.Matrix4();
	this._matrixWorldInv=new THREE.Matrix4();
	this._quaternion=new THREE.Quaternion();
	
	this.update();
	
	this.boneList.forEach(function(bone){
		scope.defaultBoneMatrixs.push(bone.matrixWorld.clone());
	});
};

BoneAttachControler.prototype.getDefaultBonePosition=function(index){
	var matrix=this.defaultBoneMatrixs[index];
	var position=new THREE.Vector3();
	
	this._matrixWorldInv.getInverse( this.object3d.matrixWorld );
	this._boneMatrix.multiplyMatrices( this._matrixWorldInv, matrix );
	position.setFromMatrixPosition(this._boneMatrix );
	
	return position;
}
BoneAttachControler.prototype.getBoneIndexByBoneName=function(name){
	var index=-1;
	for(var i=0;i<this.boneList.length;i++){
		if(this.boneList[i].name==name){
			index=i;
			break;
		}
	}
	return index;
}
BoneAttachControler.prototype.getContainerByBoneIndex=function(index){
	if(index<0){
		console.log("BoneAttachControler.getContainerByBoneIndex:index must be 0 or greater,"+index);
		return null;
	}
	return this.containerList[index];
}

BoneAttachControler.prototype.getContainerByBoneName=function(name){
	var index=this.getBoneIndexByBoneName(name);
	if(index==-1){
		console.log("BoneAttachControler.getContainerByBoneName:not containe,"+name);
		return null;
	}
	return this.containerList[index];
}


BoneAttachControler.prototype.update=function(){
	var scope=this;
	this._matrixWorldInv.getInverse( this.object3d.matrixWorld );
	this.object3d.getWorldQuaternion(this._quaternion);
	
	
	
	for(var i=0;i<this.boneList.length;i++){
		cube=this.containerList[i];
		bone=this.boneList[i];
		if(!this.updateAll && cube.children.length==0){
			continue;
		}
		bone.updateMatrixWorld(true);//without update, deley few frame position
		
		this._boneMatrix.multiplyMatrices( this._matrixWorldInv, bone.matrixWorld );
		cube.position.setFromMatrixPosition(this._boneMatrix );
		
		//Only This one OK!
		bone.getWorldQuaternion(cube.quaternion);
		cube.quaternion.multiply(this._quaternion);
		cube.updateMatrixWorld(true);//for attach
		
	}
}

BoneAttachControler.prototype.setVisible=function(visible){
	this.containerList.forEach(function(container){
		container.material.visible=visible;
	});
	
}

BoneAttachControler.prototype.computeBoundingBox=function(){
	if(this.containerList.length<2){
		console.log("computeBoundingBox need at least 1 bone");
		return;
	}
	//ignore root
	var pos=this.containerList[1].position;
	var minX=pos.x;
	var minY=pos.y;
	var minZ=pos.z;
	var maxX=pos.x;
	var maxY=pos.y;
	var maxZ=pos.z;
	for(var i=2;i<this.containerList.length;i++){
		pos=this.containerList[i].position;
		if(pos.x<minX)minX=pos.x;
		if(pos.y<minY)minY=pos.y;
		if(pos.z<minZ)minZ=pos.z;
		if(pos.x>maxX)maxX=pos.x;
		if(pos.y>maxY)maxY=pos.y;
		if(pos.z>maxZ)maxZ=pos.z;
	}
	var minBox = new THREE.Vector3 (minX, minY, minZ);
    var maxBox = new THREE.Vector3 (maxX, maxY, maxZ);
    this.boundingBox = new THREE.Box3 (minBox, maxBox);

}

BoneAttachControler.prototype.setVisible=function(visible){
	this.containerList.forEach(function(container){
		container.material.visible=visible;
	});
	
}
BoneAttachControler.prototype.setAllScale=function(scale){
	this.containerList.forEach(function(container){
		container.scale.setScalar(scale);
	});
	
}
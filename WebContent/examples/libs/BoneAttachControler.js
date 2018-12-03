/*
 * seems only work with BoneUtils.convertToZeroRotatedBoneMesh() mesh
 */
var BoneAttachControler=function(skinnedMesh,param){
	param=param!==undefined?param: {color: 0x880000,boxSize:0.5};
	param.visible=false;
	var boxSize=param.boxSize;
	
	this.boneList=BoneUtils.getBoneList(skinnedMesh);
	this.parentIndexs={};
	this.containerList=[];
	this.updateAll=true;
	
	this.object3d=new THREE.Group();
	var scope=this;
	
	this.boneList.forEach(function(bone){
		var name=bone.name;
		var list=[];
		while(bone && bone.isBone){
			list.push(bone);
			bone=bone.parent;
		}
		scope.parentIndexs[name]=list;
		var container=new THREE.Mesh( new THREE.BoxGeometry(boxSize,boxSize,boxSize), new THREE.MeshPhongMaterial( param) );
		scope.containerList.push(container);
		scope.object3d.add(container);
	});
	
	
	this._boneMatrix=new THREE.Matrix4();
	this._matrixWorldInv=new THREE.Matrix4();
};

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
	
	this._matrixWorldInv.getInverse( this.object3d.matrixWorld );
	
	
	for(var i=0;i<this.boneList.length;i++){
		cube=this.containerList[i];
		bone=this.boneList[i];
		if(!this.updateAll && cube.children.length==0){
			continue;
		}
		
		
		this._boneMatrix.multiplyMatrices( this._matrixWorldInv, bone.matrixWorld );
		cube.position.setFromMatrixPosition(this._boneMatrix );
		
		
		//i have no idea why cube.rotation.setFromRotationMatrix(boneMatrix); not working
		//cube.rotation.setFromRotationMatrix(this._boneMatrix );//not work?
		
		var list=this.parentIndexs[bone.name];
		var e=new THREE.Vector3();
		list.forEach(function(b){
			var tmpe=b.rotation;
			e.add(new THREE.Vector3(tmpe.x,tmpe.y,tmpe.z));
		});
		
		var euler=new THREE.Euler(e.x,e.y,e.z);
		cube.setRotationFromEuler(euler);
		
		
		
		
		cube.updateMatrixWorld(true);
	}
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
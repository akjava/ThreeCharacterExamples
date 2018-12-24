var IkPresets=function(ikControler,presets){
	presets=presets==undefined?{}:presets;
	this.ikControler=ikControler;
	this.presets=presets;
}

IkPresets.prototype.toJSON=function(){
	var keys=this.ikControler.getIkNames();
	var scope=this;
	
	var presets={};
	var json={presets:presets};
	
	keys.forEach(function(key){
		var array=scope.getIkPresetRotations(key);
		if(array){
			var jsonArray=[];
			array.forEach(function(preRot){
				jsonArray.push(preRot.toJSON());
			});
			presets[key]=jsonArray;
		}
	});
	
	return json;
}
IkPresets.prototype.getObjectContainer=function(){
	var ap=this.ikControler.ap;
	return ap.objects;
}

IkPresets.prototype.clearAll=function(){
	var keys=this.ikControler.getIkNames();
	var scope=this;
	keys.forEach(function(key){
		var array=scope.getIkPresetRotations(key);
		if(array){
			array.forEach(function(preRot){
				scope.removeIkPresetRotation(key,preRot);
			})
		}
	});
}

IkPresets.prototype.updateAll=function(){
	if(!this.ikControler){
		console.log("updateAll:no ikControler");
		return;
	}
	var keys=this.ikControler.getIkNames();
	var scope=this;
	keys.forEach(function(key){
		var array=scope.getIkPresetRotations(key);
		if(array){
			array.forEach(function(preRot){
				scope.updateIkPresetRotation(key,preRot);
			})
		}
	});
}

IkPresets.prototype.getIkPresetRotations=function(ikName){
	return this.presets[ikName];
}
IkPresets.prototype.removeIkPresetRotation=function(ikName,ikPresetRotation){
	var object3d=ikPresetRotation.object;
	this._removeObject3d(object3d);
	
	var array=this.presets[ikName];
	var index=array.indexOf(ikPresetRotation);
	array.splice(1, index);
}

IkPresets.prototype._removeObject3d=function(object3d){
	var scope=this;
	if(object3d!=null){
		object3d.parent.remove(object3d);
		
		//remove from 
		object3d.traverse(function(obj){
			scope.getObjectContainer();
			AppUtils.removeAllFromArray(scope.getObjectContainer(),[obj]);
		});
		//traverse
	}
}

IkPresets.prototype.updateIkPresetRotation=function(ikName,ikPresetRotation,onClick){
	//update object3d
	var scope=this;
	
	var object3d=ikPresetRotation.object;
	this._removeObject3d(object3d);
	
	var boneList=this.ikControler.getBoneList();
	var scope=this;
	onClick=onClick!==undefined?onClick:function(box){
		var presetIndices=box.userData.IkPresetIndices;
		var presetRotations=box.userData.IkPresetRotations;
	
		
		var ap=scope.ikControler.ap;
			for(var i=0;i<presetIndices.length;i++){
				var index=presetIndices[i];
				var bone=boneList[index];
				
				var rotation=presetRotations[i];
				bone.rotation.copy(rotation);
				ap.signals.boneRotationChanged.dispatch(index);
			}
			ap.ikControler.resetAllIkTargets();
		}
	
	var ikControler=this.ikControler;
	var ap=ikControler.ap;
	function addObject3d(indices,ikPresetRotation,onClick){
		
		var name=ikPresetRotation.name;
		var rotations=ikPresetRotation.rotations;

		var parentMesh=null;
		var box=null;
		for(var i=0;i<indices.length;i++){
			
			var index=indices[i];
			var bone=boneList[index];
			
			var parentIndex=boneList.indexOf(bone.parent);
			var parent=boneList[parentIndex];
			
			var pos=ikControler.boneAttachControler.getDefaultBonePosition(index);
			var parentPos=ikControler.boneAttachControler.getDefaultBonePosition(parentIndex);
		
			var diff=pos.clone().sub(parentPos);
			var needLineToParent=true;
			
			box=new THREE.Mesh(new THREE.BoxGeometry(2,2,2),new THREE.MeshBasicMaterial({color:0x000088,depthTest:false,transparent:true,opacity:.5}));
			
			if(parentMesh==null){
				parentMesh=ikControler.boneAttachControler.containerList[parentIndex];
				needLineToParent=false;
				ikPresetRotation.object=box;
			}
			
			
			
			box.name=name;
			box.renderOrder = 1;
			box.position.copy(diff);
			parentMesh.add(box);
			box.userData.transformSelectionType="IkPreset";
			scope.getObjectContainer().push(box);
			
			
			var presetIndices=[];
			var presetRotations=[];
			
			//copy need only
			for(var j=0;j<=i;j++){
				presetIndices.push(indices[j]);
				presetRotations.push(rotations[j]);
			}
			
			box.userData.IkPresetIndices=presetIndices;
			box.userData.IkPresetRotations=presetRotations;
			
			box.userData.IkPresetOnClick=onClick;
			
			
			var rad=rotations[i];
			box.rotation.set(rad.x,rad.y,rad.z);
			
			if(needLineToParent){
				var line=AppUtils.lineTo(parentMesh,box);
				line.material.depthTest=false;	
			}
			
			parentMesh=box;	
		}
	}
	var indices=this.ikControler.getIndices(ikName);
	
	addObject3d(indices,ikPresetRotation,onClick)
}

//add from manual
//Vector3 rotations
IkPresets.prototype.addDegreeRotations=function(ikName,rotations,name){
	var radRotations=[];
	function degToRad(xyz){
		return [THREE.Math.degToRad(xyz.x),THREE.Math.degToRad(xyz.y),THREE.Math.degToRad(xyz.z)];
	}
	
	rotations.forEach(function(rotation){
		var rad=degToRad(rotation);
		radRotations.push(new THREE.Euler().fromArray(rad));
	});
	
	this.addRotations(ikName,radRotations,name);
}

//Euler rotations
IkPresets.prototype.addRotations=function(ikName,rotations,name){
	var ikPresetRotation=new IkPresetRotation(name,rotations);
	var array=this.presets[ikName];
	if(array==undefined){
		array=[];
		this.presets[ikName]=array;
	}
	array.push(ikPresetRotation);
	
	//update object3d
	this.updateIkPresetRotation(ikName,ikPresetRotation)
}

IkPresets.prototype.addRotationsFromBone=function(name){
	var ikName=this.ikControler.getSelectedIkName();
	if(ikName==null){
		console.log("addRotationsFromBone:need ik Selection");
		return;
	}
	var rotations=[];
	var indices=this.ikControler.getIndices(ikName);
	
	var boneList=this.ikControler.getBoneList();
	indices.forEach(function(index){
		rotations.push(boneList[index].rotation.clone());
	});
	
	this.addRotations(ikName,rotations,name);
}

//ikControler is optional
IkPresets.parse=function(json,ikControler){
	var presets={};
	Object.keys(json.presets).forEach(function(key){
		var result=[];
		var list=json.presets[key];
		list.forEach(function(value){
		var obj=IkPresets.parseIkPresetRotations(value);
		
		result.push(obj);
		});
		presets[key]=result;
	});
	var ikPresets= new IkPresets(ikControler,presets);
	ikPresets.updateAll();
	return ikPresets;
}

IkPresets.parseIkPresetRotations=function(json){
	var name=json.name==undefined?"":json.name;
	var rotations=[];
	
	json.rotations.forEach(function(rotation){
		var euler=new THREE.Euler().fromArray(rotation);
		rotations.push(euler);
	});
	
	return new IkPresetRotation(name,rotations);
}

//rotations [euler]
var IkPresetRotation=function(name,rotations){
	this.name=name==undefined?"":name;
	this.rotations=rotations;
	this.object=null;//ref object3d
}
IkPresetRotation.prototype.toJSON=function(){
	var rots=[];
	this.rotations.forEach(function(euler){
		rots.push(euler.toVector3().toArray());
	})
	var json={name:this.name,
			rotations:rots,
			}
	return json;
}

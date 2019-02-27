var IkPresets=function(ikControler,presets){
	presets=presets==undefined?{}:presets;
	this.ikControler=ikControler;
	//ikControler.ikPresets=this;
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

IkPresets.prototype.dispose=function(){
	if(this.ikControler.logging)
		console.log("IkPresets dispose");
	this.clearAll();
}
IkPresets.prototype.clearAll=function(){
	var keys=this.ikControler.getIkNames();
	var scope=this;
	keys.forEach(function(key){
		var array=scope.getIkPresetRotations(key);
		if(array){
			var array2=array.concat();//removeIkPresetRotation use slice,which break loop
			array2.forEach(function(preRot){
				scope.removeIkPresetRotation(key,preRot);
			})
		}
	});
}
IkPresets.prototype.setVisible=function(ikName,value){
	var scope=this;
		var array=scope.getIkPresetRotations(ikName);
		if(array){
			array.forEach(function(preRot){
				if(preRot.object){
					preRot.object.traverse(function(obj){
						obj.material.visible=value;
					});
				}
			})
		}
	
}

IkPresets.prototype.updateVisibleAll=function(){
	var scope=this;
	var selection=this.ikControler.getSelectedIkName();
	var names=this.ikControler.getIkNames();
	names.forEach(function(name){
		
		var visible=name==selection?true:false;
		scope.setVisible(name,visible);
		if(scope.ikControler.logging)
			console.log("IkPresets visible",name ,visible);
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
	if(this.ikControler.logging)
		console.log("IkPresets removeIkPresetRotation",ikName,ikPresetRotation);
	var object3d=ikPresetRotation.object;
	this._removeObject3d(object3d);
	
	var array=this.presets[ikName];
	var index=array.indexOf(ikPresetRotation);
	array.splice(index,1 );
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
				
				var rotation=presetRotations[i]; //presetRotations has not order;
				bone.rotation.set(rotation.x,rotation.y,rotation.z);
				ap.signals.boneRotationChanged.dispatch(index);
			}
			ap.ikControler.resetAllIkTargets();
		}
	
	var ikControler=this.ikControler;
	var ap=ikControler.ap;
	function addObject3d(ikName,indices,ikPresetRotation,onClick){
		
		var name=ikPresetRotation.name;
		var rotations=ikPresetRotation.rotations;

		var parentMesh=null;
		var box=null;
		for(var i=0;i<indices.length;i++){
			
			var index=indices[i];
			var bone=boneList[index];
			
			var parentIndex=boneList.indexOf(bone.parent);
			if(parentIndex==-1){
				console.warn("IkPresets:not support root yet.temporary use same pos");
				parentIndex=index;
			}
			var parent=boneList[parentIndex];
			
			var pos=ikControler.boneAttachControler.getDefaultBonePosition(index);
			var parentPos=ikControler.boneAttachControler.getDefaultBonePosition(parentIndex);
		
			var diff=pos.clone().sub(parentPos);
			var needLineToParent=true;
			
			box=new THREE.Mesh(new THREE.BoxGeometry(2,2,2),new THREE.MeshBasicMaterial({visible:false,color:0x000088,depthTest:false,transparent:true,opacity:.5}));
			
			if(parentMesh==null){
				parentMesh=ikControler.boneAttachControler.containerList[parentIndex];
				needLineToParent=false;
				ikPresetRotation.object=box;
			}
			
			
			
			box.name="ikpreset-"+name+"-"+bone.name;
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
			box.userData.IkPresetIkName=ikName
			box.userData.IkPresetIndices=presetIndices;
			box.userData.IkPresetRotations=presetRotations;
			
			box.userData.IkPresetOnClick=onClick;
			
			
			var rad=rotations[i];
			box.rotation.set(rad.x,rad.y,rad.z,bone.rotation.order);
			
			if(needLineToParent){
				var line=AppUtils.lineTo(parentMesh,box);
				line.material.depthTest=false;	
				line.material.visible=false;	
			}
			
			parentMesh=box;	
		}
	}
	var indices=this.ikControler.getIndices(ikName);
	
	addObject3d(ikName,indices,ikPresetRotation,onClick)
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
		return false;
		return;
	}
	var rotations=[];
	var indices=this.ikControler.getIndices(ikName);
	
	var boneList=this.ikControler.getBoneList();
	indices.forEach(function(index){
		rotations.push(boneList[index].rotation.clone());
	});
	
	this.addRotations(ikName,rotations,name);
	return true;
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
IkPresetRotation.prototype.getDeepestObject=function(){
	var result=null;
	if(this.object){
		
		this.object.traverse(function(obj){
			if(obj.type=="Mesh"){
				result=obj;
			}//possible Line
		});
	}
	return result;
}

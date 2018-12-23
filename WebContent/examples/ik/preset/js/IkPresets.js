var IkPresets=function(ikControler,presets){
	presets=presets==undefined?{}:presets;
	this.ikControler=ikControler;
	this.presets=presets;
	
	console.log(this.ikControler);
}

IkPresets.prototype.updateIkPresetRotation=function(ikName,ikPresetRotation,onClick){
	//update object3d
	var object3d=ikPresetRotation.object;
	if(object3d!=null){
		object3d.parent.remove(object3d);
	}
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
		console.log(name,rotations);
		var parentMesh=null;
		var box=null;
		for(var i=0;i<indices.length;i++){
			
			var index=indices[i];
			var bone=boneList[index];
			
			var parentIndex=boneList.indexOf(bone.parent);
			var parent=boneList[parentIndex];
			
			var pos=ikControler.boneAttachControler.containerList[index].position;
			var parentPos=ikControler.boneAttachControler.containerList[parentIndex].position;
		
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
			ap.objects.push(box);//TODO change
			
			
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
IkPresets.prototype.addDegreeRotations=function(ikName,rotations,name){
	var radRotations=[];
	function degToRad(xyz){
		return [THREE.Math.degToRad(xyz.x),THREE.Math.degToRad(xyz.y),THREE.Math.degToRad(xyz.z)];
	}
	
	rotations.forEach(function(rotation){
		var rad=degToRad(rotation);
		radRotations.push(new THREE.Euler().fromArray(rad));
	});
	var ikPresetRotation=new IkPresetRotation(name,radRotations);
	var array=this.presets[ikName];
	if(array==undefined){
		array=[];
		this.presets[ikName]=array;
	}
	array.push(ikPresetRotation);
	
	//update object3d
	this.updateIkPresetRotation(ikName,ikPresetRotation)
}

IkPresets.parse=function(json){
	var presets={};
	Object.keys(json).forEach(function(key){
		var result=[];
		var list=json.key;
		Object.keys(list).forEach(function(value){
		var obj=IkPresets.parseIkPresetAngles(value);
		result.push(obj);
		});
		presets.key=result;
	});
	return new IkPresets(presets);
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
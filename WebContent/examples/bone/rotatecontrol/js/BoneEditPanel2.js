//TODO replace BoneEditPanel ,old one has no advantage.
var BoneEditPanel2 = function ( application ) {
	var ap=application;
	var scope=this;
	this.mesh=null;
	this.autoUpdate=true;
	
	
	
	
	var container=new UI.TitlePanel("Skeleton Pose Editor");
	
	var selectRow=new UI.Row();
	container.add(selectRow);
	var boneSelect=new UI.Select2();
	selectRow.add(boneSelect);
	
	function onBoneSelectionChanged(){
		var bone=BoneUtils.getBoneList(scope.mesh)[parseInt(boneSelect.getValue())];
		
		ap.selectedBone=bone;//TODO move to  local
		
		var name=ap.selectedBone.name;
		var euler=ap.currentBoneMatrix[name].rotation;
		
		var x=THREE.Math.radToDeg(euler.x).toFixed(2);
		var y=THREE.Math.radToDeg(euler.y).toFixed(2);
		var z=THREE.Math.radToDeg(euler.z).toFixed(2);
		boneAngleX.setValue(x);
		boneAngleY.setValue(y);
		boneAngleZ.setValue(z);
	}
	boneSelect.onChange(function(){
		var index=parseInt(boneSelect.getValue());
		ap.signals.boneSelectionChanged.dispatch(index);
	});
	
	ap.signals.boneSelectionChanged.add(function(index){
		boneSelect.setValue(index);
		onBoneSelectionChanged();
	});
	
	ap.signals.skinnedMeshChanged.add(function(mesh){
		scope.mesh=mesh;
		var op=BoneUtils.getBoneNameOptions(mesh);
		//var options=Mbl3dUtils.convertOptionsToMbl3d(op);
		var options=(op);
		
		boneSelect.setOptions(options);
		boneSelect.setValue(Object.values(options)[0]);
		
		ap.selectedBone=ap.skinnedMesh.skeleton.bones[0];
		
		if(ap.defaultBoneMatrix==undefined){
			var boneList=BoneUtils.getBoneList(mesh);
			ap.defaultBoneMatrix=BoneUtils.storeDefaultBoneMatrix(boneList);
			}
		
		if(ap.currentBoneMatrix==undefined){
			
			var boneList=BoneUtils.getBoneList(mesh);
			ap.currentBoneMatrix=BoneUtils.makeEmptyBoneMatrix(boneList);
		}
		
	});
	
	ap.signals.boneRotationChanged.add(function(index){
		var boneList=BoneUtils.getBoneList(scope.mesh);
		var name=boneList[index].name;
		
		//TODO minus from default-matrix
		ap.currentBoneMatrix[name].rotation.copy(boneList[index].rotation);
		
		if(index==parseInt(boneSelect.getValue())){
			onBoneSelectionChanged();
		}
		
	});
	
	function rotate(){
		//var name=Mbl3dUtils.shortenMbl3dBoneName(ap.selectedBone.name);
		var name=(ap.selectedBone.name);
		var rx=boneAngleX.getValue();
		var ry=boneAngleY.getValue();
		var rz=boneAngleZ.getValue();
		
		
		
		ap.currentBoneMatrix[name].rotation.x=THREE.Math.degToRad(rx);
		ap.currentBoneMatrix[name].rotation.y=THREE.Math.degToRad(ry);
		ap.currentBoneMatrix[name].rotation.z=THREE.Math.degToRad(rz);
		var q=BoneUtils.makeQuaternionFromXYZDegree(rx,ry,rz,ap.defaultBoneMatrix[name].rotation);
		ap.selectedBone.quaternion.copy(q);

		ap.selectedBone.updateMatrixWorld(true);
		
		ap.signals.poseChanged.dispatch();
	};
	
	function translate(){
		
		//var name=Mbl3dUtils.shortenMbl3dBoneName(ap.selectedBone.name);
		var name=(ap.selectedBone.name);
		var tx=boneMoveX.getValue();
		var ty=boneMoveY.getValue();
		var tz=boneMoveZ.getValue();
		
		ap.currentBoneMatrix[name].translate.set(tx,ty,tz);
		var pos=ap.defaultBoneMatrix[name].translate.clone();
		pos.add(ap.currentBoneMatrix[name].translate);
		ap.selectedBone.position.copy(pos);

		ap.selectedBone.updateMatrixWorld(true);
	};
	
container.add(new UI.SubtitleRow("Rotation"));
	
	var boneAngleX=new UI.NumberPlusMinus("X",-180,180,10,scope.boneAngleX,function(v){
		scope.boneAngleX=v;
		if(scope.autoUpdate){
			rotate();
			}
	},[1,5,15]);
	boneAngleX.text.setWidth("15px");
	container.add(boneAngleX);
	
	var boneAngleY=new UI.NumberPlusMinus("Y",-180,180,10,scope.boneAngleY,function(v){
		scope.boneAngleY=v;
		if(scope.autoUpdate){
			rotate();
			}
	},[1,5,15]);
	boneAngleY.text.setWidth("15px");
	container.add(boneAngleY);
	
	var boneAngleZ=new UI.NumberPlusMinus("Z",-180,180,10,scope.boneAngleZ,function(v){
		scope.boneAngleZ=v;
		if(scope.autoUpdate){
			rotate();
			}
	},[1,5,15]);
	boneAngleZ.text.setWidth("15px");
	container.add(boneAngleZ);
	
	
	//container.add(new UI.SubtitleRow("Translate"));
	
	var boneMoveX=new UI.NumberPlusMinus("X",-5,5,1,scope.boneMoveX,function(v){
		scope.boneMoveX=v;
		
		if(scope.autoUpdate){
			translate();
			}
	},[0.01,0.1]);
	boneMoveX.text.setWidth("15px");
	//container.add(boneMoveX);
	
	
	var boneMoveY=new UI.NumberPlusMinus("Y",-5,5,1,scope.boneMoveX,function(v){
		scope.boneMoveY=v;
		
		if(scope.autoUpdate){
			translate();
			}
	},[0.01,0.1]);
	boneMoveY.text.setWidth("15px");
	//container.add(boneMoveY);
	
	var boneMoveZ=new UI.NumberPlusMinus("Z",-5,5,1,scope.boneMoveX,function(v){
		scope.boneMoveZ=v;
		
		if(scope.autoUpdate){
			translate();
			}
	},[0.01,0.1]);
	boneMoveZ.text.setWidth("15px");
	//container.add(boneMoveZ);
	
	
	var p1=new UI.Row();
	var bt=new UI.Button("Reset All Bone To 0").onClick( function () {
		scope.mesh.skeleton.pose();
		Object.keys(ap.currentBoneMatrix).forEach(function(key){
			ap.currentBoneMatrix[key].translate.set(0,0,0);
			ap.currentBoneMatrix[key].rotation.set(0,0,0);
		});

		
		
		onBoneSelectionChanged();
	});
	p1.button1=bt;
	p1.add(bt);
	container.add(p1);
	container.buttons=p1;
	
	
	container.applyAllRotation=function(){
		var boneList=BoneUtils.getBoneList(scope.mesh);
		
		boneList.forEach(function(bone){
			var name=bone.name;
			var x=ap.currentBoneMatrix[name].rotation.x;
			var y=ap.currentBoneMatrix[name].rotation.y;
			var z=ap.currentBoneMatrix[name].rotation.z;
			
			var q=BoneUtils.makeQuaternionFromXYZRadian(x,y,z,ap.defaultBoneMatrix[name].rotation);
			bone.quaternion.copy(q);

			bone.updateMatrixWorld(true);
		});
		
		
	}
	
	return container;
}
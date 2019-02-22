//TODO replace BoneEditPanel ,old one has no advantage.
//link to Ik ap.ikControler.onTransformFinished(scope.target);
Sidebar.BoneRotate = function ( application ) {
	var ap=application;
	var scope=this;
	this.mesh=null;
	this.autoUpdate=true;
	
	
	
	
	var container=new UI.TitlePanel("Bone Rotate");
	
	var bt=new UI.ButtonRow("Select Bone Rotate",function(){
		var index=Number(boneSelect.getValue());
		var bone=BoneUtils.getBoneList(scope.mesh);
		var target=ap.rotationControler.rotationControls[bone[index].name];
		ap.getSignal("transformSelectionChanged").dispatch(target);
	});
	container.add(bt);
	
	
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
	
	ap.getSignal("boneSelectionChanged").add(function(index){
		boneSelect.setValue(index);
		onBoneSelectionChanged();
	});
	
	ap.getSignal("loadingModelFinished").add(function(mesh){
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
	
	function updateRotation(index){
		var boneList=BoneUtils.getBoneList(scope.mesh);
		var name=boneList[index].name;
		
		//TODO minus from default-matrix
		ap.currentBoneMatrix[name].rotation.copy(boneList[index].rotation);
		
		if(index==parseInt(boneSelect.getValue())){
			onBoneSelectionChanged();
		}
	}
	ap.getSignal("boneRotationChanged").add(function(index){
		var boneList=BoneUtils.getBoneList(scope.mesh);
		if(index==undefined){//update all
			for(var i=0;i<boneList.length;i++){
				updateRotation(i);
			}
		}else{
			updateRotation(index);
		}
		
	});
	
	function rotate(){
		//var name=Mbl3dUtils.shortenMbl3dBoneName(ap.selectedBone.name);
		var name=(ap.selectedBone.name);
		var rx=boneAngleX.getValue();
		var ry=boneAngleY.getValue();
		var rz=boneAngleZ.getValue();
		
		
		var order=ap.selectedBone.rotation.order;
		ap.currentBoneMatrix[name].rotation.x=THREE.Math.degToRad(rx);
		ap.currentBoneMatrix[name].rotation.y=THREE.Math.degToRad(ry);
		ap.currentBoneMatrix[name].rotation.z=THREE.Math.degToRad(rz);
		var q=BoneUtils.makeQuaternionFromXYZDegree(rx,ry,rz,ap.defaultBoneMatrix[name].rotation,order);
		ap.selectedBone.quaternion.copy(q);

		ap.selectedBone.updateMatrixWorld(true);
		
		var index=Number(boneSelect.getValue());
		ap.signals.boneRotationChanged.dispatch(index);
		ap.signals.boneRotationFinished.dispatch(index);
		
	};

	
	
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
	
	var p1=new UI.Row();
	var bt=new UI.Button("Reset All Bone Rotation To 0").onClick( function () {
		//scope.mesh.skeleton.pose();
		var boneList=BoneUtils.getBoneList(ap.skinnedMesh);
		for(var i=0;i<boneList.length;i++){
			boneList[i].rotation.set(0,0,0);
			ap.signals.boneRotationChanged.dispatch(i);
			ap.signals.boneRotationFinished.dispatch(i);
		}
		
		//for something TODO compatible
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
	
	return container;
}
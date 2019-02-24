
//link to Ik ap.ikControler.onTransformFinished(scope.target);
//has euler order,ignore bone rotation order
Sidebar.BoneRotateWithOrder = function ( application ) {
	var ap=application;
	var scope=this;
	this.mesh=null;
	this.autoUpdate=true;
	
	this.selectedBone=null;
	
	var boneList=null;
	
	var container=new UI.TitlePanel("Bone Rotate with Order");
	
	var selectRow=new UI.Row();
	container.add(selectRow);
	var boneSelect=new UI.Select2();
	selectRow.add(boneSelect);
	
	function onBoneSelectionChanged(){
		var bone=boneList[parseInt(boneSelect.getValue())];
		
		scope.selectedBone=bone;
		
		var euler=bone.rotation;
		
		orderList.setValue(euler.order);
		
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
		boneSelect.setValue(index);//duplicate?
		onBoneSelectionChanged();
	});
	
	ap.signals.loadingModelFinished.add(function(mesh){
		scope.mesh=mesh;
		var op=BoneUtils.getBoneNameOptions(mesh);
		var options=(op);
		
		boneSelect.setOptions(options);
		boneSelect.setValue(Object.values(options)[0]);
		
		scope.selectedBone=ap.skinnedMesh.skeleton.bones[0];
		boneList=BoneUtils.getBoneList(mesh);
		ap.signals.boneSelectionChanged.dispatch(0);
		
		boneList.forEach(function(bone){
			console.log(bone.name,bone.rotation.order);
		});
		
	});
	
	function updateRotation(index){
		if(index==parseInt(boneSelect.getValue())){
			onBoneSelectionChanged();
		}
	}
	
	ap.getSignal("boneRotationChanged").add(function(index){
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
		
		var rx=boneAngleX.getValue();
		var ry=boneAngleY.getValue();
		var rz=boneAngleZ.getValue();
		
		var order=orderList.getValue();
		
		
		var rad=AppUtils.degToRad({x:rx,y:ry,z:rz});
		scope.selectedBone.rotation.set(rad.x,rad.y,rad.z,order);
		
		scope.selectedBone.updateMatrixWorld(true);
		
		var index=boneSelect.getValue();
		ap.getSignal("boneRotationChanged").dispatch(index);
		ap.getSignal("boneRotationFinished").dispatch(index);
	};
	

	container.add(new UI.SubtitleRow("Rotation"));
	
	var orders=["XYZ","YXZ","ZXY","ZYX","YZX","XZY"];
	
	var orderList=new UI.ListRow("Order",orders,function(){
		rotate();
	},"XYZ");
	container.add(orderList);

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
	//container.add(p1);
	container.buttons=p1;

	
	return container;
}
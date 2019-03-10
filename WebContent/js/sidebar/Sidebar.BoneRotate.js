Sidebar.BoneRotate = function ( application ,enableSelectButton,enableOrder) {
	enableSelectButton=enableSelectButton==undefined?true:enableSelectButton;
	enableOrder=enableOrder==undefined?false:enableOrder;
	var ap=application;
	var scope=this;
	this.mesh=null;
	this.selectedBone=null;

	this.getBoneList=function(){
		console.log("hello2");
		return BoneUtils.getBoneList(scope.mesh);
	}
	
	function log(message,option1){
		if(ap.rotationControler && ap.rotationControler.logging){
			console.log(message,option1);
		}
	}
	
	
	var container=new UI.TitlePanel("Bone Rotate");
	container.setGetBoneList=function(f){
		scope.getBoneList=f;
	}
	
	if(enableSelectButton){
	var bt=new UI.ButtonRow("Select Bone Rotate",function(){
		var index=Number(boneSelect.getValue());
		var bone=scope.getBoneList();
		var target=ap.rotationControler.rotationControls[bone[index].name];
		ap.getSignal("transformSelectionChanged").dispatch(target);
	});
	container.add(bt);
	}
	
	
	var selectRow=new UI.Row();
	container.add(selectRow);
	var boneSelect=new UI.Select2();
	selectRow.add(boneSelect);
	
	
	ap.getSignal("poseChanged").add(function(){
		onBoneSelectionChanged();
	});
	
	function onBoneSelectionChanged(){
		var bone=scope.getBoneList()[parseInt(boneSelect.getValue())];
		
		scope.selectedBone=bone;//TODO move to  local
		
		var name=bone.name;
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
		log("Sidebar.BoneRotate dispatch boneSelectionChanged",index);
	});
	
	ap.getSignal("boneSelectionChanged").add(function(index){
		boneSelect.setValue(index);
		onBoneSelectionChanged();
	});
	
	ap.getSignal("loadingModelFinished").add(function(mesh){
		scope.mesh=mesh;
		var op=BoneUtils.boneListToOptions(scope.getBoneList());
		//var options=Mbl3dUtils.convertOptionsToMbl3d(op);
		var options=(op);
		
		boneSelect.setOptions(options);
		boneSelect.setValue(Object.values(options)[0]);
		
		scope.selectedBone=ap.skinnedMesh.skeleton.bones[0];	
	},undefined,52);
	
	ap.signals.loadingModelFinished.add(function(mesh){
		ap.signals.boneSelectionChanged.dispatch(0);
	});
	
	function updateRotation(index){
		var boneList=scope.getBoneList();
		var name=boneList[index].name;
		
		
		
		if(index==parseInt(boneSelect.getValue())){
			onBoneSelectionChanged();
		}
	}
	ap.getSignal("boneRotationChanged").add(function(index){
		var boneList=scope.getBoneList();
		if(index==undefined){//update all
			for(var i=0;i<boneList.length;i++){
				updateRotation(i);
			}
		}else{
			updateRotation(index);
		}
		
	});
	
	function rotate(){
		//var name=Mbl3dUtils.shortenMbl3dBoneName(scope.selectedBone.name);
		var bone=scope.selectedBone;
		var name=bone.name;
		var rx=boneAngleX.getValue();
		var ry=boneAngleY.getValue();
		var rz=boneAngleZ.getValue();
		
		
		
		
		var x=THREE.Math.degToRad(rx);
		var y=THREE.Math.degToRad(ry);
		var z=THREE.Math.degToRad(rz);
		
		bone.rotation.set(x,y,z,orderList.getValue());
		
		var index=Number(boneSelect.getValue());
		ap.getSignal("boneRotationChanged").dispatch(index);
		ap.getSignal("boneRotationFinished").dispatch(index);
		log("Sidebar.BoneRotate dispatch boneRotationChanged",index);
		log("Sidebar.BoneRotate dispatch boneRotationFinished",index);
		
		
	};

	var orders=BoneUtils.orders;
	
	var orderList=new UI.ListRow("Order",orders,function(){
		rotate();
	},"XYZ");
	
	if(enableOrder)
		container.add(orderList);
	
	var boneAngleX=new UI.NumberPlusMinus("X",-180,180,10,scope.boneAngleX,function(v){
		scope.boneAngleX=v;
		rotate();
	},[1,5,15]);
	boneAngleX.text.setWidth("15px");
	container.add(boneAngleX);
	
	var boneAngleY=new UI.NumberPlusMinus("Y",-180,180,10,scope.boneAngleY,function(v){
		scope.boneAngleY=v;
		rotate();
	},[1,5,15]);
	boneAngleY.text.setWidth("15px");
	container.add(boneAngleY);
	
	var boneAngleZ=new UI.NumberPlusMinus("Z",-180,180,10,scope.boneAngleZ,function(v){
		scope.boneAngleZ=v;
		rotate();
	},[1,5,15]);
	boneAngleZ.text.setWidth("15px");
	container.add(boneAngleZ);
	
	var p1=new UI.Row();
	var bt=new UI.Button("Reset All Bone Rotation To 0").onClick( function () {
		//scope.mesh.skeleton.pose();
		var boneList=scope.getBoneList();
		for(var i=0;i<boneList.length;i++){
			boneList[i].rotation.set(0,0,0);
			ap.getSignal("boneRotationChanged").dispatch(i);
			log("Sidebar.BoneRotate dispatch boneRotationChanged",i);
			
			ap.getSignal("boneRotationFinished").dispatch(i);
			log("Sidebar.BoneRotate dispatch boneRotationFinished",i);
		}
		
		
		
		onBoneSelectionChanged();
	});
	p1.button1=bt;
	p1.add(bt);
	container.add(p1);
	container.buttons=p1;
	
	return container;
}
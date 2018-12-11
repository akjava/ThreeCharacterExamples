var BoneLimitPanel=function(application){
	var ap=application;
	var scope=this;
	var container=new UI.TitlePanel("Limit Ik Rotation");
	
	var selectRow=new UI.Row();
	container.add(selectRow);
	var boneSelect=new UI.Select2();
	selectRow.add(boneSelect);
	
	function onBoneSelectionChanged(){
		var bone=BoneUtils.getBoneList(scope.mesh)[parseInt(boneSelect.getValue())];
		var name=bone.name;
		scope.selectionName=name;
		
		var min=scope.minRotation[name];
		if(min==undefined){//possible default only refer difference value
			min={x:-180,y:-180,z:-180};
		}
		
		minAngleX.setValue(min.x);
		minAngleY.setValue(min.y);
		minAngleZ.setValue(min.z);
		
		var max=scope.maxRotation[name];
		if(max==undefined){
			max={x:180,y:180,z:180};
		}
		
		maxAngleX.setValue(max.x);
		maxAngleY.setValue(max.y);
		maxAngleZ.setValue(max.z);
		
	}
	boneSelect.onChange(function(){
		var index=parseInt(boneSelect.getValue());
		ap.signals.boneSelectionChanged.dispatch(index);
	});
	
	if(ap.signals.boneSelectionChanged==undefined){
		console.error("LimitPanel need signals.boneSelectionChanged");
		return;
	}

	
	
	var boneSelectionChanged=function(index){
		ap.boneSelectedIndex=index;
		boneSelect.setValue(index);
		onBoneSelectionChanged();
	}
	ap.signals.boneSelectionChanged.add(boneSelectionChanged,null,10);
	
	
	ap.signals.boneLimitLoaded.add(function(newMinRotation,newMaxRotation){
		scope.minRotation=newMinRotation;
		scope.maxRotation=newMaxRotation;
		onBoneSelectionChanged();
		
	});
	
	
	this.minRotation={};
	this.maxRotation={};


	this.selectionName=null;
	
	
	if(ap.signals.skinnedMeshChanged==undefined){
		console.error("LimitPanel need signals.skinnedMeshChanged");
		return;
	}
	
	ap.signals.skinnedMeshChanged.add(function(mesh){
		scope.mesh=mesh;
		var op=BoneUtils.getBoneNameOptions(mesh);
		//var options=Mbl3dUtils.convertOptionsToMbl3d(op);
		var options=(op);
		
		boneSelect.setOptions(options);
		boneSelect.setValue(Object.values(options)[0]);
		var boneList=BoneUtils.getBoneList(mesh);
		
		AppUtils.clearObject(scope.minRotation);
		boneList.forEach(function(bone){
			scope.minRotation[bone.name]={};
			scope.minRotation[bone.name].x=-180;
			scope.minRotation[bone.name].y=-180;
			scope.minRotation[bone.name].z=-180;
		});
		
		AppUtils.clearObject(scope.maxRotation);
		boneList.forEach(function(bone){
			scope.maxRotation[bone.name]={};
			scope.maxRotation[bone.name].x=180;
			scope.maxRotation[bone.name].y=180;
			scope.maxRotation[bone.name].z=180;
		});
		
		
		ap.signals.boneSelectionChanged.dispatch(boneSelect.getValue());
		
		
	});

	
	var minRotation=new UI.SubtitleRow("Min Rotation");
	container.add(minRotation);
	function updateRotationMin(){
		var name=scope.selectionName;
		scope.minRotation[name].x=minAngleX.getValue();
		scope.minRotation[name].y=minAngleY.getValue();
		scope.minRotation[name].z=minAngleZ.getValue();
		//call
		if(ap.signals.boneLimitChanged){
			ap.signals.boneLimitChanged.dispatch(scope.minRotation,scope.maxRotation);
		}
	}
	
	var minAngleX=new UI.NumberPlusMinus("X",-180,180,10,-180,function(v){
		
			updateRotationMin();
			
	},[1,5,15],-180);
	minAngleX.text.setWidth("15px");
	container.add(minAngleX);
	
	var minAngleY=new UI.NumberPlusMinus("Y",-180,180,10,-180,function(v){
		
		updateRotationMin();
			
	},[1,5,15],-180);
	minAngleY.text.setWidth("15px");
	container.add(minAngleY);
	
	var minAngleZ=new UI.NumberPlusMinus("Z",-180,180,10,-180,function(v){
		
		updateRotationMin();
			
	},[1,5,15],-180);
	minAngleZ.text.setWidth("15px");
	container.add(minAngleZ);
	
	
	var maxRotation=new UI.SubtitleRow("Max Rotation");
	container.add(maxRotation);
	function updateRotationMax(){
		var name=scope.selectionName;
		scope.maxRotation[name].x=maxAngleX.getValue();
		scope.maxRotation[name].y=maxAngleY.getValue();
		scope.maxRotation[name].z=maxAngleZ.getValue();
		//call
		if(ap.signals.boneLimitChanged){
			ap.signals.boneLimitChanged.dispatch(scope.maxRotation,scope.maxRotation);
		}
	}
	
	var maxAngleX=new UI.NumberPlusMinus("X",-180,180,10,180,function(v){
		
		updateRotationMax();
			
	},[1,5,15],180);
	maxAngleX.text.setWidth("15px");
	container.add(maxAngleX);
	
	var maxAngleY=new UI.NumberPlusMinus("Y",-180,180,10,180,function(v){
		
		updateRotationMax();
			
	},[1,5,15],180);
	maxAngleY.text.setWidth("15px");
	container.add(maxAngleY);
	
	var maxAngleZ=new UI.NumberPlusMinus("Z",-180,180,10,180,function(v){
		
		updateRotationMax();
			
	},[1,5,15],180);
	maxAngleZ.text.setWidth("15px");
	container.add(maxAngleZ);
	
	return container;
}
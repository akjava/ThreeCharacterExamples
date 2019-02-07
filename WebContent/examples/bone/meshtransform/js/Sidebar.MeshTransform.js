Sidebar.MeshTransform=function(ap){
	var scope=this;
	var panel=new UI.TitlePanel("Mesh Transform");
	this.boneMoveX=0;
	this.boneMoveY=0;
	this.boneMoveZ=0;
	this.boneAngleX=0;
	this.boneAngleY=0;
	this.boneAngleZ=0;
	
	panel.add(new UI.Subtitle("Translate"));
	
	if(ap.signals.transformSelectionChanged){
	var bt=new UI.ButtonRow("Select Mesh",function(){
		ap.skinnedMesh.userData.transformMode="ObjectTranslate";
		ap.signals.transformSelectionChanged.dispatch(ap.skinnedMesh);
	});
	panel.add(bt);
	}else{
		console.log("no ap.signals.transformSelectionChanged and skipped making select button");
	}
	
	
	if(!ap.signals.skinnedMeshTransformed){
		console.error("need ap.signals.skinnedMeshTransformed");
		return;
	}
	
	ap.signals.skinnedMeshTransformed.add(function(){
		update();
	});
	
	var onSkinnedMeshTransformed=function(){
		update();
	}
	ap.signals.skinnedMeshTransformed.add(onSkinnedMeshTransformed);
	
	function update(){
		var pos=ap.skinnedMesh.position;

		
		
		scope.boneMoveX=pos.x;
		scope.boneMoveY=pos.y;
		scope.boneMoveZ=pos.z;
		
		boneMoveX.setValue(pos.x);
		boneMoveY.setValue(pos.y);
		boneMoveZ.setValue(pos.z);
		
		var rot=ap.skinnedMesh.rotation;
		var rx=THREE.Math.radToDeg(rot.x);
		var ry=THREE.Math.radToDeg(rot.y);
		var rz=THREE.Math.radToDeg(rot.z);
		
		scope.boneAngleX=rx;
		scope.boneAngleY=ry;
		scope.boneAngleZ=rz;
		
		boneAngleX.setValue(rx);
		boneAngleY.setValue(ry);
		boneAngleZ.setValue(rz);
	}
	
	function translate(){
		var pos=ap.skinnedMesh.position;
		pos.set(scope.boneMoveX,scope.boneMoveY,scope.boneMoveZ);
		ap.signals.skinnedMeshTransformed.remove(onSkinnedMeshTransformed);
		ap.signals.skinnedMeshTransformed.dispatch();
		ap.signals.skinnedMeshTransformed.add(onSkinnedMeshTransformed);
	}

	var boneMoveX=new UI.NumberPlusMinus("X",-500,500,1,scope.boneMoveX,function(v){
		scope.boneMoveX=v;
		translate();
	},[0.1,1,10]);
	boneMoveX.text.setWidth("15px");
	boneMoveX.number.setWidth("35px");
	panel.add(boneMoveX);
	
	
	var boneMoveY=new UI.NumberPlusMinus("Y",-500,500,1,scope.boneMoveX,function(v){
		scope.boneMoveY=v;
		
		translate();
	},[0.1,1,10]);
	boneMoveY.text.setWidth("15px");
	boneMoveY.number.setWidth("35px");
	panel.add(boneMoveY);
	
	var boneMoveZ=new UI.NumberPlusMinus("Z",-500,500,1,scope.boneMoveX,function(v){
		scope.boneMoveZ=v;
		
		translate();
	},[0.1,1,10]);
	boneMoveZ.text.setWidth("15px");
	boneMoveZ.number.setWidth("35px");
	panel.add(boneMoveZ);
	
	//rotate
	panel.add(new UI.Subtitle("Rotate"));
	if(ap.signals.transformSelectionChanged){
	var bt=new UI.ButtonRow("Select Mesh",function(){
		ap.skinnedMesh.userData.transformMode="ObjectRotate";
		ap.signals.transformSelectionChanged.dispatch(ap.skinnedMesh);
	});
	panel.add(bt);
	}
	
	function rotate(){
		var rotation=ap.skinnedMesh.rotation;
		var x=THREE.Math.degToRad(scope.boneAngleX);
		var y=THREE.Math.degToRad(scope.boneAngleY);
		var z=THREE.Math.degToRad(scope.boneAngleZ);
		rotation.set(x,y,z);
		ap.signals.skinnedMeshTransformed.remove(onSkinnedMeshTransformed);
		ap.signals.skinnedMeshTransformed.dispatch();
		ap.signals.skinnedMeshTransformed.add(onSkinnedMeshTransformed);
	}
	
	var boneAngleX=new UI.NumberPlusMinus("X",-180,180,10,scope.boneAngleX,function(v){
		scope.boneAngleX=v;
		rotate();
	},[1,5,15]);
	boneAngleX.text.setWidth("15px");
	panel.add(boneAngleX);
	
	var boneAngleY=new UI.NumberPlusMinus("Y",-180,180,10,scope.boneAngleY,function(v){
		scope.boneAngleY=v;
		rotate();
	},[1,5,15]);
	boneAngleY.text.setWidth("15px");
	panel.add(boneAngleY);
	
	var boneAngleZ=new UI.NumberPlusMinus("Z",-180,180,10,scope.boneAngleZ,function(v){
		scope.boneAngleZ=v;
		rotate();
	},[1,5,15]);
	boneAngleZ.text.setWidth("15px");
	panel.add(boneAngleZ);
	

	
	return panel;
}

Sidebar.ObjTransform=function(ap){
	var scope=this;
	var panel=new UI.TitlePanel("Obj Transform");
	this.boneMoveX=-5;
	this.boneMoveY=-3;
	this.boneMoveZ=0;
	this.boneAngleX=90;
	this.boneAngleY=0;
	this.boneAngleZ=0;
	this.scaleX=10;
	this.scaleY=10;
	this.scaleZ=10;
	
	panel.add(new UI.Subtitle("Translate"));
	
	this.targetMesh=null;
	
	ap.getSignal("objTransformTargetChanged").add(function(mesh){
		console.log(mesh);
		scope.targetMesh=mesh;
		
		translate();
		rotate();
		scaled();
		
	});
	
	var onTransformed=function(){
		update();
	}
	
	function update(){
		if(scope.targetMesh==null){
			return;
		}
		var pos=scope.targetMesh.position;
		
		scope.boneMoveX=pos.x;
		scope.boneMoveY=pos.y;
		scope.boneMoveZ=pos.z;
		
		boneMoveX.setValue(pos.x);
		boneMoveY.setValue(pos.y);
		boneMoveZ.setValue(pos.z);
		
		var rot=scope.targetMesh.rotation;
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
		if(scope.targetMesh==null){
			return;
		}
		var pos=scope.targetMesh.position;
		pos.set(scope.boneMoveX,scope.boneMoveY,scope.boneMoveZ);
		
	}

	var boneMoveX=new UI.NumberPlusMinus("X",-500,500,1,scope.boneMoveX,function(v){
		scope.boneMoveX=v;
		translate();
	},[0.1,1,10]);
	boneMoveX.text.setWidth("15px");
	boneMoveX.number.setWidth("35px");
	panel.add(boneMoveX);
	
	
	var boneMoveY=new UI.NumberPlusMinus("Y",-500,500,1,scope.boneMoveY,function(v){
		scope.boneMoveY=v;
		
		translate();
	},[0.1,1,10]);
	boneMoveY.text.setWidth("15px");
	boneMoveY.number.setWidth("35px");
	panel.add(boneMoveY);
	
	var boneMoveZ=new UI.NumberPlusMinus("Z",-500,500,1,scope.boneMoveZ,function(v){
		scope.boneMoveZ=v;
		
		translate();
	},[0.1,1,10]);
	boneMoveZ.text.setWidth("15px");
	boneMoveZ.number.setWidth("35px");
	panel.add(boneMoveZ);
	
	//rotate
	panel.add(new UI.Subtitle("Rotate"));
	function rotate(){
		if(scope.targetMesh==null){
			return;
		}
		var rotation=scope.targetMesh.rotation;
		var x=THREE.Math.degToRad(scope.boneAngleX);
		var y=THREE.Math.degToRad(scope.boneAngleY);
		var z=THREE.Math.degToRad(scope.boneAngleZ);
		rotation.set(x,y,z);
		
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
	
	function scaled(){
		if(scope.targetMesh==null){
			return;
		}
		var scale=scope.targetMesh.scale;
		scale.set(scope.scaleX,scope.scaleY,scope.scaleZ);
		
	}
	panel.add(new UI.Subtitle("Scale"));
	var scaleX=new UI.NumberButtons("X",0,200,10,scope.scaleX,function(v){
		scope.scaleX=v;
		scaled();
	},[0.1,1,10,100]);
	panel.add(scaleX);
	var scaleY=new UI.NumberButtons("Y",0,200,10,scope.scaleY,function(v){
		scope.scaleY=v;
		scaled();
	},[0.1,1,10,100]);
	panel.add(scaleY);
	var scaleZ=new UI.NumberButtons("Z",0,200,10,scope.scaleZ,function(v){
		scope.scaleZ=v;
		scaled();
	},[0.1,1,10,100]);
	panel.add(scaleZ);
	
	return panel;
}

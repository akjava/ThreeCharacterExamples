Sidebar.RootTranslate=function(ap){
	var scope=this;
	var panel=new UI.TitlePanel("Root Translate");
	this.boneMoveX=0;
	this.boneMoveY=0;
	this.boneMoveZ=0;
	
	ap.signals.skinnedMeshChanged.add(function(){
		update();
	});
	
	var onBoneTranslateChanged=function(){
		update();
	}
	ap.signals.boneTranslateChanged.add(onBoneTranslateChanged);
	
	function update(){
		var pos=ap.skinnedMesh.skeleton.bones[0].position;

		
		
		scope.boneMoveX=pos.x;
		scope.boneMoveY=pos.y;
		scope.boneMoveZ=pos.z;
		
		boneMoveX.setValue(pos.x);
		boneMoveY.setValue(pos.y);
		boneMoveZ.setValue(pos.z);
	}
	
	function translate(){
		
		var pos=ap.skinnedMesh.skeleton.bones[0].position;
		pos.set(scope.boneMoveX,scope.boneMoveY,scope.boneMoveZ);
		ap.signals.boneTranslateChanged.remove(onBoneTranslateChanged);
		ap.signals.boneTranslateChanged.dispatch();
		ap.signals.boneTranslateChanged.add(onBoneTranslateChanged);
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
	
	return panel;
}

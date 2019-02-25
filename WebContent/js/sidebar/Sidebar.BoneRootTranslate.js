Sidebar.BoneRootTranslate=function(ap){
	var scope=this;
	var panel=new UI.TitlePanel("Bone Root Translate");
	this.boneMoveX=0;
	this.boneMoveY=0;
	this.boneMoveZ=0;
	
	
	
	var bt=new UI.ButtonRow("Select Bone Translate",function(){
		var target=ap.translateControler.translateControls["root"];
		ap.getSignal("transformSelectionChanged").dispatch(target);
	});
	panel.add(bt);
	
	
	
	
	
	var onTranslateChanged=function(){
		update();
	}
	ap.getSignal("poseChanged").add(onTranslateChanged);
	
	ap.getSignal("boneTranslateChanged").add(onTranslateChanged);
	
	function getRoot(){
		return BoneUtils.getBoneList(ap.skinnedMesh)[0];
	}
	function update(){
		var pos=getRoot().position.clone().multiplyScalar(ap.skinnedMesh.scale.x);
		
		scope.boneMoveX=pos.x;
		scope.boneMoveY=pos.y;
		scope.boneMoveZ=pos.z;
		
		boneMoveX.setValue(pos.x);
		boneMoveY.setValue(pos.y);
		boneMoveZ.setValue(pos.z);
	}
	
	function translate(){
		var pos=getRoot().position;
		var scale=ap.skinnedMesh.scale.x;
		pos.set(scope.boneMoveX/scale,scope.boneMoveY/scale,scope.boneMoveZ/scale);
		
		ap.signals.boneTranslateChanged.remove(onTranslateChanged);
		ap.signals.boneTranslateChanged.dispatch(0);
		if(ap.translateControler.logging){
			console.log("Sidebar.BoneRootTranslate dispatch boneTranslateChanged");
		}
		ap.signals.boneTranslateChanged.add(onTranslateChanged);
		ap.getSignal("boneTranslateFinished").dispatch(0);
		if(ap.translateControler.logging){
			console.log("Sidebar.BoneRootTranslate dispatch boneTranslateFinished");
		}
	}

	var boneMoveX=new UI.NumberPlusMinus("X",-999,999,1,scope.boneMoveX,function(v){
		scope.boneMoveX=v;
		translate();
	},[0.1,1,10]);
	boneMoveX.text.setWidth("12px");
	boneMoveX.number.setWidth("36px");
	panel.add(boneMoveX);
	
	
	var boneMoveY=new UI.NumberPlusMinus("Y",-999,999,1,scope.boneMoveX,function(v){
		scope.boneMoveY=v;
		
		translate();
	},[0.1,1,10]);
	boneMoveY.text.setWidth("12px");
	boneMoveY.number.setWidth("36px");
	panel.add(boneMoveY);
	
	var boneMoveZ=new UI.NumberPlusMinus("Z",-999,999,1,scope.boneMoveX,function(v){
		scope.boneMoveZ=v;
		
		translate();
	},[0.1,1,10]);
	boneMoveZ.text.setWidth("12px");
	boneMoveZ.number.setWidth("36px");
	panel.add(boneMoveZ);
	
	var quaternion=new THREE.Quaternion();
	var resetRow=new UI.ButtonRow("Reset to Default Position",function(){
		var root=getRoot();
		quaternion.copy(root.quaternion);
		BoneUtils.resetBone(ap.skinnedMesh,0);
		root.quaternion.copy(quaternion);
		ap.getSignal("boneTranslateChanged").dispatch(0);
		if(ap.translateControler.logging){
			console.log("Sidebar.BoneRootTranslate dispatch boneTranslateChanged");
		}
		ap.getSignal("boneTranslateFinished").dispatch(0);
		if(ap.translateControler.logging){
			console.log("Sidebar.BoneRootTranslate dispatch boneTranslateFinished");
		}
	});
	
	panel.add(resetRow);

	ap.signals.loadingModelFinished.add(function(mesh){
		update();
	});
	
	return panel;
}

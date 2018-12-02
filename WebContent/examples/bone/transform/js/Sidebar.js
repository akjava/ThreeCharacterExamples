var Sidebar = function ( application ) {
	var ap=application;
	var scope=this;
	
	this.autoUpdate=true;
	this.boneAngleX=0;
	this.boneAngleY=0;
	this.boneAngleZ=0;
	this.boneMoveX=0;
	this.boneMoveY=0;
	this.boneMoveZ=0;
	
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Bone Transform"));
	
	//ui
	var rotatePanel=new UI.Panel()
	container.add(rotatePanel);
	var titleDiv=new UI.Div().setClass("title").add(new UI.Text("Bone"));
	container.add(titleDiv);
	
	var selectRow=new UI.Row();
	container.add(selectRow);
	var boneSelect=new UI.Select();
	selectRow.add(boneSelect);
	
	function boneSelectionChanged(){
		var bone=ap.skinnedMesh.getObjectById(parseInt(boneSelect.getValue()));
	
		
		ap.selectedBone=bone;
		
		var name=Mbl3dUtils.shortenMbl3dBoneName(ap.selectedBone.name);
		var euler=ap.currentBoneMatrix.euler[name];
		
		var x=THREE.Math.radToDeg(euler.x).toFixed(2);
		var y=THREE.Math.radToDeg(euler.y).toFixed(2);
		var z=THREE.Math.radToDeg(euler.z).toFixed(2);
		boneAngleX.setValue(x);
		boneAngleY.setValue(y);
		boneAngleZ.setValue(z);
	}
	boneSelect.onChange(function(){
		boneSelectionChanged();
	});
	
	
	
	
	ap.signals.loadingModelFinished.add(function(){
		var op=BoneUtils.getBoneIdOptions(ap.skinnedMesh);
		var options=Mbl3dUtils.convertOptionsToMbl3d(op);
		
		
		boneSelect.setOptions(options);
		boneSelect.setValue(Object.keys(options)[0]);
		
		ap.selectedBone=ap.skinnedMesh.children[0];
		
		
	});
	
	function rotate(){
		var name=Mbl3dUtils.shortenMbl3dBoneName(ap.selectedBone.name);

		var rx=boneAngleX.getValue();
		var ry=boneAngleY.getValue();
		var rz=boneAngleZ.getValue();
		
		
		
		ap.currentBoneMatrix.euler[name].x=THREE.Math.degToRad(rx);
		ap.currentBoneMatrix.euler[name].y=THREE.Math.degToRad(ry);
		ap.currentBoneMatrix.euler[name].z=THREE.Math.degToRad(rz);
		var q=BoneUtils.makeQuaternionFromXYZDegree(rx,ry,rz,ap.defaultBoneMatrix.rotation[name]);
		ap.selectedBone.quaternion.copy(q);

		ap.selectedBone.updateMatrixWorld(true);
	};
	
	function translate(){
		
		var name=Mbl3dUtils.shortenMbl3dBoneName(ap.selectedBone.name);
		
		var tx=boneMoveX.getValue();
		var ty=boneMoveY.getValue();
		var tz=boneMoveZ.getValue();
		
		ap.currentBoneMatrix.translation[name].set(tx,ty,tz);
		var pos=ap.defaultBoneMatrix.translation[name].clone();
		pos.add(ap.currentBoneMatrix.translation[name]);
		ap.selectedBone.position.copy(pos);

		ap.selectedBone.updateMatrixWorld(true);
	};
	
	var panel=new UI.Panel();
	container.add(panel);
	
	panel.add(new UI.SubtitleRow("Rotation"));
	
	var boneAngleX=new UI.NumberPlusMinus("X",-180,180,10,scope.boneAngleX,function(v){
		scope.boneAngleX=v;
		if(scope.autoUpdate){
			rotate();
			}
	},[5,15,30]);
	boneAngleX.text.setWidth("15px");
	panel.add(boneAngleX);
	
	var boneAngleY=new UI.NumberPlusMinus("Y",-180,180,10,scope.boneAngleY,function(v){
		scope.boneAngleY=v;
		if(scope.autoUpdate){
			rotate();
			}
	},[5,15,30]);
	boneAngleY.text.setWidth("15px");
	panel.add(boneAngleY);
	
	var boneAngleZ=new UI.NumberPlusMinus("Z",-180,180,10,scope.boneAngleZ,function(v){
		scope.boneAngleZ=v;
		if(scope.autoUpdate){
			rotate();
			}
	},[5,15,30]);
	boneAngleZ.text.setWidth("15px");
	panel.add(boneAngleZ);
	
	
	panel.add(new UI.SubtitleRow("Translate"));
	
	var boneMoveX=new UI.NumberPlusMinus("X",-5,5,1,scope.boneMoveX,function(v){
		scope.boneMoveX=v;
		
		if(scope.autoUpdate){
			translate();
			}
	},[0.01,0.1]);
	boneMoveX.text.setWidth("15px");
	panel.add(boneMoveX);
	
	
	var boneMoveY=new UI.NumberPlusMinus("Y",-5,5,1,scope.boneMoveX,function(v){
		scope.boneMoveY=v;
		
		if(scope.autoUpdate){
			translate();
			}
	},[0.01,0.1]);
	boneMoveY.text.setWidth("15px");
	panel.add(boneMoveY);
	
	var boneMoveZ=new UI.NumberPlusMinus("Z",-5,5,1,scope.boneMoveX,function(v){
		scope.boneMoveZ=v;
		
		if(scope.autoUpdate){
			translate();
			}
	},[0.01,0.1]);
	boneMoveZ.text.setWidth("15px");
	panel.add(boneMoveZ);
	
	
	var p1=new UI.Panel();
	var bt=new UI.Button("Reset All Bone").onClick( function () {
		ap.skinnedMesh.skeleton.pose();
		Object.keys(ap.currentBoneMatrix.translation).forEach(function(key){
			ap.currentBoneMatrix.translation[key].set(0,0,0);
		});
		Object.keys(ap.currentBoneMatrix.euler).forEach(function(key){
			ap.currentBoneMatrix.euler[key].set(0,0,0);
		});
		
		boneSelectionChanged();
	});
	p1.add(bt);
	container.add(p1);
	
	return container;
}

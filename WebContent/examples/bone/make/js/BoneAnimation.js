var BoneAnimation = function ( application ) {
	var container = new UI.Panel();
	container.setId( 'bonerotateanimation' );
	var scope=this;
	
	scope.boneAnimationIndex=0;
	scope.animationOppositeDirection=true;
	scope.boneAngleX=0;
	scope.boneAngleY=0;
	scope.boneAngleZ=0;
	scope.autoPlay=false;
	scope.animationDuration=3.0;
	
	
	var titleDiv=new UI.Div().setClass("title").add(new UI.Text("Bone Rotate Animation"));
	container.add(titleDiv);
	
	var row1=new UI.Row();
	container.add(row1);
	
	
	
	var boneList=new UI.Select();
	boneList.onChange(function(){
		scope.boneAnimationIndex=boneList.getValue();
		
		if(scope.autoPlay){
			application.signals.boneAnimationStarted.dispatch();
		}
	})
	row1.add(boneList);
	
	
	var row3=new UI.Row();
	container.add(row3);
	var row3text=new UI.Text("Opposite Direction").setWidth( '90px' );
	row3.add(row3text);
	
	var directionCheck=new UI.Checkbox();
	directionCheck.setValue(scope.animationOppositeDirection);
	
	
	directionCheck.onChange(function(){
		scope.animationOppositeDirection=directionCheck.getValue();
		if(scope.autoPlay){
		application.signals.boneAnimationStarted.dispatch();
		}
	});
	row3.add(directionCheck);
	
	
	var boneAngleX=new UI.NumberButtons("AngleX",-180,180,10,scope.boneAngleX,function(v){
		scope.boneAngleX=v;
		if(scope.autoPlay){
			application.signals.boneAnimationStarted.dispatch();
			}
	},[0,45,90,180]);
	container.add(boneAngleX);
	
	var boneAngleY=new UI.NumberButtons("AngleY",-180,180,10,scope.boneAngleY,function(v){
		scope.boneAngleY=v;
		if(scope.autoPlay){
			application.signals.boneAnimationStarted.dispatch();
			}
	},[0,45,90,180]);
	container.add(boneAngleY);
	
	var boneAngleZ=new UI.NumberButtons("AngleZ",-180,180,10,scope.boneAngleZ,function(v){
		scope.boneAngleZ=v;
		if(scope.autoPlay){
			application.signals.boneAnimationStarted.dispatch();
			}
	},[0,45,90,180]);
	container.add(boneAngleZ);
	
	
	var row5=new UI.Row();
	container.add(row5);
	var bt1=new UI.Button("Play");
	bt1.onClick(function(){
		application.signals.boneAnimationStarted.dispatch();
		
	})
	row5.add(bt1);
	
	var bt2=new UI.Button("Stop");
	bt2.onClick(function(){
		application.signals.boneAnimationFinished.dispatch();
		
	})
	row5.add(bt2);
	bt2.setDisabled(true);
	
	
	
	application.signals.boneAnimationStarted.add(function(){
		bt1.setDisabled(true);
		bt2.setDisabled(false);
		
		var mixer=application.mixer;
		var clip=AnimeUtils.makeSingleRotateBoneAnimation(scope.boneAnimationIndex,
				THREE.Math.degToRad(scope.boneAngleX),
				THREE.Math.degToRad(scope.boneAngleY),
				THREE.Math.degToRad(scope.boneAngleZ),
				scope.animationOppositeDirection,scope.animationDuration,1);

		
		
		mixer.stopAllAction();
		application.skinnedMesh.skeleton.pose();//TODO mixer base
		mixer.uncacheClip(clip);
		mixer.clipAction(clip).play();
	});
	application.signals.boneAnimationFinished.add(function(){
		bt1.setDisabled(false);
		bt2.setDisabled(true);
		
		application.mixer.stopAllAction();
		application.skinnedMesh.skeleton.pose();
	});
	
	

	row5.add(new UI.Text("Auto play").setMarginLeft( '6px' ));
	var autoPlayCheck=new UI.Checkbox();
	row5.add(autoPlayCheck);
	autoPlayCheck.setValue(this.autoPlay);
	autoPlayCheck.onChange(function(){
		scope.autoPlay=autoPlayCheck.getValue();
	});
	
	application.signals.skinnedMeshChanged.add(function(mesh){
		var values={};
		for(var i=0;i<mesh.skeleton.bones.length;i++){
			values[i]=mesh.skeleton.bones[i].name;
		}
		boneList.setOptions(values);
		boneList.setValue(0);
	});
	
	return container;
}
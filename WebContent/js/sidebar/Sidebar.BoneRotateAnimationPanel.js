/*
 library
 ../../libs/AnimeUtils.js
 
 [application]
 scope.mixer
 scope.skinnedMesh

application.defaultBoneMatrix
 
skinnedMeshChanged:new Signal(),//arg skinnedMesh
boneAnimationFinished:new Signal(),
boneAnimationStarted:new Signal(),
boneAnimationIndexChanged:new Signal(),
			
 application.signals.boneAnimationIndexChanged
 application.signals.boneAnimationStarted
 application.signals.boneAnimationFinished
 application.signals.skinnedMeshChanged
 
 */
Sidebar.BoneRotateAnimationPanel = function ( application ,param) {
	var ap=application;
	param=param!==undefined?param:{duration:1};
	var container = new UI.Panel();
	container.setId( 'bonerotateanimation' );
	var scope=this;
	
	scope.boneAnimationIndex=0;
	scope.animationOppositeDirection=true;
	scope.boneAngleX=0;
	scope.boneAngleY=0;
	scope.boneAngleZ=0;
	scope.autoPlay=true;
	scope.duration=param.duration!==undefined?param.duration:1;
	
	
	var titleDiv=new UI.Div().setClass("title").add(new UI.Text("Bone Rotate Animation"));
	container.add(titleDiv);
	
	var row1=new UI.Row();
	container.add(row1);
	
	
	
	var boneList=new UI.Select();
	boneList.onChange(function(){
		scope.boneAnimationIndex=boneList.getValue();
		
		application.getSignal("boneAnimationIndexChanged").dispatch(scope.boneAnimationIndex);
		
		if(scope.autoPlay){
			application.signals.boneAnimationStarted.dispatch();
		}
	})
	row1.add(boneList);
	
	
	var row3=new UI.Row();
	container.add(row3);
	var row3text=new UI.Text("Anime Opposite Angle").setWidth( '160px' );
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
	boneAngleX.text.setWidth("60px");
	
	
	var minus=new UI.Button("-").onClick(function(){
		var v=scope.boneAngleX*-1;
		boneAngleX.setValue(v);
		scope.boneAngleX=v;
		if(scope.autoPlay){
			application.signals.boneAnimationStarted.dispatch();
			}
	});
	boneAngleX.add(minus);
	
	container.add(boneAngleX);
	
	var boneAngleY=new UI.NumberButtons("AngleY",-180,180,10,scope.boneAngleY,function(v){
		scope.boneAngleY=v;
		if(scope.autoPlay){
			application.signals.boneAnimationStarted.dispatch();
			}
	},[0,45,90,180]);
	boneAngleY.text.setWidth("60px");
	
	var minus=new UI.Button("-").onClick(function(){
		var v=scope.boneAngleY*-1;
		boneAngleY.setValue(v);
		scope.boneAngleY=v;
		if(scope.autoPlay){
			application.signals.boneAnimationStarted.dispatch();
			}
	});
	boneAngleY.add(minus);
	
	container.add(boneAngleY);
	
	var boneAngleZ=new UI.NumberButtons("AngleZ",-180,180,10,scope.boneAngleZ,function(v){
		scope.boneAngleZ=v;
		if(scope.autoPlay){
			application.signals.boneAnimationStarted.dispatch();
			}
	},[0,45,90,180]);
	boneAngleZ.text.setWidth("60px");
	container.add(boneAngleZ);
	
	var minus=new UI.Button("-").onClick(function(){
		var v=scope.boneAngleZ*-1;
		boneAngleZ.setValue(v);
		scope.boneAngleZ=v;
		if(scope.autoPlay){
			application.signals.boneAnimationStarted.dispatch();
			}
	});
	boneAngleZ.add(minus);
	
	
	var duration=new UI.NumberButtons("Duration",0.1,30,1,scope.duration,function(v){
		scope.duration=v;
		if(scope.autoPlay){
			application.signals.boneAnimationStarted.dispatch();
			}
	},[0.1,1,5,10]);
	container.add(duration);
	
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
	
	
	
	application.getSignal("boneAnimationStarted").add(function(){
		bt1.setDisabled(true);
		bt2.setDisabled(false);
		
		var mixer=application.mixer;
		
		
		var order=scope.boneList[scope.boneAnimationIndex].rotation.order;
		var boneName=scope.boneList[scope.boneAnimationIndex].name;
		var defaultMatrix=application.defaultBoneMatrix[boneName];
		
		var currentMatrix=null;
		if(application.currentBoneMatrix!==undefined){
			currentMatrix=application.currentBoneMatrix[boneName];
			
		}
		
		var defaultRotation=defaultMatrix.rotation;
		
		
		var indices=[scope.boneAnimationIndex];
		var startRot=null;
		if(currentMatrix!=null){
			var rotation=currentMatrix.rotation;
			startRot=[BoneUtils.makeQuaternionFromXYZRadian(rotation.x,rotation.y,rotation.z,defaultRotation,order)];
		}else{
			startRot=[BoneUtils.makeQuaternionFromXYZRadian(0,0,0,defaultRotation,order)];
		}
		
		
		//add start rot ref
		
		var endRot=[BoneUtils.makeQuaternionFromXYZDegree(scope.boneAngleX,scope.boneAngleY,scope.boneAngleZ,defaultRotation,order)]
		
		var intime=scope.duration/2;
		var endtime=scope.duration/2;
		
		var clip=AnimeUtils.makeRotateBoneAnimation(indices,startRot,endRot,intime,endtime);
		
		if(scope.animationOppositeDirection){
			endRot=[BoneUtils.makeQuaternionFromXYZDegree(-scope.boneAngleX,-scope.boneAngleY,-scope.boneAngleZ,defaultRotation,order)]
			var clip2=AnimeUtils.makeRotateBoneAnimation(indices,startRot,endRot,intime,endtime);
			var merged=AnimeUtils.joinTracks([clip.tracks[0],clip2.tracks[0]]);
			clip=new THREE.AnimationClip("makeRotateBoneAnimation", -1, [merged]);
		}
		
		
		
		console.log(mixer,clip);
		
		mixer.stopAllAction();
		application.skinnedMesh.skeleton.pose();//TODO mixer base
		mixer.uncacheClip(clip);
		mixer.clipAction(clip).play();
	});
	application.getSignal("boneAnimationFinished").add(function(){
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
	
	application.signals.loadingModelFinished.add(function(mesh){
		//possible conflict
		if(application.mixer){
			application.mixer.stopAllAction();
		}
		
		Logics.initializeSkinnedMeshMixer(ap);
		
		var values={};
		for(var i=0;i<mesh.skeleton.bones.length;i++){
			values[i]=mesh.skeleton.bones[i].name;
		}
		boneList.setOptions(values);
		boneList.setValue(0);
		scope.boneAnimationIndex=0;
		
		scope.boneList=BoneUtils.getBoneList(mesh);
		if(!application.defaultBoneMatrix){
			application.defaultBoneMatrix=BoneUtils.storeDefaultBoneMatrix(scope.boneList);
		}
		
		application.getSignal("boneAnimationIndexChanged").dispatch(scope.boneAnimationIndex);
		
	});
	
	return container;
	}
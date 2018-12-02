var RotationPanel1=function(ap){
	var panel=new UI.Panel();
	panel.autoUpdate=true;

	function rotate(){
		if(ap.signals.objectRotate)
			ap.signals.objectRotate.dispatch(panel);
		else
			console.log("ap.signals.objectRotate is not exist");
	}
	
	var row=new UI.Row();
	panel.add(row);
	var text=new UI.Text("Rotation Degree");
	row.add(text);
	


		var angleX=new UI.NumberButtons("X",-180,180,10,0,function(v){
			
			if(panel.autoUpdate){
				rotate();
				}
		},[-90,-45,0,45,90,180]);
		angleX.text.setWidth("15px");
		angleX.number.setWidth("45px");
		panel.add(angleX);
		panel.getAngleX=function(){
			return angleX.getValue();
		}
		panel.setAngleX=function(v){
			angleX.number.setValue(v);
		}
		var angleY=new UI.NumberButtons("Y",-180,180,10,0,function(v){
			
			if(panel.autoUpdate){
				rotate();
				}
		},[-90,-45,0,45,90,180]);
		angleY.text.setWidth("15px");
		angleY.number.setWidth("45px");
		panel.add(angleY);
		panel.getAngleY=function(){
			return angleY.getValue();
		}
		panel.setAngleY=function(v){
			angleY.number.setValue(v);
		}
		var angleZ=new UI.NumberButtons("Z",-180,180,10,0,function(v){
			
			if(panel.autoUpdate){
				rotate();
				}
		},[-90,-45,0,45,90,180]);
		angleZ.text.setWidth("15px");
		angleZ.number.setWidth("45px");
		panel.add(angleZ);
		panel.getAngleZ=function(){
			return angleZ.getValue();
		}
		panel.setAngleZ=function(v){
			angleZ.number.setValue(v);
		}
		/*
		var boneMoveX=new UI.NumberButtons("MoveX",-5,5,1,0,function(v){
			scope.boneMoveX=v;
			if(scope.autoPlay){
				translate();
				}
		},[-5,-1,0,1,5]);
		panel.add(boneMoveX);
		var boneMoveY=new UI.NumberButtons("MoveY",-5,5,1,0,function(v){
			scope.boneMoveY=v;
			if(scope.autoPlay){
				translate();
				}
		},[-10,-5,-1,0]);
		panel.add(boneMoveY);
		var boneMoveZ=new UI.NumberButtons("MoveZ",-5,5,1,0,function(v){
			scope.boneMoveZ=v;
			if(scope.autoPlay){
				translate();
				}
		},[-5,-1,0,1,5]);
		panel.add(boneMoveZ);
		*/
		
		return panel;
	}

/*
 library
 ../../libs/AnimeUtils.js
 
 [application]
 scope.mixer
 scope.skinnedMesh

 
skinnedMeshChanged:new Signal(),//arg skinnedMesh
boneAnimationFinished:new Signal(),
boneAnimationStarted:new Signal(),
boneAnimationIndexChanged:new Signal(),
			
 application.signals.boneAnimationIndexChanged
 application.signals.boneAnimationStarted
 application.signals.boneAnimationFinished
 application.signals.skinnedMeshChanged
 
 */
var BoneRotateAnimationPanel = function ( application ,param) {
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
			
			if(scope.autoPlay){
				application.signals.boneAnimationStarted.dispatch();
			}
		})
		row1.add(boneList);
		
		
		var row3=new UI.Row();
		container.add(row3);
		var row3text=new UI.Text("Do Opposite Angle").setWidth( '160px' );
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
		
		
		
		application.signals.boneAnimationStarted.add(function(){
			bt1.setDisabled(true);
			bt2.setDisabled(false);
			
			var mixer=application.mixer;
			
			var defaultMatrix=application.defaultBoneMatrix[scope.boneList[scope.boneAnimationIndex].name];
			var rotate=defaultMatrix.rotation;
			
			
			var indices=[scope.boneAnimationIndex];
			var startRot=null;
			if(scope.animationOppositeDirection){
				startRot=[BoneUtils.makeQuaternionFromXYZDegree(-scope.boneAngleX,-scope.boneAngleY,-scope.boneAngleZ,rotate)]
			}else{
				startRot=[BoneUtils.makeQuaternionFromXYZDegree(0,0,0,rotate)];
			}
			
			
			var endRot=[BoneUtils.makeQuaternionFromXYZDegree(scope.boneAngleX,scope.boneAngleY,scope.boneAngleZ,rotate)]
			
			var intime=scope.duration/2;
			var endtime=scope.duration/2;
			
			var clip=AnimeUtils.makeRotateBoneAnimation(indices,startRot,endRot,intime,endtime);

			
			
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
			
			scope.boneList=BoneUtils.getBoneList(mesh);
			if(!application.defaultBoneMatrix){
				application.defaultBoneMatrix=BoneUtils.storeDefaultBoneMatrix(scope.boneList);
			}
			
		});
		
		return container;
	}

var RotationDiv = function ( application ,param) {
	param=param!==undefined?param:{};
	var container = new UI.Div();
	container.setId( 'rotationdiv' );
	var scope=this;
	
	scope.key=param.key?param.key:"rotationdiv";
	scope.angleX=param.angleX?param.angleX:0;
	scope.angleY=param.angleY?param.angleY:0;
	scope.angleZ=param.angleZ?param.angleZ:0;
	
	function changed(){
		if(application.signals.rotationChanged){
			application.signals.rotationChanged().dispatch(scope.key,scope.angleX,scope.angleY,scope.angleZ);
		}
	}
	
	
	var angleX=new UI.NumberButtons("AngleX",-180,180,10,scope.angleX,function(v){
		scope.angleX=v;
		changed();
	},[0,45,90,180]);
	container.add(angleX);
	container.angleX=angleX;
	
	var angleY=new UI.NumberButtons("AngleY",-180,180,10,scope.angleY,function(v){
		scope.angleY=v;
		changed();
	},[0,45,90,180]);
	container.add(angleY);
	container.angleY=angleY;
	
	var angleZ=new UI.NumberButtons("AngleZ",-180,180,10,scope.angleZ,function(v){
		scope.angleZ=v;
		changed();
	},[0,45,90,180]);
	container.add(angleZ);
	container.angleZ=angleZ;
	
	return container;
}
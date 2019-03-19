Sidebar.VrmFingers=function(ap){
	var scope=this;
	var container=new UI.TitlePanel("Control Fingers");
	
	scope.x=0;
	scope.y=0;
	scope.z=0;
	
	scope.isL=true;
	function getRotation(index){
		if(index<0){
			console.error("getRotation:invalid index",index);
			return null;
		}
		var boneList=BoneUtils.getBoneList(ap.skinnedMesh);
		var rotation=boneList[index].rotation;
	
		return rotation;
	}
	function updateAngle(){
		var rotation=getRotation(scope.selectedIndex);
		
		var ax=THREE.Math.degToRad(scope.x);
		var ay=THREE.Math.degToRad(scope.y);
		var az=THREE.Math.degToRad(scope.z);
		
		rotation.set(ax,ay,az);
	}
	
	var selectionName=new UI.TextRow("Selection","");
	container.add(selectionName);
	
	var angleX=new UI.NumberButtons("X",-180-30,90,10,0,function(v){
		scope.x=v;
		updateAngle();
	},[-90,0,90]);
	container.add(angleX);
	angleX.text.setWidth("20px");
	
	
	
	var rowX=new UI.Row();
	rowX.setTextAlign("Right");
	rowX.add(new UI.ButtonsDiv([-30,-15,-5,-1,1,5,15,30],function(v){
		var num=Number(v);
		var newValue=angleX.getValue()+num;
		angleX.setValue(newValue);
		
		scope.x=newValue;
		updateAngle();
	}));
	container.add(rowX);
	rowX.setMarginBottom("8px");
	
	var angleY=new UI.NumberButtons("Y",-180-30,90,10,0,function(v){
		scope.y=v;
		updateAngle();
	},[-90,0,90]);
	container.add(angleY);
	angleY.text.setWidth("20px");
	
	var rowY=new UI.Row();
	rowY.setTextAlign("Right");
	rowY.add(new UI.ButtonsDiv([-30,-15,-5,-1,1,5,15,30],function(v){
		var num=Number(v);
		var newValue=angleY.getValue()+num;
		angleY.setValue(newValue);
		
		scope.y=newValue;
		updateAngle();
	}));
	container.add(rowY);
	rowY.setMarginBottom("8px");
	
	var angleZ=new UI.NumberButtons("Z",-180-30,90,10,0,function(v){
		scope.z=v;
		updateAngle();
	},[-90,0,90]);
	container.add(angleZ);
	angleZ.text.setWidth("20px");
	
	
	var rowZ=new UI.Row();
	rowZ.setTextAlign("Right");
	rowZ.add(new UI.ButtonsDiv([-30,-15,-5,-1,1,5,15,30],function(v){
		var num=Number(v);
		var newValue=angleZ.getValue()+num;
		angleZ.setValue(newValue);
		
		scope.z=newValue;
		updateAngle();
	}));
	container.add(rowZ);
	
	var lrSwitch=new UI.SwitchRow("L Fingers","R Fingers","L Fingers",function(v){
		scope.isL=v;
		updateFingerButtons(ap.skinnedMesh);
	});
	container.add(lrSwitch);
	
	var buttonContainer=new UI.Div();
	container.add(buttonContainer);
	var names=["Thumb","Index","Middle","Ring","Little"];
	
	function reselect(){
		var boneList=BoneUtils.getBoneList(ap.skinnedMesh);
		var name=boneList[scope.selectedIndex].name;
		selectBone(name,scope.selectedIndex);
	}
	function selectBone(name,index){
		var humanName=ap.fingerPresetsControler.getHumanBoneNameByGeneralBoneName(name);
		selectionName.text2.setValue(humanName);
		scope.selectedIndex=index;
		
		var rotation=getRotation(index);
		//get value
		var dx=THREE.Math.radToDeg(rotation.x);
		var dy=THREE.Math.radToDeg(rotation.y);
		var dz=THREE.Math.radToDeg(rotation.z);
		
		scope.x=dx;
		angleX.setValue(dx);
		
		scope.y=dy;
		angleY.setValue(dy);
		
		scope.z=dz;
		angleZ.setValue(dz);
	}
	
	function updateFingerButtons(mesh){
		var boneList=BoneUtils.getBoneList(mesh);
		buttonContainer.clear();
		
			var lr=scope.isL?"left":"right";
			var levels=["Proximal","Intermediate","Distal"];
			
			names.forEach(function(name){
				var row=new UI.Row();
				buttonContainer.add(row);
			
				var text=new UI.Text(name);
				text.setWidth("50px");
				row.add(text);
				for(var i=0;i<3;i++){
					var humanBoneName=lr+name+levels[i];
					var boneName=ap.fingerPresetsControler.getGeneralBoneNameByHumanBoneName(humanBoneName);
					
					var boneIndex=BoneUtils.findBoneIndexByEndsName(boneList,boneName);
					if(boneIndex==-1){
						console.error("invalid bone name",boneName);
					}
					
					function select(name,index){
						return function(){
							
							selectBone(name,index);
						}
					}
					
					var bt=new UI.Button(""+i);
					bt.setWidth("40px");
					bt.onClick(select(boneName,boneIndex));
					row.add(bt);
				}
				
			});
		
		
		
		var humanName=lr+"ThumbProximal";
		var boneName=ap.fingerPresetsControler.getGeneralBoneNameByHumanBoneName(humanName);
		
		
		var index=BoneUtils.findBoneIndexByEndsName(boneList,boneName);
		if(index==-1){
			console.error("invalid bone",humanName,boneName);
			return;
		}
		selectBone(name,index);
	}
	
	ap.signals.loadingModelFinished.add(function(mesh){
		updateFingerButtons(mesh);
		
		var keys=ap.fingerPresetsControler.getPresetKeys();
		
		presetListL.setList(keys);
		presetListL.setValue(ap.fingerPresetsControler.presetNameL);
		
		presetListR.setList(keys);
		presetListR.setValue(ap.fingerPresetsControler.presetNameR);
	});
	
	
	
	//
	var controlRow=new UI.Row();
	container.add(controlRow);
	var cutBt=new UI.Button("Cut").onClick(function(){
		var rotation=getRotation(scope.selectedIndex);
		scope.clipboard=rotation.clone();
		rotation.set(0,0,0);
		reselect();
	});
	controlRow.add(cutBt);
	
	var copyBt=new UI.Button("Copy").onClick(function(){
		var rotation=getRotation(scope.selectedIndex);
		scope.clipboard=rotation.clone();
	});
	controlRow.add(copyBt);
	var pasteBt=new UI.Button("Paste").onClick(function(){
		var rotation=getRotation(scope.selectedIndex);
		if(scope.clipboard){
			rotation.copy(scope.clipboard);
			reselect();
		}
		
	});
	controlRow.add(pasteBt);
	
	
	
	function getFingerBoneIndexes(isL){
		return isL?ap.fingerPresetsControler.fingerBoneIndicesL:ap.fingerPresetsControler.fingerBoneIndicesR;
	}
	
	container.add(new UI.TitlePanel("Load Preset"));
	
	function resetRotationAll(isL){
		var indices=getFingerBoneIndexes(isL);
		indices.forEach(function(index){
			resetRotation(index);
		});
		
	}
	
	function resetRotation(index){
		getRotation(index).set(0,0,0);
	}
	
	
	
	var presets=new VrmFingerPresets();
	
	
	
	scope.intensity=1.0;
	scope.presetSelection=null;
	function updatePreset(){
		if(scope.presetSelection==null){
		return;
	}
		var v=scope.intensity;
		
		resetRotationAll(true);
		
		var obj=presets[scope.presetSelection];
		
		var boneList=BoneUtils.getBoneList(ap.skinnedMesh);
		Object.keys(obj).forEach(function(key){
			var vec3=obj[key];
			var index=BoneUtils.findBoneIndexByEndsName(boneList,key);
			var rads=AppUtils.degToRad(vec3);
			boneList[index].rotation.set(rads.x*v,rads.y*v,rads.z*v);	
		});
		
		//update
		reselect();
	}
	
	container.add(new UI.Subtitle("L Fingers"));
	var presetListL=new UI.List(undefined,function(selection){
		ap.fingerPresetsControler.presetNameL=selection;
		ap.fingerPresetsControler.update();
		reselect();
	});
	var rowL=new UI.Row();
	container.add(rowL);
	rowL.add(presetListL);
	var copyRBt=new UI.Button("Copy to R").onClick(function(){
		var p=presetListL.getValue();
		var i=intensityL.getValue();
		
		presetListR.setValue(p);
		intensityR.setValue(i);
		
		ap.fingerPresetsControler.presetNameR=p;
		ap.fingerPresetsControler.intensityR=i;
		ap.fingerPresetsControler.update();
		reselect();
	});
	rowL.add(copyRBt);
	
	var intensityL=new UI.NumberButtons("Intensity",0,1,1,1,function(v){
		ap.fingerPresetsControler.intensityL=v;
		
		ap.fingerPresetsControler.update();
		reselect();
	},[0,0.25,0.5,0.75,1.0]);
	intensityL.text.setWidth("60px");
	intensityL.number.setWidth("40px");
	container.add(intensityL);
	
	container.add(new UI.Subtitle("R Fingers"));
	
	var presetListR=new UI.List(undefined,function(selection){
		ap.fingerPresetsControler.presetNameR=selection;
		ap.fingerPresetsControler.update();
		reselect();
	});
	var rowR=new UI.Row();
	container.add(rowR);
	rowR.add(presetListR);
	var copyLBt=new UI.Button("Copy to L").onClick(function(){
		var p=presetListR.getValue();
		var i=intensityR.getValue();
		
		presetListL.setValue(p);
		intensityL.setValue(i);
		
		ap.fingerPresetsControler.presetNameL=p;
		ap.fingerPresetsControler.intensityL=i;
		ap.fingerPresetsControler.update();
		reselect();
	});
	rowR.add(copyLBt);
	
	var intensityR=new UI.NumberButtons("Intensity",0,1,1,1,function(v){
		ap.fingerPresetsControler.intensityR=v;
		
		ap.fingerPresetsControler.update();
		reselect();
	},[0,0.25,0.5,0.75,1.0]);
	intensityR.text.setWidth("60px");
	intensityR.number.setWidth("40px");
	container.add(intensityR);
	
	var swapBt=new UI.ButtonRow("Swap",function(){
		var p=ap.fingerPresetsControler.presetNameL;
		var i=ap.fingerPresetsControler.intensityL;
		
		ap.fingerPresetsControler.presetNameL=ap.fingerPresetsControler.presetNameR;
		ap.fingerPresetsControler.intensityL=ap.fingerPresetsControler.intensityR;
		ap.fingerPresetsControler.presetNameR=p
		ap.fingerPresetsControler.intensityR=i;
		ap.fingerPresetsControler.update();
		reselect();
	});
	container.add(swapBt);
	
	//TODO convert json?
	var printBt=new UI.Button("Loggins fingers as Preset").onClick(function(){
		var indices=getFingerBoneIndexes(scope.isL);
		var boneList=BoneUtils.getBoneList(ap.skinnedMesh);
		var text="current={};\n";
		indices.forEach(function(index){
			var bone=boneList[index];
			var humanName=ap.fingerPresetsControler.getHumanBoneNameByGeneralBoneName(bone.name);
			if(bone.rotation.x!=0 ||bone.rotation.y!=0 || bone.rotation.z!=0){
				var deg=AppUtils.radToDeg(bone.rotation);
				text+="registPreset(\""+humanName+"\","+deg.x.toFixed(2)+","+deg.y.toFixed(2)+","+deg.z.toFixed(2)+");\n";
			}
		});
		text+="presets[\"\"]=current;";
		console.log(text);
	});
	printBt.setMarginLeft("8px");
	swapBt.add(printBt);
	
	ap.getSignal("fingerPresetChanged").add(function(isL,fireEvent){
		var c=ap.fingerPresetsControler;
		if(isL){
			presetListL.setValue(c.presetNameL);
			intensityL.setValue(c.intensityL);
		}else{
			presetListR.setValue(c.presetNameR);
			intensityR.setValue(c.intensityR);
		}
	});
	
	return container;
}
Sidebar.RotateFingers=function(ap){
	var scope=this;
	var container=new UI.TitlePanel("Rotate Fingers");
	
	scope.x=0;
	scope.y=0;
	scope.z=0;
	
	scope.isL=true;
	function getRotation(index){
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
	var names=["thumb","index","middle","ring","pinky"];
	
	function reselect(){
		var boneList=BoneUtils.getBoneList(ap.skinnedMesh);
		var name=boneList[scope.selectedIndex].name;
		selectBone(name,scope.selectedIndex);
	}
	function selectBone(name,index){
		selectionName.text2.setValue(name);
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
		
			var lr=scope.isL?"L":"R";
		
			names.forEach(function(name){
				var row=new UI.Row();
				buttonContainer.add(row);
				var start=name=="thumb"?1:0;
				var text=new UI.Text(name);
				text.setWidth("50px");
				row.add(text);
				for(var i=start;i<4;i++){
					var boneName=name+"0"+i+"_"+lr;
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
		
		
		
		var name="thumb01_"+lr;
		var index=BoneUtils.findBoneIndexByEndsName(boneList,name);
	
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
		var result=[];
		var boneList=BoneUtils.getBoneList(ap.skinnedMesh);
		for(var i=0;i<boneList.length;i++){
			var name=boneList[i].name;
			if(Mbl3dUtils.isFingerBoneName(name)){
				if(isL){
					if(name.endsWith("_L")){
						result.push(i);
					}
				}else{
					if(name.endsWith("_R")){
						result.push(i);
					}
				}
				
				
			}
		}
		return result;
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
	
	
	
	var presets=new FingerPresets();
	
	
	
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
	container.add(presetListL);
	
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
	container.add(presetListR);
	
	var intensityR=new UI.NumberButtons("Intensity",0,1,1,1,function(v){
		ap.fingerPresetsControler.intensityR=v;
		
		ap.fingerPresetsControler.update();
		reselect();
	},[0,0.25,0.5,0.75,1.0]);
	intensityR.text.setWidth("60px");
	intensityR.number.setWidth("40px");
	container.add(intensityR);
	
	
	var printBt=new UI.ButtonRow("Loggins fingers as Preset",function(){
		var indices=getFingerBoneIndexes(scope.isL);
		var boneList=BoneUtils.getBoneList(ap.skinnedMesh);
		var text="current={};\n";
		indices.forEach(function(index){
			var bone=boneList[index];
			
			if(bone.rotation.x!=0 ||bone.rotation.y!=0 || bone.rotation.z!=0){
				var deg=AppUtils.radToDeg(bone.rotation);
				text+="registPreset(\""+bone.name+"\","+deg.x.toFixed(2)+","+deg.y.toFixed(2)+","+deg.z.toFixed(2)+");\n";
			}
		});
		text+="presets[\"\"]=current;";
		console.log(text);
	});
	container.add(printBt);
	
	return container;
}
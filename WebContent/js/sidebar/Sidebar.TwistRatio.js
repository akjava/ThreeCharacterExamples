Sidebar.TwistRatio=function(ap){
	var scope=this;
	var container=new UI.TitlePanel("Twist Ratio Editor");
	this.xRatio=0;
	this.yRatio=0;
	this.zRatio=0;
	
	ap.twistValues={};
	
	container.logging=false;
	
	function isArmTwist(name){
		return name.startsWith("lowerarm") || name.startsWith("upperarm")
	}
	function isLegTwist(name){
		return name.startsWith("thigh") || name.startsWith("calf")
	}
	
	//init here,TODO for glb
	ap.twistValues["lowerarm_twist_L"]={x:-0.5,y:0,z:0};
	ap.twistValues["lowerarm_twist_R"]={x:-0.5,y:0,z:0};
	ap.twistValues["upperarm_twist_L"]={x:-0.5,y:0,z:0};
	ap.twistValues["upperarm_twist_R"]={x:-0.5,y:0,z:0};
	ap.twistValues["thigh_twist_L"]={x:0,y:-0.5,z:1.0/32};
	ap.twistValues["thigh_twist_R"]={x:0,y:-0.5,z:1.0/32};
	ap.twistValues["calf_twist_L"]={x:0,y:-0.5,z:0};
	ap.twistValues["calf_twist_R"]={x:0,y:-0.5,z:0};
	
	var indexMap={};
	ap.signals.loadingModelFinished.add(function(model){
		var list=BoneUtils.getBoneList(model);
		for(var i=0;i<list.length;i++){
			var bone=list[i];
			if(Mbl3dUtils.hasTwistBoneName(bone.name)){
				var twistName=Mbl3dUtils.convertToTwistBoneName(bone.name);
				indexMap[String(i)]=twistName;
			}
		}
	});
	
	ap.twistUpdateWhenBoneRotationChanged=false;
	var checkChanged=new UI.CheckboxRow("Update on boneRotation",ap.twistUpdateWhenBoneRotationChanged,function(v){
		ap.twistUpdateWhenBoneRotationChanged=v;
	});
	container.add(checkChanged);
	
	ap.getSignal("boneRotationChanged").add(function(index){
		if(index && ap.twistUpdateWhenBoneRotationChanged){
			var twistName=indexMap[String(index)];
			if(twistName){
				updateBone(twistName);
			}
		}
	});
	
	function updateBone(twistBoneName){

		if(!twistBoneName || !Mbl3dUtils.isTwistBoneName(twistBoneName)){
			return;
		}
		
		var list=BoneUtils.getBoneList(ap.skinnedMesh);
		var boneName=Mbl3dUtils.convertToUnTwistBoneName(twistBoneName);
		var boneIndex=BoneUtils.findBoneIndexByEndsName(list,boneName);
		var twistIndex=BoneUtils.findBoneIndexByEndsName(list,twistBoneName);
		
		var boneRotation=list[boneIndex].rotation;
		var twistRotation=list[twistIndex].rotation;
		
		var ratio=ap.twistValues[twistBoneName];
		
		if(isArmTwist(twistBoneName)){
			twistRotation.set(boneRotation.x*ratio.x,boneRotation.x*ratio.y,boneRotation.x*ratio.z);
		}else{
			twistRotation.set(boneRotation.y*ratio.x,boneRotation.y*ratio.y,boneRotation.y*ratio.z);
		}
		
		if(container.logging){
			AppUtils.printDeg(twistRotation,twistBoneName);
		}
		ap.getSignal("boneRotationFinished").dispatch(twistIndex);
	}
	ap.getSignal("twistNeedUpdate").add(function(twistName){
		updateBone(twistName);
	});
	
/*	var euler=new THREE.Euler();
	var twistUpdate=function(){
		if(!ap.skinnedMesh){
			return;
		}
		var boneList=BoneUtils.getBoneList(ap.skinnedMesh);
		
		Object.keys(ap.twistValues).forEach(function(boneName){
			
			if(Mbl3dUtils.isTwistBoneName(boneName)){
				var value=ap.twistValues[boneName];
				var originBoneName=Mbl3dUtils.convertToUnTwistBoneName(boneName);
				//console.log(originBoneName);
				
				var originBone=BoneUtils.findBoneByEndsName(boneList,originBoneName);
				var twistBone=BoneUtils.findBoneByEndsName(boneList,boneName);
				var rot=originBone.rotation;
				if(ap.twistAutoUpdate){
					twistBone.rotation.set(rot.x*value.x,rot.y*value.y,rot.z*value.z);
					//console.log(twistBone.rotation);
				}else{
					twistBone.rotation.set(0,0,0);
				}
				
				
			}
			
			
		});
	};
	
	ap.signals.rendered.add(twistUpdate)*/
	
	
	var boneName=null;
	
	var textRow=new UI.TextRow("");
	container.add(textRow);
	textRow.text.setWidth("120px");
	
	var target=new UI.Text("").setMarginLeft("8px");
	textRow.add(target);
	
	var twistBoneName=null;
	ap.signals.boneSelectionChanged.add(function(index){
		var bone=BoneUtils.getBoneList(ap.skinnedMesh)[index];
		var boneName=bone.name;
		
		var isTwist=Mbl3dUtils.isTwistBoneName(boneName);
		var hasTwist=Mbl3dUtils.hasTwistBoneName(boneName);
		
		if(!isTwist && !hasTwist){
			textRow.setDisplay("none");
			xRatio.setDisplay("none");
			yRatio.setDisplay("none");
			zRatio.setDisplay("none");
			twistBoneName=null;
			return;
		}
		textRow.setDisplay("");
		xRatio.setDisplay("");
		yRatio.setDisplay("");
		zRatio.setDisplay("");
		
		twistBoneName=Mbl3dUtils.convertToTwistBoneName(boneName);
		
		if(isArmTwist(twistBoneName)){
			target.setValue("Axis X");	
		}else{
			target.setValue("Axis Y");	
		}
		
		textRow.text.setValue(twistBoneName);
		
		var value=ap.twistValues[twistBoneName]!==undefined?ap.twistValues[twistBoneName]:{x:0,y:0,z:0};
		
		xRatio.setValue(value.x);
		yRatio.setValue(value.y);
		zRatio.setValue(value.z);
		scope.xRatio=(value.x);
		scope.yRatio=(value.y);
		scope.zRatio=(value.z);
	});
	
	function update(){
		var value=ap.twistValues[twistBoneName];
		value.x=scope.xRatio;
		value.y=scope.yRatio;
		value.z=scope.zRatio;
		
		
		ap.getSignal("twistNeedUpdate").dispatch(twistBoneName)
	}
	
	var xRatio=new UI.NumberButtons("X",-1,1,0.1,0,function(v){
		scope.xRatio=v;
		update();
	},[-1,-0.5,0,0.5,1]);
	xRatio.text.setWidth("40px");
	container.add(xRatio);
	var yRatio=new UI.NumberButtons("Y",-1,1,0.1,0,function(v){
		scope.yRatio=v;
		update();
	},[-1,-0.5,0,0.5,1]);
	yRatio.text.setWidth("40px");
	container.add(yRatio);
	var zRatio=new UI.NumberButtons("Z",-1,1,0.1,0,function(v){
		scope.zRatio=v;
		update();
	},[-1,-0.5,0,0.5,1]);
	zRatio.text.setWidth("40px");
	container.add(zRatio);
	
	return container;
}
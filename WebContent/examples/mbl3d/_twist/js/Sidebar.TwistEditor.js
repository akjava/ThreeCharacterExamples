Sidebar.TwistEditor=function(ap){
	var scope=this;
	var container=new UI.TitlePanel("Twist Editor");
	this.xRatio=0;
	this.yRatio=0;
	this.zRatio=0;
	
	ap.twistValues={};
	
	//init here,TODO for glb
	ap.twistValues["lowerarm_twist_L"]={x:0.5,y:0,z:0};
	ap.twistValues["lowerarm_twist_R"]={x:0.5,y:0,z:0};
	ap.twistValues["upperarm_twist_L"]={x:0.5,y:0,z:0};
	ap.twistValues["upperarm_twist_R"]={x:0.5,y:0,z:0};
	ap.twistValues["thigh_twist_L"]={x:0,y:0.5,z:0};
	ap.twistValues["thigh_twist_R"]={x:0,y:0.5,z:0};
	ap.twistValues["calf_twist_L"]={x:0,y:0.5,z:0};
	ap.twistValues["calf_twist_R"]={x:0,y:0.5,z:0};
	
	var euler=new THREE.Euler();
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
	
	ap.signals.rendered.add(twistUpdate)
	
	
	var boneName=null;
	var textRow=new UI.TextRow("");
	container.add(textRow);
	
	ap.signals.boneSelectionChanged.add(function(index){
		var bone=ap.selectedBone;
		boneName=bone.name;
		
		var isTwist=Mbl3dUtils.isTwistBoneName(bone.name);
		var hasTwist=Mbl3dUtils.hasTwistBoneName(bone.name);
		
		if(!isTwist && !hasTwist){
			textRow.setDisplay("none");
			xRatio.setDisplay("none");
			yRatio.setDisplay("none");
			zRatio.setDisplay("none");
			return;
		}
		textRow.setDisplay("");
		xRatio.setDisplay("");
		yRatio.setDisplay("");
		zRatio.setDisplay("");
		
		boneName=Mbl3dUtils.convertToTwistBoneName(bone.name);
		
		textRow.text.setValue(boneName);
		
		var value=ap.twistValues[boneName]!==undefined?ap.twistValues[boneName]:{x:0,y:0,z:0};
		
		xRatio.setValue(value.x);
		yRatio.setValue(value.y);
		zRatio.setValue(value.z);
	});
	
	function update(){
		var value={};
		ap.twistValues[boneName]=value;
		value.x=scope.xRatio;
		value.y=scope.yRatio;
		value.z=scope.zRatio;
		console.log(boneName,value);
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
Sidebar.RotateArmX=function(ap){
	var panel=new UI.TitlePanel("Rotate Arm X");
	
	ap.rotateArmXAngle_L=0;
	ap.rotateArmXAngle_R=0;
	

	ap.rotateArmXMin=-160;
	ap.rotateArmXMax=90;
	
	ap.rotateArmLowerArmRatio=0.5;//TODO make UI
	
	ap.signals.loadingModelFinished.add(function(){
		ap.rotateArmXAngle_L=0;
		ap.rotateArmXAngle_R=0;
		rightArm.setValue(0);
		leftArm.setValue(0);
	});
	
	function onBonRotationChanged(){
		updateUpperarm();
	}
	
	ap.getSignal("applyRotateX").add(function(ikName){
		var boneList=ap.ikControler.getBoneList();
		var lr=null;
		if(ikName=="LeftArm"){
			lr="L";
		}else if(ikName=="RightArm"){
			lr="R";
		}
		if(lr==null){
			return;
		}
		var lowerarm=BoneUtils.findBoneByEndsName(boneList,"lowerarm_"+lr);
		var lowerarmIndex=boneList.indexOf(lowerarm);
		var hand=BoneUtils.findBoneByEndsName(boneList,"hand_"+lr);
		var handIndex=boneList.indexOf(hand);
		
		
		//TODO support hand lower ratio
		var angle=lr=="L"?ap.rotateArmXAngle_L:ap.rotateArmXAngle_R;
		
		
		var lowerarmAngle=THREE.Math.degToRad(angle*ap.rotateArmLowerArmRatio);
		var handAngle=THREE.Math.degToRad(angle*(1.0-ap.rotateArmLowerArmRatio));
		
		lowerarm.rotation.x=lowerarmAngle;
		hand.rotation.x=handAngle;
		
		//TODO support twist
		
		ap.getSignal("boneRotationChanged").dispatch(lowerarmIndex);
		ap.getSignal("boneRotationChanged").dispatch(handIndex);
		ap.getSignal("boneRotationFinished").dispatch(lowerarmIndex);
		ap.getSignal("boneRotationFinished").dispatch(handIndex);
	});
	
	var leftArm=new UI.NumberButtons("Left",ap.rotateArmXMin,ap.rotateArmXMax,10,0,function(v){
		ap.rotateArmXAngle_L=v;
		ap.signals.applyRotateX.dispatch("LeftArm");
	},[ap.rotateArmXMin,-90,0,ap.rotateArmXMax]);
	panel.add(leftArm);
	
	var row1=new UI.Row();
	row1.setTextAlign("Right");
	row1.add(new UI.ButtonsDiv([-30,-15,-5,-1,1,5,15,30],function(v){
		var num=Number(v);
		var newValue=leftArm.getValue()+num;
		
		if(newValue<ap.rotateArmXMin){
			newValue=ap.rotateArmXMin;
		}
		if(newValue>ap.rotateArmXMax){
			newValue=ap.rotateArmXMax;
		}
		
		
		leftArm.setValue(newValue);
		
		ap.rotateArmXAngle_L=newValue;
		ap.signals.applyRotateX.dispatch("LeftArm");
	}));
	panel.add(row1);
	
	
	var rightArm=new UI.NumberButtons("Right",ap.rotateArmXMin,ap.rotateArmXMax,10,0,function(v){
		ap.rotateArmXAngle_R=v;
		ap.signals.applyRotateX.dispatch("RightArm");
	},[ap.rotateArmXMin,-90,0,ap.rotateArmXMax]);
	panel.add(rightArm);
	
	var row2=new UI.Row();
	row2.setTextAlign("Right");
	row2.add(new UI.ButtonsDiv([-30,-15,-5,-1,1,5,15,30],function(v){
		var num=Number(v);
		var newValue=rightArm.getValue()+num;
		
		if(newValue<ap.rotateArmXMin){
			newValue=ap.rotateArmXMin;
		}
		if(newValue>ap.rotateArmXMax){
			newValue=ap.rotateArmXMax;
		}
		
		
		rightArm.setValue(newValue);
		

		
		ap.rotateArmXAngle_R=newValue;
		ap.signals.applyRotateX.dispatch("RightArm");
	}));
	panel.add(row2);
	
	panel.add(new UI.Subtitle("Upperarm"));
	var upper=new UI.NumberButtons("L",-90,30,10,0,function(v){
		var boneList=BoneUtils.getBoneList(ap.skinnedMesh);
		var arm=BoneUtils.findBoneByEndsName(boneList,"upperarm_L");
		var index=boneList.indexOf(arm);
		arm.rotation.x=THREE.Math.degToRad(v);
		ap.getSignal("boneRotationChanged").dispatch(index);
		ap.getSignal("boneRotationFinished").dispatch(index);
	},[-90,-45,0,30]);
	panel.add(upper);
	
	return panel;
}
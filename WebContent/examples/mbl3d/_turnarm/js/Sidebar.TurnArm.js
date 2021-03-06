Sidebar.TurnArm=function(ap){
	var panel=new UI.TitlePanel("Turn Arm");
	
	ap.turnArmAngle_L=0;
	ap.turnArmAngle_R=0;
	ap.turnArm_L=[new THREE.Euler(),new THREE.Euler()];
	ap.turnArm_R=[new THREE.Euler(),new THREE.Euler()];
	
	console.log(ap);
	
	ap.signals.recoverTurnArm.add(function(ikName){
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
		var hand=BoneUtils.findBoneByEndsName(boneList,"hand_"+lr);
		

		var angles=ap["turnArm"+"_"+lr];
		if(angles){
			lowerarm.rotation.copy(angles[0]);
			hand.rotation.copy(angles[1]);
		}
		
	});
	
	ap.signals.storeTurnArm.add(function(ikName){
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
		var hand=BoneUtils.findBoneByEndsName(boneList,"hand_"+lr);
		
		var key="turnArm"+"_"+lr;
		ap[key]=[lowerarm.rotation.clone(),hand.rotation.clone()];
	});
	
	ap.signals.applyTurnArm.add(function(ikName){
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
		var hand=BoneUtils.findBoneByEndsName(boneList,"hand_"+lr);
		
		var angles=ap["turnArm"+"_"+lr];
		if(angles){
			lowerarm.rotation.copy(angles[0]);
			hand.rotation.copy(angles[1]);
		}
		
		//TODO support hand lower ratio
		var angle=ap["turnArmAngle"+"_"+lr];
		var rad=THREE.Math.degToRad(angle/2);
		
		var q=lowerarm.quaternion.clone();
		var xq=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), rad);
		q.multiply(xq);
		lowerarm.quaternion.copy(q);
		
		var q=hand.quaternion.clone();
		var xq=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), rad);
		q.multiply(xq);
		hand.quaternion.copy(q);
		
	});
	
	var leftArm=new UI.NumberButtons("Left",-180-30,90,10,0,function(v){
		ap.turnArmAngle_L=v;
		ap.signals.applyTurnArm.dispatch("LeftArm");
	},[-180,-90,0,90]);
	panel.add(leftArm);
	
	var row1=new UI.Row();
	row1.setTextAlign("Right");
	row1.add(new UI.ButtonsDiv([-30,-15,-5,-1,1,5,15,30],function(v){
		var num=Number(v);
		var newValue=leftArm.getValue()+num;
		leftArm.setValue(newValue);
		
		ap.turnArmAngle_L=newValue;
		ap.signals.applyTurnArm.dispatch("LeftArm");
	}));
	panel.add(row1);
	
	
	var rightArm=new UI.NumberButtons("Right",-180-30,90,10,0,function(v){
		ap.turnArmAngle_R=v;
		ap.signals.applyTurnArm.dispatch("RightArm");
	},[-180,-90,0,90]);
	panel.add(rightArm);
	
	var row2=new UI.Row();
	row2.setTextAlign("Right");
	row2.add(new UI.ButtonsDiv([-30,-15,-5,-1,1,5,15,30],function(v){
		var num=Number(v);
		var newValue=rightArm.getValue()+num;
		rightArm.setValue(newValue);
		
		ap.turnArmAngle_R=newValue;
		ap.signals.applyTurnArm.dispatch("RightArm");
	}));
	panel.add(row2);
	
	return panel;
}
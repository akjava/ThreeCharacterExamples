Sidebar.TurnArm=function(ap){
	var panel=new UI.TitlePanel("Turn Arm");
	
	var leftArm=new UI.NumberButtons("Left",-90,180+45,10,0,function(v){
		var half=v/2;
		var rad=THREE.Math.degToRad(half);
		
		var boneList=ap.ikControler.getBoneList();
		var lr="L";
		var lowerarm=BoneUtils.findBoneByEndsName(boneList,"lowerarm_"+lr);
		
		
		var lowerarm_rad=rad;
		var rot=lowerarm.rotation;
		var newRot=rot.clone();
		newRot.x=0;
		newRot.z=0;
		var q=new THREE.Quaternion().setFromEuler(newRot);
		var xq=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), rad);
		q.multiply(xq);
		lowerarm.quaternion.copy(q);
		
		var hand=BoneUtils.findBoneByEndsName(boneList,"hand_"+lr);
		var hand_rad=rad;
		var rot=hand.rotation;
		var newRot=rot.clone();
		newRot.x=hand_rad;
		hand.rotation.copy(newRot);
		
	},[-90,0,90,180]);
	panel.add(leftArm);
	
	return panel;
}
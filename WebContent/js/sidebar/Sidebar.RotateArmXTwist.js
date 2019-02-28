/**
 * 
 * seems Left Upperarm different
 * 
 */
Sidebar.RotateArmXTwist=function(ap){

	if(!ap.applyTwistUpperarmX)
	ap.applyTwistUpperarmX=true;
	if(!ap.applyTwistUpperarmXRatio)
	ap.applyTwistUpperarmXRatio=0.5;
	
	
	if(!ap.applyTwistUpperarmX)
		ap.applyTwistLowerarmX=true;
	if(!ap.applyTwistLowerarmXRatio)
		ap.applyTwistLowerarmXRatio=0.3;
	
var container=new UI.TitlePanel("Rotate Arm X Twist");

function updateArm(armName,ratio,lr){
	var end=lr?"L":"R";
	var f=armName=="upperarm"?-1:1;
	
	var boneList=BoneUtils.getBoneList(ap.skinnedMesh);
	var arm=BoneUtils.findBoneByEndsName(boneList,armName+"_"+end);
	
	var v=arm.rotation.x;
	var twistName=Mbl3dUtils.convertToTwistBoneName(arm.name);
	var rad=f*v*ratio;
	var twistBone=BoneUtils.findBoneByEndsName(boneList,twistName);
	/*console.log(arm.name);
	console.log(twistName);
	console.log(rad);*/
	twistBone.rotation.x=rad;
	var twistIndex=boneList.indexOf(twistBone);
	ap.getSignal("boneRotationChanged").dispatch(twistIndex);
	ap.getSignal("boneRotationFinished").dispatch(twistIndex);
}

var upperarm=new UI.NumberButtons("Upperarm Ratio",0,1,1,ap.applyTwistUpperarmXRatio,function(v){
	ap.applyTwistUpperarmXRatio=v;
	
	updateArm("upperarm",v,true);
	updateArm("upperarm",v,false);
},[0,0.5,1.0]);
upperarm.text.setWidth("120px");
container.add(upperarm);

var lowerarm=new UI.NumberButtons("Lowerarm Ratio",0,1,1,ap.applyTwistLowerarmXRatio,function(v){
	ap.applyTwistLowerarmXRatio=v;
	
	updateArm("lowerarm",v,true);
	updateArm("lowerarm",v,false);
},[0,0.5,1.0]);
lowerarm.text.setWidth("120px");
container.add(lowerarm);
return container;
}
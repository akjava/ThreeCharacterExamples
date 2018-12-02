Sidebar.Rotate=function(ap){
var container = new UI.TitlePanel("Rotate");


var scope=this;
this.autoUpdate=true;
this.boneAngleX=.5;
this.boneAngleY=0;
this.boneAngleZ=-.5;

var row=new UI.Row();
container.add(row);

var breastRotateEnabled=new UI.CheckboxText("Breast",ap.breastRotateEnabled,function(v){
		ap.breastRotateEnabled=v;
});
row.add(breastRotateEnabled);

var thighRotateEnabled=new UI.CheckboxText("Thigh",ap.thighRotateEnabled,function(v){
	ap.thighRotateEnabled=v;
});
row.add(thighRotateEnabled);


var boneAngleX=new UI.NumberPlusMinus("X",-180,180,10,scope.boneAngleX,function(v){
	scope.boneAngleX=v;
	if(scope.autoUpdate){
		rotate();
		}
},[5,15,30]);
boneAngleX.text.setWidth("10px");
boneAngleX.number.setWidth("35px");
row.add(boneAngleX);

var boneAngleY=new UI.NumberPlusMinus("Y",-180,180,10,scope.boneAngleY,function(v){
	scope.boneAngleY=v;
	if(scope.autoUpdate){
		rotate();
		}
},[5,15,30]);
boneAngleY.text.setWidth("10px");
boneAngleY.number.setWidth("35px");
row.add(boneAngleY);

var boneAngleZ=new UI.NumberPlusMinus("Z",-180,180,10,scope.boneAngleZ,function(v){
	scope.boneAngleZ=v;
	if(scope.autoUpdate){
		rotate();
		}
},[5,15,30]);
boneAngleZ.text.setWidth("10px");
boneAngleZ.number.setWidth("35px");
row.add(boneAngleZ);

function rotate(){
	ap.signals.animationStopped.dispatch();
	ap.signals.rotateAnimationStarted.dispatch();
	
};


//need defaultBoneMatrix & call after model loaded
function addRotateFunction(){
	ap.signals.rotateAnimationStarted.add(function(){

		
		//chest Expansion
		//ap.signals.scaleAnimationStarted.dispatch();
		var mixed=[];
		
		
		if(ap.breastRotateEnabled){
			var indices=[scope.breast_R,scope.breast_L];
			var startRotate=[BoneUtils.makeQuaternionFromXYZDegree(0,0,0,scope.breast_R_default.rotation),BoneUtils.makeQuaternionFromXYZDegree(0,0,0,scope.breast_L_default.rotation)];
			var endRotate=[
				BoneUtils.makeQuaternionFromXYZDegree(scope.boneAngleX,scope.boneAngleY,scope.boneAngleZ,scope.breast_R_default.rotation),
				BoneUtils.makeQuaternionFromXYZDegree(scope.boneAngleX,scope.boneAngleY,-scope.boneAngleZ,scope.breast_L_default.rotation)
				];
			
			var intime=ap.breastRotateIntime;
			var outtime=ap.breastRotateOuttime;

			//startRotate
			var clip=AnimeUtils.makeRotateBoneAnimation(indices,startRotate,endRotate,intime,outtime)
			mixed=mixed.concat(clip.tracks);
		}
	
		
		var mixedClip=new THREE.AnimationClip("RotateAnimation", -1, mixed);
		
		ap.rotateClipDuration=mixedClip.duration;

		//console.log(clip);
		var mixer=ap.mixer;
		//mixer.stopAllAction();
		mixer.uncacheClip(mixedClip);
		ap.animationAction=mixer.clipAction(mixedClip).play();

	} );
}

var breastRotateIntime=new UI.NumberButtons("In time",0.01,10,1,ap.breastRotateIntime,function(v){
	ap.breastRotateIntime=v;
},[0.1,0.5,1]);
container.add(breastRotateIntime);

var breastRotateOuttime=new UI.NumberButtons("Out time",0.01,10,1,ap.breastRotateOuttime,function(v){
	ap.breastRotateOuttime=v;
},[0.1,0.5,1]);
container.add(breastRotateOuttime);

var keys=['breast_R','breast_L','thigh_twist_L','thigh_twist_R'];
ap.signals.loadingModelFinished.add(function(){
	
	var boneList=BoneUtils.getBoneList(ap.skinnedMesh);
	keys.forEach(function(key){
		scope[key]=BoneUtils.findBoneIndexByEndsName(boneList,key);
		scope[key+'_default']=ap.defaultBoneMatrix[boneList[scope[key]].name];
	});
	
	addRotateFunction();
});


var row=new UI.Row();
container.add(row);
var bt=new UI.Button("Start Rotate Only").onClick( function () {
	ap.signals.animationStopped.dispatch();
	ap.signals.rotateAnimationStarted.dispatch();
});

row.add(bt);
var bt=new UI.Button("Stop All").onClick( function () {

	ap.signals.animationStopped.dispatch();

} );
row.add(bt);
return container;
}
Sidebar.Translate=function(ap){
var container = new UI.TitlePanel("Translate");


var scope=this;

var row=new UI.Row();
container.add(row);

var breastTranslateEnabled=new UI.CheckboxText("Breast",ap.breastTranslateEnabled,function(v){
		ap.breastTranslateEnabled=v;
});
row.add(breastTranslateEnabled);

var thighTranslateEnabled=new UI.CheckboxText("Thigh",ap.thighTranslateEnabled,function(v){
	ap.thighTranslateEnabled=v;
});
row.add(thighTranslateEnabled);


var breastTranslateVertical=new UI.NumberButtons("Vertical",-0.1,0.1,0.01,ap.breastTranslateVertical,function(v){
	ap.breastTranslateVertical=v;
},[-.001,-.01]);
breastTranslateVertical.number.precision=4;
container.add(breastTranslateVertical);

var breastTranslateHorizontal=new UI.NumberButtons("Horizontal",-0.1,0.1,0.01,ap.breastTranslateHorizontal,function(v){
	ap.breastTranslateHorizontal=v;
},[.001,.01]);
breastTranslateHorizontal.number.precision=4;
container.add(breastTranslateHorizontal);

function addFunction(){
	ap.signals.translateAnimationStarted.add(function(){

		//chest Expansion
		//ap.signals.scaleAnimationStarted.dispatch();
		var mixed=[];
		
		
		if(ap.breastTranslateEnabled){
			var indices=[scope.breast_R,scope.breast_L];
			var startPts=[scope.breast_R_default.translate,scope.breast_L_default.translate];
			var endPts=[
				new THREE.Vector3().set(-ap.breastTranslateHorizontal,ap.breastTranslateVertical,0).add(scope.breast_R_default.translate),
				new THREE.Vector3().set(ap.breastTranslateHorizontal,ap.breastTranslateVertical,0).add(scope.breast_L_default.translate)];
			
			var intime=ap.breastTranslateIntime;
			var outtime=ap.breastTranslateOuttime;
			
			var clip=AnimeUtils.makeTranslateBoneAnimation(indices,startPts,endPts,intime,outtime)
			mixed=mixed.concat(clip.tracks);
		}
		if(ap.thighTranslateEnabled){
			var indices=[scope.thigh_twist_R,scope.thigh_twist_L];
			var startPts=[scope.thigh_twist_R_default.translate,scope.thigh_twist_L_default.translate];
			var endPts=[
				new THREE.Vector3().set(-ap.breastTranslateHorizontal,ap.breastTranslateVertical,0).add(scope.thigh_twist_R_default.translate),
				new THREE.Vector3().set(ap.breastTranslateHorizontal,ap.breastTranslateVertical,0).add(scope.thigh_twist_L_default.translate)];
			
			var intime=ap.breastTranslateIntime;
			var outtime=ap.breastTranslateOuttime;
			
			var clip=AnimeUtils.makeTranslateBoneAnimation(indices,startPts,endPts,intime,outtime)
			mixed=mixed.concat(clip.tracks);
		}
		
		var mixedClip=new THREE.AnimationClip("TranslateAnimation", -1, mixed);
		
		ap.translateClipDuration=mixedClip.duration;

		//console.log(clip);
		var mixer=ap.mixer;
		//mixer.stopAllAction();
		mixer.uncacheClip(mixedClip);
		ap.animationAction=mixer.clipAction(mixedClip).play();

	} );
}

var breastTranslateIntime=new UI.NumberButtons("In time",0.01,10,1,ap.breastTranslateIntime,function(v){
	ap.breastTranslateIntime=v;
},[0.1,0.5,1]);
container.add(breastTranslateIntime);

var breastTranslateOuttime=new UI.NumberButtons("Out time",0.01,10,1,ap.breastTranslateOuttime,function(v){
	ap.breastTranslateOuttime=v;
},[0.1,0.5,1]);
container.add(breastTranslateOuttime);

var keys=['breast_R','breast_L','thigh_twist_L','thigh_twist_R'];
ap.signals.loadingModelFinished.add(function(){
	
	var boneList=BoneUtils.getBoneList(ap.skinnedMesh);

	keys.forEach(function(key){
		scope[key]=BoneUtils.findBoneIndexByEndsName(boneList,key);
		scope[key+'_default']=ap.defaultBoneMatrix[boneList[scope[key]].name];
	});
	
	addFunction();
});


var row=new UI.Row();
container.add(row);
var bt=new UI.Button("Start Translate Only").onClick( function () {
	ap.signals.animationStopped.dispatch();
	ap.signals.translateAnimationStarted.dispatch();
});

row.add(bt);
var bt=new UI.Button("Stop All").onClick( function () {

	ap.signals.animationStopped.dispatch();

} );
row.add(bt);
return container;
}
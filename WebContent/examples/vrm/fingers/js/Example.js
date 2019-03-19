Example=function(application){
	var ap=application;
	ap.renderer.gammaOutput=true;
	
	//default camera,TODO change by signal
	ap.camera.position.set( 0, 100, -260 );//z is opposite
	ap.controls.target.set(0,90,0);
	ap.controls.update();
	
	var url='../../../dataset/vrm/Alicia/AliciaSolid.vrm';
	var url='../../../dataset/vrm/3207836450134888583.vrm';
	
	ap.modelUrl=ap.defaultModelUrl==undefined?url:ap.defaultModelUrl; //defaultModelUrl set by sidebar

	//light
	ap.scene.add(new THREE.AmbientLight(0xaaaaaa));//use basic material
	
	IkControler.logging=false;
	ap.ikControler=new IkControler(undefined,ap);
	
	
	Logics.loadingModelFinishedForBoneAttachControler(ap);
	var boneFilter=function(bone){
		//initialized on loadingModelFinished#101
		return ap.humanoidBoneNameList.indexOf(bone.name)!=-1;
	}
	
	Logics.loadingModelFinishedForRotationControler(ap,boneFilter);
	
	Logics.loadingModelFinishedForTranslateControler(ap);
	Logics.loadingModelFinishedForIkControler(ap,"HumanoidFingerIk");
	
	ap.signals.loadingModelFinished.add(function(mesh){
		var parts=["Thumb","Index","Middle","Ring","Little"];
		parts.forEach(function(part){
			ap.ikControler.setEndSiteEnabled(part,true);
		});
		
	});
	//vrm
	ap.ammoVisible=false;
	Logics.initializeAmmo(ap);
	
	Logics.loadingModelFinishedForSecondaryAnimationControler(ap);
	
	Logics.loadingModelStartedForVrm(ap);
	
	ap.fingerPresetsControler=new VrmFingerPresetsControler(ap,new VrmFingerPresets());
	
	
	ap.getSignal("cameraControlerChanged").dispatch(new THREE.Vector3(-100,140,-4),new THREE.Vector3(0,100,0))
	
	ap.getSignal("loadingModelStarted").dispatch(url);
	
	ap.getSignal("bgImageLoadingStarted").dispatch('../../../dataset/texture/bg/boxsky1.jpg')

}
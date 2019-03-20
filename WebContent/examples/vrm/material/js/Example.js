Example=function(application){
	var ap=application;
	ap.renderer.gammaOutput=true;
	
	//default camera
	ap.camera.position.set( 0, 100, -250 );//z is opposite
	ap.controls.target.set(0,100,0);
	ap.controls.update();
	
	var url='../../../dataset/vrm/Alicia/AliciaSolid.vrm';
	//var url='../../../dataset/vrm/3207836450134888583.vrm';
	
	ap.modelUrl=ap.defaultModelUrl==undefined?url:ap.defaultModelUrl; //defaultModelUrl set by sidebar

	//light
	ap.scene.add(new THREE.AmbientLight(0xaaaaaa));//use basic material
	
	Logics.loadingModelFinishedForBoneAttachControler(ap);
	
	//vrm
	Logics.initializeAmmo(ap);
	
	Logics.loadingModelFinishedForSecondaryAnimationControler(ap);
	
	Logics.loadingModelStartedForVrm(ap);
	
	ap.getSignal("loadingModelStarted").dispatch(url);
	
	//ap.ammoVisible=true;

}
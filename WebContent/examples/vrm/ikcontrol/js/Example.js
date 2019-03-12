Example=function(application){
	var ap=application;
	ap.renderer.gammaOutput=true;
	
	//default camera
	ap.camera.position.set( 0, 100, -250 );//z is opposite
	ap.controls.target.set(0,100,0);
	ap.controls.update();
	
	var url='../../../dataset/vrm/Alicia/AliciaSolid.vrm';
	ap.modelUrl=ap.defaultModelUrl==undefined?url:ap.defaultModelUrl; //defaultModelUrl set by sidebar

	//light
	ap.scene.add(new THREE.AmbientLight(0xaaaaaa));//use basic material
	
	IkControler.logging=true;
	ap.ikControler=new IkControler(undefined,ap);
	
	
	Logics.loadingModelFinishedForBoneAttachControler(ap);
	Logics.loadingModelFinishedForIkControler(ap,"HumanoidIk");
	
	//vrm
	Logics.initializeAmmo(ap);
	
	Logics.loadingModelFinishedForSecondaryAnimationControler(ap);
	
	Logics.loadingModelStartedForVrm(ap);
	
	ap.getSignal("loadingModelStarted").dispatch(url);

}
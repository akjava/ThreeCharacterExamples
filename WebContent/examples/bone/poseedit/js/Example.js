Example=function(application){
	var ap=application;
	var scope=this;
	ap.objects=[];//TODO
	
	//default camera
	ap.camera.position.set( 0, 100, 250 );
	ap.controls.target.set(0,100,0);
	ap.controls.update();
	
	var url="../../../dataset/mbl3d/models/anime2_female_modifybreast.fbx";
	ap.modelUrl=ap.defaultModelUrl==undefined?url:ap.defaultModelUrl; //defaultModelUrl set by sidebar

	ap.fingerPresetsControler=new FingerPresetsControler(ap,new FingerPresets());

	Logics.loadTextureAtOnce(ap,"../../../dataset/mbl3d/texture/aogaus5.jpg","aoMap");
	
	ap.signals.loadingModelStarted.dispatch(ap.modelUrl);
}
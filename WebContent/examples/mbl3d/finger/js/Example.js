Example=function(application){
	var ap=application;
	
	
	
	var url="../../../dataset/mbl3d/models/anime2_female_modifybreast.fbx";
	ap.modelUrl=ap.defaultModelUrl==undefined?url:ap.defaultModelUrl; //defaultModelUrl set by sidebar
	
	
	//TODO move logic
	ap.fingerPresetsControler=new FingerPresetsControler(ap,new FingerPresets());
	
	
	
	
	Logics.loadTextureAtOnce(ap,"../../../dataset/mbl3d/texture/ao.jpg","aoMap");
	
	ap.signals.loadingModelStarted.dispatch(ap.modelUrl);
}
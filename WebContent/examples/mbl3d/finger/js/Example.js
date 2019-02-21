Example=function(application){
	var ap=application;
	
	
	
	var url="../../../dataset/mbl3d/models/anime2_female_modifybreast.fbx";
	ap.modelUrl=ap.defaultModelUrl==undefined?url:ap.defaultModelUrl; //defaultModelUrl set by sidebar
	
	
	//TODO move logic
	ap.fingerPresetsControler=new FingerPresetsControler(ap,new FingerPresets());
	
	
	var loaded=false;
	ap.signals.loadingModelFinished.add(function(){
		if(!loaded){
			var texture=Mbl3dUtils.loadTexture("../../../dataset/mbl3d/texture/ao.jpg");
			ap.signals.loadingTextureFinished.dispatch(texture,"aoMap");
			loaded=true;
		}
	});
	
	
	ap.signals.loadingModelStarted.dispatch(ap.modelUrl);
}
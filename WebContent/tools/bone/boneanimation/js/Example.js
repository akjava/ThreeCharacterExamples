Example=function(application){
	var ap=application;
	var scope=this;
	
	ap.objects=[];//for click object TODO
	
	//default camera
	ap.camera.position.set( 0, 100, 250 );
	ap.controls.target.set(0,100,0);
	ap.controls.update();
	
	//default model
	var url="../../../dataset/mbl3d/models/anime2_female_modifybreast.fbx";
	ap.modelUrl=ap.defaultModelUrl==undefined?url:ap.defaultModelUrl; //defaultModelUrl set by sidebar

	
	ap.signals.loadingModelFinished.add(function(){
		//timeliner create when model loaded
		ap.getSignal("timelinerVisible").dispatch(true,true);
	},undefined,-100);
	
	ap.signals.loadingModelStarted.dispatch(ap.modelUrl);
}
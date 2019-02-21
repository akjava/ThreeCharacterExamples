/**
 * 
 * see
 * Sidebar.TimelinerMesh
 * 
 */
Example=function(application){
	var ap=application;
	
	//camera for timeliner
	ap.camera.position.set( 0, 125, 280 );
	ap.controls.target.set(0,60,0);
	ap.controls.update();
	
	var c=ap.camera.position;
	var t=ap.controls.target;
	ap.getSignal("cameraControlerChanged").dispatch(c,t);
	
	var url="../../../dataset/mbl3d/models/anime2_female_modifybreast.fbx";
	ap.modelUrl=ap.defaultModelUrl==undefined?url:ap.defaultModelUrl; //defaultModelUrl set by sidebar
	
	ap.signals.loadingModelStarted.dispatch(ap.modelUrl);
}
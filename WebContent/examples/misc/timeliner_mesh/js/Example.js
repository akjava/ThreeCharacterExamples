/**
 * 
 * see
 * Sidebar.TimelinerMesh
 * 
 */
Example=function(application){
	var ap=application;
	
	//default camera
	ap.camera.position.set( 0, 100, 250 );
	ap.controls.target.set(0,100,0);
	ap.controls.update();
	
	var url="../../../dataset/mbl3d/models/anime2_female_modifybreast.fbx";
	ap.modelUrl=ap.defaultModelUrl==undefined?url:ap.defaultModelUrl; //defaultModelUrl set by sidebar
	
	ap.signals.loadingModelStarted.dispatch(ap.modelUrl);
}
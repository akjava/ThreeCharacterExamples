Example=function(application){
	var ap=application;
	
	//default camera
	ap.camera.position.set( 0, 100, 300 );
	ap.controls.target.set(0,100,0);
	ap.controls.update();
	
	var url="../../../dataset/mbl3d/models/anime2_female.fbx";
	ap.modelUrl=ap.defaultModelUrl==undefined?url:ap.defaultModelUrl; //defaultModelUrl set by sidebar

	
	//ap.signals.loadingModelStarted.dispatch(ap.modelUrl);
	
	var box=new THREE.Mesh(new THREE.BoxGeometry(100,100,100));
	//ap.scene.add(box);
	
	
	
	//light
	ap.scene.add(new THREE.AmbientLight(0xffffff));
	
	
    
}
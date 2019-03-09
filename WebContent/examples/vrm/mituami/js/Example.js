Example=function(application){
	var ap=application;
	
	//default camera
	ap.camera.position.set( 0, 100, -250 );
	ap.controls.target.set(0,100,0);
	ap.controls.update();
	
	var url="../../../dataset/mbl3d/models/anime2_female.fbx";
	ap.modelUrl=ap.defaultModelUrl==undefined?url:ap.defaultModelUrl; //defaultModelUrl set by sidebar

	
	//ap.camera.position.set( 0, 1.6, - 2.2 );
	//ap.controls.target.set( 0, 0.9, 0 );
	//ap.controls.update();
	
	//light
	ap.scene.add(new THREE.AmbientLight(0x888888));
	
	
	Logics.loadingModelFinishedForBoneAttachControler(ap);
	//vrm
	Logics.initializeAmmo(ap);
	loadingModelFinishedForMituamiControler(ap);
	
	
	
	function loadingModelFinishedForMituamiControler(ap){
		ap.signals.loadingModelFinished.add(function(mesh){
			
			
			
			if(!ap.breastControler){
				ap.breastControler=new MituamiControler();
			}else{
				ap.breastControler.dispose();
			}
			
			ap.breastControler.logging=false;
			ap.breastControler.initialize(ap.ammoControler,ap.boneAttachControler);
			ap.breastControler.newMituami();
			
			ap.ammoControler.setVisibleAll(false);
		},undefined,-1);
		
		ap.signals.rendered.add(function(){
			if(ap.breastControler){
				ap.ammoControler.update();
				ap.breastControler.update();
			}
		},undefined,-2);//call later boneAttach
	}
	ap.getSignal("loadingModelFinished").add(function(model){
		ap.skinnedMesh=model;
		ap.scene.add(model);
		model.scale.set(100,100,100);
		ap.boneAttachControler.update(true);//scale changed;
		
	});
	
	
	VrmUtils.loadVrm(ap,'../../../dataset/vrm/Alicia/AliciaSolid.vrm');	

}
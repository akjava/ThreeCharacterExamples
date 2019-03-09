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
	
	//vrm
	
	Logics.initializeAmmo(ap);
	loadingModelFinishedForRibbonControler(ap);
	
	Logics.loadingModelFinishedForBoneAttachControler(ap);
	
	function loadingModelFinishedForRibbonControler(ap){
		ap.signals.loadingModelFinished.add(function(mesh){
			if(!ap.breastControler){
				ap.breastControler=new RibbonControler();
			}else{
				ap.breastControler.dispose();
			}
			ap.breastControler.logging=false;
			ap.breastControler.initialize(ap.ammoControler,ap.boneAttachControler);
			ap.breastControler.newBreast();
			
			ap.ammoControler.setVisibleAll(false);
		});
		
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
		
		var helper=new THREE.SkeletonHelper(model);
		ap.scene.add(helper);
		ap.skeletonHelper=helper;
		helper.material.visible=false;
						
	});
	
	
	VrmUtils.loadVrm(ap,'../../../dataset/vrm/Alicia/AliciaSolid.vrm');	

}
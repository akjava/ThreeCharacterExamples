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
	loadingModelFinishedForHairControler(ap);
	
	
	
	function loadingModelFinishedForHairControler(ap){
		ap.signals.loadingModelFinished.add(function(mesh){
			
			
			
			if(!ap.hairControler){
				ap.hairControler=new HairControler(ap);
			}else{
				ap.hairControler.dispose();
			}
			
			ap.hairControler.logging=false;
			ap.hairControler.initialize(ap.ammoControler,ap.boneAttachControler);
			ap.hairControler.newHair();
			
			ap.ammoControler.setVisibleAll(false);
		},undefined,-1);
		
		ap.signals.rendered.add(function(){
			if(ap.hairControler){
				ap.ammoControler.update();
				ap.hairControler.update();
			}
		},undefined,-2);//call later boneAttach
	}
	ap.getSignal("loadingModelFinished").add(function(model){
		ap.skinnedMesh=model;
		ap.scene.add(model);
		model.scale.set(100,100,100);
		ap.boneAttachControler.update(true);//scale changed;
		
	},undefined,100);
	
	
	VrmUtils.loadVrm(ap,'../../../dataset/vrm/Alicia/AliciaSolid.vrm');	

}
Example=function(application){
	var ap=application;
	//ap.renderer.gammaInput=true;
	ap.renderer.gammaOutput=true;
	
	//default camera
	ap.camera.position.set( 0, 100, -250 );
	ap.controls.target.set(0,100,0);
	ap.controls.update();
	
	var url='../../../dataset/vrm/Alicia/AliciaSolid.vrm';
	ap.modelUrl=ap.defaultModelUrl==undefined?url:ap.defaultModelUrl; //defaultModelUrl set by sidebar

	
	//light
	ap.scene.add(new THREE.AmbientLight(0xaaaaaa));//use basic material
	
	

	Logics.loadingModelFinishedForBoneAttachControler(ap);
	
	//vrm
	Logics.initializeAmmo(ap);
	
	loadingModelFinishedForSecondaryAnimationControler(ap);
	
	
	
	function loadingModelFinishedForSecondaryAnimationControler(ap){
		ap.signals.loadingModelFinished.add(function(mesh){
			
			
			if(!ap.secondaryAnimationControler){
				ap.secondaryAnimationControler=new SecondaryAnimationControler(ap);
			}else{
				ap.secondaryAnimationControler.dispose();
			}
			
			ap.secondaryAnimationControler.logging=false;
			ap.secondaryAnimationControler.initialize(ap.ammoControler,ap.boneAttachControler);
			
			ap.secondaryAnimationControler.parse(ap.vrm);
			
			ap.secondaryAnimationControler.newSecondaryAnimation();
			
			//ap.ammoControler.setVisibleAll(true);
		},undefined,-1);
		
		ap.signals.rendered.add(function(){
			if(ap.secondaryAnimationControler){
				ap.secondaryAnimationControler.update();
				ap.ammoControler.update();
				
			}
		},undefined,-2);//call later boneAttach
	}
	ap.getSignal("loadingModelStarted").add(function(url){
		VrmUtils.logging=false;
		VrmUtils.loadVrm(ap,url);
	});
	
	ap.getSignal("loadingModelFinished").add(function(model){
		
		if(ap.skinnedMesh){
			ap.skinnedMesh.parent.remove(ap.skinnedMesh);
		}
		ap.skinnedMesh=model;
		ap.scene.add(model);
		model.scale.set(100,100,100);
		
		var boneNameList=[];
		ap.skinnedMesh.humanoidSkeleton.bones.forEach(function(bone){
			boneNameList.push(bone.name);
		});
		ap.humanoidBoneNameList=boneNameList;
		
	},undefined,101);//before bone attach
	
	ap.getSignal("loadingModelStarted").dispatch(url);

}
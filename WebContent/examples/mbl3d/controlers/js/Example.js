Example=function(application){
	var ap=application;
	var scope=this;
	ap.objects=[];//TODO
	
	//default camera
	ap.camera.position.set( 0, 100, 250 );
	ap.controls.target.set(0,100,0);
	ap.controls.update();
	
	var url="../../../dataset/mbl3d/models/anime2_female_modifybreast.fbx";
	ap.modelUrl=ap.defaultModelUrl==undefined?url:ap.defaultModelUrl; //defaultModelUrl set by sidebar

	//simple light
	//light
	var light = new THREE.DirectionalLight(0xaaaaaa);
	light.position.set(100, 100, 100);
	ap.scene.add(light);
	var light2 = new THREE.DirectionalLight(0xaaaaaa);
	light2.position.set(-100, -100, -100);
	ap.scene.add(light2);
	
	ap.scene.add(new THREE.AmbientLight(0x666666));
	
	//sidebar.Hair
	application.signals.loadingHairFinished.add(function(hair){
		//initialized when loadingModelFinished
		ap.boneAttachControler.getContainerByBoneEndName("head").add(hair);
	});
	
	
	//sidebar.texture	
	application.signals.materialChanged.add(function(){
		var material=new THREE.MeshPhongMaterial({skinning:true,morphTargets:true,map:ap.texture});
		ap.skinnedMesh.material=material;
	});
	
	//add bone attach
	ap.signals.loadingModelFinished.add(function(mesh){
		if(ap.boneAttachControler!=null){
			ap.boneAttachControler.dispose();
		}
		ap.boneAttachControler=new BoneAttachControler(mesh);
		ap.boneAttachControler.setParentObject(ap.root);
		
		ap.mixer=undefined;
		
	},undefined,100);//call at first
	
	ap.signals.rendered.add(function(){
		if(ap.boneAttachControler){
			ap.boneAttachControler.update(true);
		}
	},undefined,-1);//call later
	
	//Ik
	ap.signals.loadingModelFinished.add(function(mesh){
		
		//Possible Ik initialize on Sidebar for keep value
		if(ap.ikControler==null){
			ap.ikControler=new IkControler(undefined,ap);
			
		}
		
		//if do dispose,remove event & ikTargets
		
		//on
		if(!ap.ikControler.isInitialized()){
			ap.ikControler.initialize(new Mbl3dIk(ap));
			
			//
			ap.ikControler.maxAngle=5;
			ap.ikControler.setBoneRatio("clavicle_L",0.01);
			ap.ikControler.setBoneRatio("upperarm_L",0.1);
			ap.ikControler.setBoneRatio("lowerarm_L",1);
			ap.ikControler.setBoneRatio("hand_L",0.1);
			ap.ikControler.setBoneRatio("clavicle_R",0.01);
			ap.ikControler.setBoneRatio("upperarm_R",0.1);
			ap.ikControler.setBoneRatio("lowerarm_R",1);
			ap.ikControler.setBoneRatio("hand_R",0.1);
			
			ap.signals.transformSelectionChanged.add(function(target){
				ap.ikControler.onTransformSelectionChanged(target);
			});
			
			
			ap.signals.transformFinished.add( function () {
				ap.ikControler.onTransformFinished(scope.target);
			});
			ap.signals.transformChanged.add( function () {
				ap.ikControler.onTransformChanged(scope.target);
			});
		}
		
		
		ap.ikControler.setBoneAttachControler(ap.boneAttachControler);
		//reference boneAttachControler
		ap.ikControler.setEndSiteEnabled("Head",true);
		ap.ikControler.setEndSiteEnabled("LeftArm",true);
		ap.ikControler.setEndSiteEnabled("RightArm",true);
		
		ap.mixer=undefined;
		
	},undefined,50);
	
	scope.target=null;
	ap.signals.transformSelectionChanged.add(function(target){
		scope.target=target;
		if(target==null){
			ap.transformControls.detach();
		}
	},undefined,100);//do first
	
	
	
	ap.signals.loadingModelStarted.dispatch(ap.modelUrl);
}
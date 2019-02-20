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


	
	//sidebar.Hair
	application.signals.loadingHairFinished.add(function(hair){
		//initialized when loadingModelFinished
		ap.boneAttachControler.getContainerByBoneEndName("head").add(hair);
	});
	
	
	//sidebar.texture	
	application.signals.materialChanged.add(function(){
		var material=new THREE.MeshPhongMaterial({skinning:true,morphTargets:true,map:ap.texture,transparent:true,alphaTest:0.6});
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
	

	
	ap.signals.loadingModelFinished.add(function(mesh){
		ap.transformControls.detach();
	});
	//Ik
	ap.signals.loadingModelFinished.add(function(mesh){
		
		//Possible Ik initialize on Sidebar for keep value
		if(ap.ikControler==null){
			ap.ikControler=new IkControler(undefined,ap);
			
		}
		
		//if do dispose,remove event & ikTargets
		
		//on
		if(!ap.ikControler.isInitialized()){
			console.log("ik initialized");
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
	

	
	
	
	var rotationControlerInitialized=false;
	ap.signals.loadingModelFinished.add(function(mesh){
		
		if(!rotationControlerInitialized){
			//move to initialize?
			ap.signals.transformSelectionChanged.add(function(target){
				ap.rotationControler.onTransformSelectionChanged(target);
			});
			
			ap.signals.transformFinished.add( function () {
				ap.rotationControler.onTransformFinished(scope.target);
			});
			ap.signals.transformStarted.add( function () {
				//console.log(ap.objects);
				ap.rotationControler.onTransformStarted(scope.target);
			});
			rotationControlerInitialized=true;
		}
		
		
		
		if(ap.rotationControler!=null){
			ap.rotationControler.dispose();
		}
		
		var rotationControler=new RotationControler(ap,ap.boneAttachControler);
		rotationControler.initialize(function(bone){
			return !Mbl3dUtils.isFingerBoneName(bone.name) && !Mbl3dUtils.isTwistBoneName(bone.name) && !Mbl3dUtils.isRootBoneName(bone.name);
		});
		ap.rotationControler=rotationControler;
		
		
		
	});
	
	var translateControlerInitialized=false;
	
	ap.signals.loadingModelFinished.add(function(mesh){
		if(!translateControlerInitialized){
			
			ap.signals.transformSelectionChanged.add(function(target){
				ap.translateControler.onTransformSelectionChanged(target);
			});
			
			ap.signals.transformStarted.add( function () {
				ap.translateControler.onTransformStarted(scope.target);
			});
			
			ap.signals.transformFinished.add( function () {
				ap.translateControler.onTransformFinished(scope.target);
			});
			ap.signals.transformChanged.add( function () {
				ap.translateControler.onTransformChanged(scope.target);
			});
			
			//mbl3d specific & somehow ik rotate target index changed from 0 to 1;
			ap.signals.boneRotationChanged.add(function(index){
				if(index==0 || index==1){
					ap.signals.boneTranslateChanged.dispatch(index);
				}
			});
			
			translateControlerInitialized=true;
		}
		if(ap.translateControler!=null){
			ap.translateControler.dispose();
		}
		
		var translateControler=new TranslateControler(ap,ap.boneAttachControler);
		translateControler.initialize();
		ap.translateControler=translateControler;
		
	
	});
	
	var objectTransformControlerInitialized=false;
	ap.signals.loadingModelFinished.add(function(mesh){
		
		mesh.userData.transformSelectionType="ObjectTransform";
		
		if(!objectTransformControlerInitialized){
			
			ap.signals.transformSelectionChanged.add(function(target){
				
				ap.objectTransformControler.onTransformSelectionChanged(target);
			});
			
			ap.signals.transformStarted.add( function () {
				ap.objectTransformControler.onTransformStarted(scope.target);
			});
			
			ap.signals.transformFinished.add( function () {
				ap.objectTransformControler.onTransformFinished(scope.target);
			});
			ap.signals.transformChanged.add( function () {
				ap.objectTransformControler.onTransformChanged(scope.target);
			});
			objectTransformControlerInitialized=true;
		}
		
		if(ap.objectTransformControler!=null){
			
			ap.objectTransformControler.dispose();
		}
		
		var objectTransformControler=new ObjectTransformControler(ap);
		ap.objectTransformControler=objectTransformControler;
		
	});
	
	//ammo
	var world=AmmoUtils.initWorld();
	var ammoControler=new AmmoControler(ap.scene,world);
	ap.ammoControler=ammoControler;
	
	ap.signals.loadingModelFinished.add(function(mesh){
		if(ap.breastControler==undefined){
			ap.breastControler=new BreastControler();
		}else{
			ap.breastControler.dispose();
		}
		ap.breastControler.logging=false;
		ap.breastControler.initialize(ammoControler,ap.boneAttachControler);
		ap.breastControler.newBreast();
		
		ammoControler.setVisibleAll(false);
	});
	
	ap.signals.rendered.add(function(){
		if(ap.breastControler){
			ap.ammoControler.update();
			ap.breastControler.update();
		}
	},undefined,-2);//call later boneAttach
	
	
	//TODO move Core?
	scope.target=null;
	ap.signals.transformSelectionChanged.add(function(target){
		scope.target=target;
		if(target==null){
			ap.transformControls.detach();
		}
	},undefined,100);//do first
	
	
	ap.signals.loadingModelStarted.dispatch(ap.modelUrl);
}
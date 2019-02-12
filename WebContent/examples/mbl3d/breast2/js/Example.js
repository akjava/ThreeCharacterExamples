Example=function(application){
	var ap=application;
	
	ap.camera.position.set( 0, 100, 250 );
	ap.controls.target.set(0,100,0);
	ap.controls.update();
	
	AppUtils.decoderPath="../../libs/draco/gltf/";
	//var url="../../../dataset/mbl3d/models/anime2_nomorph_draco.glb";
	
	//var url="../../../dataset/mbl3d/models/anime2_female.fbx";
	var url="../../../dataset/mbl3d/models/anime2_modifybreast.fbx";
	
	
	var textureUrl="../../../dataset/mbl3d/texture/m_brown.png";
	ap.defaultTextureUrl=textureUrl;
	
	
	var material=new THREE.MeshPhongMaterial({color:0x888888,skinning:true,morphTargets:true,map:null,transparent:true,opacity:ap.meshTransparent,alphaTest:0.2});
	
	ap.signals.meshTransparentChanged.add(function(){
		material.opacity=ap.meshTransparent;
		if(ap.meshTransparent==1){
			material.transparent=false;
		}else{
			material.transparent=true;
		}
	});
	
	var convertToZeroRotatedBoneMesh=true;
	AppUtils.loadMesh(url,function(mesh){
		try{
		var isGltf=mesh.isGltf;//set before convert
		
		if(convertToZeroRotatedBoneMesh){
			mesh=BoneUtils.convertToZeroRotatedBoneMesh(mesh);
		}
		
		
		var container=new THREE.Group();
		
		ap.scene.add(container);
		this.container=container;
		
		
		mesh.scale.set(100,100,100);
		
		ap.signals.loadingTextureFinished.add(function(texture){
			if(texture!=null){
				if(!isGltf){
					texture.flipY=true;
				}
			}
			
			material.map=texture;
			material.needsUpdate=true;
		});
		
		ap.signals.loadingTextureStarted.dispatch(textureUrl);
		
		mesh.material=material;
		container.add(mesh);
		ap.skinnedMesh=mesh;
		ap.container=container;
		
		ap.mixer=new THREE.AnimationMixer(mesh);
		ap.clock=new THREE.Clock();
		
		mesh.updateMatrixWorld(true);
		ap.defaultBoneMatrix=BoneUtils.storeDefaultBoneMatrix(BoneUtils.getBoneList(mesh));
		
		ap.signals.skinnedMeshChanged.dispatch(mesh);
		
		
		//attacher
		ap.attachControler=new BoneAttachControler(mesh,{color:0x880000,boxSize:5});
		
		ap.attachControler.setVisible(false);
		ap.attachControler.update();
		this.container.add(ap.attachControler.object3d);
		
		
		
		
		//add ammo
		var world=AmmoUtils.initWorld();
		var ammoControler=new AmmoControler(container,world);
		
		application.ammoControler=ammoControler;
		application.signals.visibleAmmoChanged.add(function(){
			application.ammoControler.setVisibleAll(application.visibleAmmo);
		});
		
		ap.breastControler.initialize(ammoControler,ap.attachControler);
		ap.breastControler.newBreast();
		
		
	
		 
		 ap.signals.newBreast.add(function(){
			 ap.breastControler.newBreast();
		 });
		 
		
		 //ap.signals.newBreast.dispatch();
		
		
	
		ap.signals.springChanged.add(function(){
			var bc=ap.breastControler;
			bc.setSpringValues(bc.stiffness,bc.damping,bc.bodyDamping);
		});
		
		
		//AmmoUtils.setLinearVelocity(breastBox.getBody(),new THREE.Vector3(5,5,5));
		
		
			var boneList=BoneUtils.getBoneList(ap.skinnedMesh);
			//TODO make method on mbl3dlibs?
			var index=BoneUtils.findBoneIndexByEndsName(ap.attachControler.getBoneList(),"head");
			var name=boneList[index].name;
			var hairContainer=ap.attachControler.getContainerByBoneName(name);
			function loadHair(){
				console.log("loadhair")
				var hairUrl="../../../dataset/mbl3d/hairs/geometry-twelve-short.json";
				var loader = new THREE.JSONLoader();
				loader.load(
						hairUrl,

						// onLoad callback
						function ( geometry, materials ) {
							geometry.center();
							var m=new THREE.MeshPhongMaterial({color:0x694b17})
							ap.hairMesh = new THREE.Mesh( geometry,m);
							ap.hairMesh.scale.set(100,100,100);
							ap.hairMesh.position.set(0,10,0);//no way to modify so far
							hairContainer.add( ap.hairMesh );
							
							ap.hairMesh.updateMatrixWorld(true);
						}
						
						);
			}
			loadHair();
		}catch(e){
			console.log(e);
		}
		
		
	});
	
	var wpos=new THREE.Vector3();
	ap.signals.rendered.add(function(){
		if(ap.mixer){
			
			
			var delta = ap.clock.getDelta();
			ap.mixer.update(delta);
			ap.skinnedMesh.updateMatrixWorld(true);
			ap.attachControler.update();
			ap.ammoControler.update();
			ap.breastControler.update();
			
		}
	})
}
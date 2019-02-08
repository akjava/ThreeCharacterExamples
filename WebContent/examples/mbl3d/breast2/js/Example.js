Example=function(application){
	var ap=application;
	
	ap.camera.position.set( 0, 100, 250 );
	ap.controls.target.set(0,100,0);
	ap.controls.update();
	
	AppUtils.decoderPath="../../libs/draco/gltf/";
	//var url="../../../dataset/mbl3d/models/anime2_nomorph_draco.glb";
	var url="../../../dataset/mbl3d/models/anime2_female.fbx";
	
	var textureUrl="../../../dataset/mbl3d/texture/m_brown.png";
	//var textureUrl="../models/m_brown.png";
	
	var texture=Mbl3dUtils.loadTexture(textureUrl);
	var material=new THREE.MeshPhongMaterial({color:0x888888,skinning:true,morphTargets:true,map:texture,transparent:true,opacity:ap.meshTransparent,alphaTest:0.2});
	
	ap.signals.meshTransparentChanged.add(function(){
		material.opacity=ap.meshTransparent;
		if(ap.meshTransparent==1){
			material.transparent=false;
		}else{
			material.transparent=true;
		}
	});

	var ammoContainer=null;
	var sprine03Box;
	var breastR,breastL;
	var convertToZeroRotatedBoneMesh=true;
	AppUtils.loadMesh(url,function(mesh){
		console.log("loadGltfMesh:",url);
		var isGltf=mesh.isGltf;//set before convert
		if(convertToZeroRotatedBoneMesh){
			mesh=BoneUtils.convertToZeroRotatedBoneMesh(mesh);
		}
		
		
		var container=new THREE.Group();
		
		ap.scene.add(container);
		this.container=container;
		
		if(isGltf){
			mesh.scale.set(100,100,100);
		}else{
			texture.flipY=true;
		}
		
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
		
		//attach
		var boneList=BoneUtils.getBoneList(mesh);
		var sprine03=BoneUtils.findBoneIndexByEndsName(boneList,"spine03");
		breastR=BoneUtils.findBoneIndexByEndsName(boneList,"breast_R");
		breastL=BoneUtils.findBoneIndexByEndsName(boneList,"breast_L");
		
		
		
		
		ammoContainer=ap.attachControler.getContainerByBoneIndex(sprine03);
		
		
		//add ammo
		var world=AmmoUtils.initWorld();
		var ammoControler=new AmmoControler(container,world);
		
		application.ammoControler=ammoControler;
		application.signals.visibleAmmoChanged.add(function(){
			application.ammoControler.setVisibleAll(application.visibleAmmo);
		});
		
		 var p=ammoContainer.position;
		 //sprine03Box=ap.ammoControler.createBox(new THREE.Vector3(1, 1, 1), 0, 0,0,0, 
		 sprine03Box=ap.ammoControler.createBox(new THREE.Vector3(80, 80, 5), 0, 0,0,0, 
					new THREE.MeshPhongMaterial({color:0x008800})
							);
		
					
		 ap.sprineBox=sprine03Box;
		 ammoContainer.add(sprine03Box.getMesh());
		 sprine03Box.syncWorldMatrix=true;
		 sprine03Box.syncBodyToMesh=false;
		 sprine03Box.getMesh().updateMatrixWorld(true);
		 sprine03Box.syncTransform(ammoControler);
		 
		 var breastRContainer=ap.attachControler.getContainerByBoneIndex(breastR);
		 var breastLContainer=ap.attachControler.getContainerByBoneIndex(breastL);
		
		 function createBreastBox(breastContainer,targetBone,opposite){
			 opposite==undefined?false:opposite;
			 var op=1;
			 if(opposite){
				 op=-1;
			 }
			 var diff=new THREE.Vector3(ap.breastPosX*op,ap.breastPosY,ap.breastPosZ);
			 
			 ap.maxDistance=diff.length()*2;
			 
			 
			 
			 var bdiff=breastContainer.position.clone().sub(ammoContainer.position);
			 var breastBase=ap.ammoControler.createBox(new THREE.Vector3(1, 1, 1), 0, bdiff.x,bdiff.y,bdiff.z, 
						new THREE.MeshPhongMaterial({color:0x000088})
				);
			 ammoContainer.add(breastBase.getMesh());
			 breastBase.syncWorldMatrix=true;
			 breastBase.syncBodyToMesh=false;
			 breastBase.getMesh().updateMatrixWorld(true);
			 breastBase.syncTransform(ammoControler);
			 
			 var p=new THREE.Vector3().setFromMatrixPosition(breastBase.getMesh().matrixWorld);
			 var breastBox=ap.ammoControler.createSphere(ap.breastSize, .1,p.x+ diff.x,p.y+diff.y,p.z+diff.z, 
									new THREE.MeshPhongMaterial({color:0x000088})
						 );
			 
			 //breastBox.getBody().setRestitution(0);
			 //breastBox.getBody().setFriction(0);
			 
			 /*var breastBox=ap.ammoControler.createSphere(5, .1,diff.x,diff.y,diff.z, 
						new THREE.MeshPhongMaterial({color:0x000088})
			 );*/
			 
			 
			 var resetBox=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial({color:0x00ff00}));
			 resetBox.material.visible=false;
			 resetBox.position.copy(diff);
			 breastBase.getMesh().add(resetBox);
			 
			 AmmoUtils.setLinearFactor(breastBox.getBody(),1,1,1);
			 //AmmoUtils.setLinearFactor(breastBox.getBody(),0,0,0);
			 var factorX=ap.lockX==true?0:1;
			 var factorY=ap.lockY==true?0:1;
			 var factorZ=ap.lockZ==true?0:1;
			 AmmoUtils.setAngularFactor(breastBox.getBody(),factorX,factorY,factorZ);//no z
			 
			 
			 breastBox.getBody().setDamping(application.bodyDamping,application.bodyDamping);
			 breastBox.getBody().setActivationState(AmmoUtils.DISABLE_DEACTIVATION);
			 breastBox.syncBone=true;
			 breastBox.targetBone=targetBone;
			 
			 //breastBase.getMesh().add(breastBox.getMesh());
			 breastBox.syncWorldMatrix=false;
			 breastBox.parentBodyAndMesh=breastBase;
			 //connect
		 	var frameInA=application.ammoControler.makeTemporaryTransform();
			var frameInB=application.ammoControler.makeTemporaryTransform();
			AmmoUtils.copyFromVector3(frameInA.getOrigin(),diff.clone().negate());
			var constraint=application.ammoControler.createGeneric6DofSpringConstraint(
					breastBox,breastBase, frameInA,frameInB,false,true);
			
			var dof=constraint.constraint;
			
			AmmoUtils.seteAllEnableSpring(dof,true);
			AmmoUtils.seteAllStiffness(dof,application.stiffness);
			AmmoUtils.seteAllDamping(dof,application.damping);
			
			var limit=0;
			dof.setLinearLowerLimit(application.ammoControler.makeTemporaryVector3(-limit, -limit,-limit));
			dof.setLinearUpperLimit(application.ammoControler.makeTemporaryVector3(limit, limit, limit));
		
			//dont need z-rotation
			
			
			var angleX=THREE.Math.degToRad(ap.allowAngleX);
			var angleY=THREE.Math.degToRad(ap.allowAngleY);
			var angleZ=THREE.Math.degToRad(ap.allowAngleZ);
			
			dof.setAngularLowerLimit(application.ammoControler.makeTemporaryVector3(-angleX, -angleY,-angleZ));
			dof.setAngularUpperLimit(application.ammoControler.makeTemporaryVector3(angleX, angleY, angleZ));
			
			breastBox.getMesh().userData.constraint=constraint;
			breastBox.getMesh().userData.dof=dof;
			breastBox.getMesh().userData.breastBase=breastBase;
			breastBox.getMesh().userData.resetBox=resetBox;
			
			 return breastBox;
		 }
		 
		 ap.signals.newBreast.add(function(){
			 function destory(box){
				 
				 
				 box.getMesh().userData.resetBox.parent.remove(box.getMesh().userData.resetBox);
				 ap.ammoControler.destroyBodyAndMesh(box.getMesh().userData.breastBase);
				 ap.ammoControler.destroyConstraintAndLine(box.getMesh().userData.constraint);
				 ap.ammoControler.destroyBodyAndMesh(box);
				 
			 }
			 //deletes
			 if(ap.breastBox!=null){
				 destory(ap.breastBox);
				 destory(ap.breastBoxL);
			 }
			 
			 ap.breastBox=createBreastBox(breastRContainer,boneList[breastR],true);
			 ap.breastBoxL=createBreastBox(breastLContainer,boneList[breastL]);
			 
			 ap.signals.visibleAmmoChanged.dispatch();
		 });
		 
		
		 ap.signals.newBreast.dispatch();
		
		
	
		ap.signals.springChanged.add(function(){
			function change(box){
				var dof=box.getMesh().userData.dof;
				AmmoUtils.seteAllStiffness(dof,application.stiffness);
				AmmoUtils.seteAllDamping(dof,application.damping);
				box.getBody().setDamping(application.bodyDamping,application.bodyDamping);
			}
			change(ap.breastBox);
			change(ap.breastBoxL);
		});
		
		
		//AmmoUtils.setLinearVelocity(breastBox.getBody(),new THREE.Vector3(5,5,5));
		
		try{
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
			ap.ammoControler.update();
			var delta = ap.clock.getDelta();
			ap.mixer.update(delta);
			ap.attachControler.update();
			
			//auto reset,when penetrate 
			if(ap.autoResetPosition){
				function doReset(box){
					var pos=box.getMesh().userData.resetBox.getWorldPosition(wpos);
					var distance2=pos.distanceTo(box.getMesh().position);
					if(distance2>ap.maxDistance){
						console.log("force reseted");
						AmmoUtils.setPosition(box.getBody(),pos.x,pos.y,pos.z);
					}
				}
				doReset(ap.breastBox);
				doReset(ap.breastBoxL);
			}
			
		}
	})
}
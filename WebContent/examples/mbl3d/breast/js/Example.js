Example=function(application){
	var ap=application;
	
	ap.camera.position.set( 0, 100, 250 );
	ap.controls.target.set(0,100,0);
	ap.controls.update();
	
	AppUtils.decoderPath="../../libs/draco/gltf/";
	var url="../../../dataset/mbl3d/models/anime2_nomorph_draco.glb";
	
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
	AppUtils.loadGltfMesh(url,function(mesh){
		if(convertToZeroRotatedBoneMesh){
			mesh=BoneUtils.convertToZeroRotatedBoneMesh(mesh);
		}
		
		
		var container=new THREE.Group();
		
		ap.scene.add(container);
		this.container=container;
		
		console.log("loadGltfMesh:",url);
		mesh.scale.set(100,100,100);
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
		
		//ap.attachControler.setVisible(true);
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
		 sprine03Box=ap.ammoControler.createBox(new THREE.Vector3(80, 80, 5), 0, p.x,p.y,p.z, 
					new THREE.MeshPhongMaterial({color:0x008800})
							);
		 ap.sprineBox=sprine03Box;
		 
		 //sprine03Box.getMesh().matrixAutoUpdate=false;
		/* AmmoUtils.setAngularFactor(sprine03Box.getBody(),1,1,1);
		 AmmoUtils.setLinearFactor(sprine03Box.getBody(),1,1,1);
		 sprine03Box.getBody().setActivationState(AmmoUtils.DISABLE_DEACTIVATION);*/
		 
		 //breastR
		 var breastRContainer=ap.attachControler.getContainerByBoneIndex(breastR);

		 var diff=breastRContainer.position.clone().sub(ammoContainer.position);
		 
		 var diff=new THREE.Vector3(0,5,10);
		 
		 
		 var breastBox=ap.ammoControler.createSphere(6, .1,p.x+ diff.x,p.y+diff.y,p.z+diff.z, 
		// var breastBox=ap.ammoControler.createBox(new THREE.Vector3(8, 8, 8), .1,p.x+ diff.x,p.y+diff.y,p.z+diff.z, 
					new THREE.MeshPhongMaterial({color:0x000088})
		 );
		 ap.breastBox=breastBox;
		 AmmoUtils.setLinearFactor(breastBox.getBody(),1,1,1);
		 //AmmoUtils.setLinearFactor(breastBox.getBody(),0,0,0);
		 AmmoUtils.setAngularFactor(breastBox.getBody(),1,1,0);
		 breastBox.getBody().setDamping(application.bodyDamping,application.bodyDamping);
		 breastBox.getBody().setActivationState(AmmoUtils.DISABLE_DEACTIVATION);

		 
		 //connect
		var frameInA=application.ammoControler.makeTemporaryTransform();
		var frameInB=application.ammoControler.makeTemporaryTransform();
		AmmoUtils.copyFromVector3(frameInA.getOrigin(),diff.negate());
		var constraint=application.ammoControler.createGeneric6DofSpringConstraint(
				breastBox,sprine03Box, frameInA,frameInB,false,true);
		
		var dof=constraint.constraint;
		
		
		AmmoUtils.seteAllEnableSpring(dof,true);
		//AmmoUtils.setAngularEnableSpring(dof,true);
		AmmoUtils.seteAllStiffness(dof,application.stiffness);
		AmmoUtils.seteAllDamping(dof,application.damping);
		
		var limit=0;
		dof.setLinearLowerLimit(application.ammoControler.makeTemporaryVector3(-limit, -limit,-limit));
		dof.setLinearUpperLimit(application.ammoControler.makeTemporaryVector3(limit, limit, limit));
	
		//dont need z-rotation
		var rlimit=1.58/1;
		dof.setAngularLowerLimit(application.ammoControler.makeTemporaryVector3(-rlimit, -rlimit,-rlimit));
		dof.setAngularUpperLimit(application.ammoControler.makeTemporaryVector3(rlimit, rlimit, rlimit));
	
		ap.signals.springChanged.add(function(){
			AmmoUtils.seteAllStiffness(dof,application.stiffness);
			AmmoUtils.seteAllDamping(dof,application.damping);
			breastBox.getBody().setDamping(application.bodyDamping,application.bodyDamping);
		});
		
		
		//AmmoUtils.setLinearVelocity(breastBox.getBody(),new THREE.Vector3(5,5,5));

		
	});
	
	ap.signals.rendered.add(function(){
		
		
		if(ap.mixer){
			
			
			ap.ammoControler.update();
			
			var delta = ap.clock.getDelta();
			ap.mixer.update(delta);
			ap.attachControler.update();
			
			//sync parent
			//sprine03Box.getMesh().quaternion.copy(sprine03Box.getMesh().parent.quaternion);
			
			//sync-rotate
			var q=ammoContainer.quaternion;
			var p=ammoContainer.position;
			AmmoUtils.setPosition(sprine03Box.getBody(),p.x,p.y,p.z);
			AmmoUtils.setRotationFromXYZW(sprine03Box.getBody(),q.x,q.y,q.z,q.w);
			
			//clear static force
			var clearForce=false;
			if(clearForce){
				AmmoUtils.setLinearVelocity(sprine03Box.getBody(),new THREE.Vector3(0,0,0));
				AmmoUtils.setAngularVelocity(sprine03Box.getBody(),new THREE.Vector3(0,0,0));
			}
			//AmmoUtils.(sprine03Box.getBody(),0,0,0);
			
			
			//brest-bone update
			var name=ap.skinnedMesh.skeleton.bones[breastR].name;
			var euler=ap.defaultBoneMatrix[name].rotation;
			var rotate=ap.breastBox.getMesh().rotation;
			//console.log(euler);
			//forget-Z or TODO reduce Z
			ap.skinnedMesh.skeleton.bones[breastR].quaternion.copy(BoneUtils.makeQuaternionFromXYZRadian(rotate.x,rotate.y,rotate.z,euler));
			//console.log("hello");
			//ap.skinnedMesh.skeleton.bones[breastR].quaternion.copy(BoneUtils.makeQuaternionFromXYZRadian(rotate.x,rotate.y,0,euler));
			
			if(ap.bothBreast){
				var name=ap.skinnedMesh.skeleton.bones[breastL].name;
				var euler=ap.defaultBoneMatrix[name].rotation;
				var rotate=ap.breastBox.getMesh().rotation;
				ap.skinnedMesh.skeleton.bones[breastL].quaternion.copy(BoneUtils.makeQuaternionFromXYZRadian(rotate.x,-rotate.y,rotate.z,euler));
			}
			
			AmmoUtils.forceDampingRotation(ap.breastBox.getBody(),1,1,0.5);
			//safety-distance limit
			
			var limitDistance=true;
			if(limitDistance){
			var distance=application.sprineBox.getMesh().position.distanceTo(application.breastBox.getMesh().position);
			//if(distance>12){//TODO auto set
			if(distance>15){//TODO auto set
				//force keep distance
				var divided=distance/15;
				var diff=application.breastBox.getMesh().position.clone().sub(application.sprineBox.getMesh().position);
				diff.divideScalar(divided).add(application.sprineBox.getMesh().position);
				AmmoUtils.setPosition(application.breastBox.getBody(),diff.x,diff.y,diff.z);
			}
			}
		}
	})
}
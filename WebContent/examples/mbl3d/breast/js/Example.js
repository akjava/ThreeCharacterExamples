Example=function(application){
	var ap=application;
	
	//default camera
	ap.camera.position.set( 0, 100, 250 );
	ap.controls.target.set(0,100,0);
	ap.controls.update();
	
	var url="../../../dataset/mbl3d/models/anime2_female_modifybreast.fbx";
	ap.modelUrl=ap.defaultModelUrl==undefined?url:ap.defaultModelUrl; //defaultModelUrl set by sidebar

	ap.clock=new THREE.Clock();
	

	
	var ammoContainer=null;
	var sprine03Box=null;
	var breastBox=null;
	
	
	function dispose(){
		 function destroy(box){
			 
			 
			if(box.getMesh().userData.constraint)
				ap.ammoControler.destroyConstraintAndLine(box.getMesh().userData.constraint);
			 ap.ammoControler.destroyBodyAndMesh(box);
			 
			 
		 }
		 
		 if(breastBox!=null){
			 destroy(breastBox);
			 destroy(sprine03Box);
			 breastBox=null;
			 sprine03Box=null;
		 }
	}
	
	ap.signals.loadingModelFinished.add(function(mesh){
		if(ap.mixer!=undefined){
			ap.mixer.stopAllAction();
		}
		
		dispose();
		
		ap.mixer=new THREE.AnimationMixer(mesh);
		
		var boneList=BoneUtils.getBoneList(mesh);
		var sprine03=BoneUtils.findBoneIndexByEndsName(boneList,"spine03");
		

		breastR=BoneUtils.findBoneIndexByEndsName(boneList,"breast_R");
		breastL=BoneUtils.findBoneIndexByEndsName(boneList,"breast_L");
		
		ammoContainer=ap.boneAttachControler.getContainerByBoneIndex(sprine03);
		
		 var p=ammoContainer.position;
		 sprine03Box=ap.ammoControler.createBox(new THREE.Vector3(80, 80, 5), 0, p.x,p.y,p.z, 
					new THREE.MeshPhongMaterial({color:0x008800})
							);
		 ap.sprineBox=sprine03Box;
		 
		 var diff=new THREE.Vector3(0,5,20);
		 
		 var resetBox=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial({color:0x00ff00}));
		 resetBox.position.copy(diff);
		 ammoContainer.add(resetBox);
		 ap.resetBox=resetBox;
		
		 breastBox=ap.ammoControler.createSphere(6, .1,p.x+ diff.x,p.y+diff.y,p.z+diff.z, 
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
		
		breastBox.getMesh().userData.constraint=constraint;
		
		var dof=constraint.constraint;
		
		
		AmmoUtils.seteAllEnableSpring(dof,true);
		//AmmoUtils.setAngularEnableSpring(dof,true);
		AmmoUtils.seteAllStiffness(dof,application.stiffness);
		AmmoUtils.seteAllDamping(dof,application.damping);
		
		var limit=0;
		dof.setLinearLowerLimit(application.ammoControler.makeTemporaryVector3(-limit, -limit,-limit));
		dof.setLinearUpperLimit(application.ammoControler.makeTemporaryVector3(limit, limit, limit));
	
		//dont need z-rotation
		var rlimit=Math.PI;
		dof.setAngularLowerLimit(application.ammoControler.makeTemporaryVector3(-rlimit, -rlimit,-rlimit));
		dof.setAngularUpperLimit(application.ammoControler.makeTemporaryVector3(rlimit, rlimit, rlimit));
	
		ap.getSignal("springChanged").add(function(){
			AmmoUtils.seteAllStiffness(dof,application.stiffness);
			AmmoUtils.seteAllDamping(dof,application.damping);
			breastBox.getBody().setDamping(application.bodyDamping,application.bodyDamping);
		});
	},-1);
	
	var euler=new THREE.Euler();
	var pq=new THREE.Quaternion();
	ap.signals.rendered.add(function(){
		
		
		if(ap.mixer){
			
			
			ap.ammoControler.update();
			
			var delta = ap.clock.getDelta();
			ap.mixer.update(delta);
			
			//sync parent
			//sprine03Box.getMesh().quaternion.copy(sprine03Box.getMesh().parent.quaternion);
			
			//sync-rotate
			var q=ammoContainer.quaternion;
			var tmp=new THREE.Euler().setFromQuaternion(q);
			
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
			
			var rotate=ap.breastBox.getMesh().rotation;
			var order=ap.breastBox.getMesh().rotation.order;
			//console.log(euler);
			//forget-Z or TODO reduce Z
			//i'm not sure why use euler
			pq.setFromRotationMatrix(ammoContainer.matrixWorld).inverse();
			
			var tmp=new THREE.Euler().setFromQuaternion(pq);
			
			
			var q=BoneUtils.makeQuaternionFromXYZRadian(rotate.x,rotate.y,rotate.z,euler,order);
			q.multiply(pq)
			ap.skinnedMesh.skeleton.bones[breastR].quaternion.copy(q);
			//console.log("hello");
			//ap.skinnedMesh.skeleton.bones[breastR].quaternion.copy(BoneUtils.makeQuaternionFromXYZRadian(rotate.x,rotate.y,0,euler));
			
			if(ap.bothBreast){
				var opposite=ap.moveSameDirection?1:-1;//if opposite -1
				var name=ap.skinnedMesh.skeleton.bones[breastL].name;
				
				var rotate=ap.breastBox.getMesh().rotation;
				ap.skinnedMesh.skeleton.bones[breastL].quaternion.copy(BoneUtils.makeQuaternionFromXYZRadian(rotate.x,rotate.y*opposite,rotate.z,euler));
			}
			
			//broken when rotated
			//AmmoUtils.forceDampingRotation(ap.breastBox.getBody(),1,1,0.5);
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
			
			//auto reset,when penetrate 
			var forceReset=true;
			if(forceReset){
				var pos=application.resetBox.getWorldPosition(new THREE.Vector3());
				var distance2=pos.distanceTo(application.breastBox.getMesh().position);
				if(distance2>18){
					console.log("force reseted");
					AmmoUtils.setPosition(ap.breastBox.getBody(),pos.x,pos.y,pos.z);
				}
			}
			
		}
	})
	
	ap.signals.loadingModelStarted.dispatch(ap.modelUrl);
}
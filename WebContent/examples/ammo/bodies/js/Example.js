Example=function(application){
	
	//camera.getPosition().setY(5);
	
	var groundMass=0.0;
	
	var ground=application.ammoControler.createBox(new THREE.Vector3(80, 2, 160), groundMass, 0, 0, 0, 
			new THREE.MeshPhongMaterial({color:0x888888})
			);
	
	
	application.signals.ammoSettingUpdated.add(function(){
		if(application.ball!==undefined){
			application.ball.getBody().setRestitution(application.ballRestitution);
			application.ball.getBody().setFriction(application.ballFriction);
			application.ball.getBody().setDamping(application.linearDamping,application.angularDamping);
		}
		
		ground.getBody().setRestitution(application.groundRestitution);
		ground.getBody().setFriction(application.groundFriction);
	});
	
	
	Example.newBall(application);
	

	
}

Example.newBall=function(application){
	if(application.ball!=null){
		application.ammoControler.destroyBodyAndMesh(application.ball);
	}
	
	switch(application.ballType){
	case 'Box':
		application.ball=Example.createBox(application);
		break;
	case 'Sphere': 
		application.ball=Example.createSphere(application);
		break;
	case 'Cylinder': 
		application.ball=Example.createCylinder(application);
		break;
	case 'Capsule': 
		application.ball=Example.createCapsule(application);
		break;
	case 'Cone': 
		application.ball=Example.createCone(application);
		break;
	}
	
	
	//ball.getBody().setAngularVelocity(THREE.Vector3());//this working
	//ball.getBody().setLinearVelocity(THREE.Vector3(xForce, 0, zForce));
	
	//AmmoUtils.setAngularVelocity()
	AmmoUtils.setLinearVelocity(application.ball.getBody(),new THREE.Vector3(0,0,application.zForce));
	application.signals.ammoSettingUpdated.dispatch();
}

Example.createBox=function(application){
	 var bm=application.ammoControler.createBox(new THREE.Vector3(2, 2, 2), 1, 0,application.ballStartY, -79, 
				new THREE.MeshPhongMaterial({color:0x880000})
						);
	 
	    bm.getBody().setActivationState(AmmoUtils.DISABLE_DEACTIVATION);
		var all=new Ammo.btVector3(1, 1, 1);
		bm.getBody().setLinearFactor(all);
		bm.getBody().setAngularFactor(all);
		AmmoUtils.destroy(all);
		
		
	return bm;
}

Example.createSphere=function(application){
	 var bm=application.ammoControler.createSphere(1, 1, 0, application.ballStartY, -79, 
			 new THREE.MeshPhongMaterial({color:0x880000})
						);
	 
	 bm.getBody().setActivationState(AmmoUtils.DISABLE_DEACTIVATION);
		var all=new Ammo.btVector3(1, 1, 1);
		bm.getBody().setLinearFactor(all);
		bm.getBody().setAngularFactor(all);
		AmmoUtils.destroy(all);
		
	return bm;
}



Example.createCylinder=function(application){
	 var bm=application.ammoControler.createCylinder(1,2, 1, 0, application.ballStartY, -79, 
			 new THREE.MeshPhongMaterial({color:0x880000})
						);
	 
	 bm.getBody().setActivationState(AmmoUtils.DISABLE_DEACTIVATION);
		var all=new Ammo.btVector3(1, 1, 1);
		bm.getBody().setLinearFactor(all);
		bm.getBody().setAngularFactor(all);
		AmmoUtils.destroy(all);
		
		
	return bm;
}
Example.createCapsule=function(application){
	
	 var bm=application.ammoControler.createCapsule(1,3, 1, 0, application.ballStartY, -79, 
			 new THREE.MeshPhongMaterial({color:0x880000})
						);
	 
	 bm.getBody().setActivationState(AmmoUtils.DISABLE_DEACTIVATION);
		var all=new Ammo.btVector3(1, 1, 1);
		bm.getBody().setLinearFactor(all);
		bm.getBody().setAngularFactor(all);
		AmmoUtils.destroy(all);
		
		
	return bm;
}
Example.createCone=function(application){
	
	 var bm=application.ammoControler.createCone(1,2, 1, 0, application.ballStartY, -79, 
			 new THREE.MeshPhongMaterial({color:0x880000})
						);
	 
	 bm.getBody().setActivationState(AmmoUtils.DISABLE_DEACTIVATION);
		var all=new Ammo.btVector3(1, 1, 1);
		bm.getBody().setLinearFactor(all);
		bm.getBody().setAngularFactor(all);
		AmmoUtils.destroy(all);
		
		
	return bm;
}
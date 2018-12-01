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
		}
		
		ground.getBody().setRestitution(application.groundRestitution);
		ground.getBody().setFriction(application.groundFriction);
		
		//TODO more
	});
	
	
	Example.newBall(application);
	

	
}

Example.newBall=function(application){
	if(application.ball!=null){
		application.ammoControler.destroyBodyAndMesh(application.ball);
	}
	
	//TODO switch
	application.ball=Example.createBox(application);
	
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
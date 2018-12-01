Example=function(application){
	var groundMass=0.0;
	
	var ground=application.ammoControler.createBox(new THREE.Vector3(8, 2, 8), groundMass, 0, 0, 0, 
			new THREE.MeshPhongMaterial({color:0x888888})
			);
	ground.getBody().setRestitution(application.groundRestitution);
	
	Example.newBall(application);
	
	ground.getBody().setFriction(100);
	application.ball.getBody().setFriction(100);
	

	application.signals.ammoSettingUpdated.add(function(){
		ground.getBody().setRestitution(application.groundRestitution);
		application.ball.getBody().setRestitution(application.ballRestitution);
	});
	
}

Example.newBall=function(application){
	if(application.ball!=null){
		application.ammoControler.destroyBodyAndMesh(application.ball);
	}
	
	
	application.ball=application.ammoControler.createSphere(1, 1, 0, application.ballStartY, 0, 
			new THREE.MeshPhongMaterial({color:0x880000})
					);
	//application.sphere.getBody().setActivationState(Ammo.DISABLE_DEACTIVATION);
	
	application.ball.getBody().setRestitution(application.ballRestitution);
	
}
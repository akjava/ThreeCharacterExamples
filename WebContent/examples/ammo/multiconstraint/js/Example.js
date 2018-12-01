Example=function(application){
	Example.radius=20;
	 var ground=application.ammoControler.createSphere(Example.radius, 0, 0, 0, 0, 
			 new THREE.MeshPhongMaterial({color:0x666666})
						);
	
	application.signals.ammoSettingUpdated.add(function(){
		if(application.ball!==undefined){
			application.ball.getBody().setDamping(application.linearDamping,application.angularDamping);
			application.ball2.getBody().setDamping(application.linearDamping,application.angularDamping);
			application.ball3.getBody().setDamping(application.linearDamping,application.angularDamping);
			application.ball4.getBody().setDamping(application.linearDamping,application.angularDamping);
			application.ball5.getBody().setDamping(application.linearDamping,application.angularDamping);
			
			application.ball.getBody().setRestitution(application.ballRestitution);
			application.ball.getBody().setFriction(application.ballFriction);
			application.ball2.getBody().setRestitution(application.ballRestitution);
			application.ball2.getBody().setFriction(application.ballFriction);
			application.ball3.getBody().setRestitution(application.ballRestitution);
			application.ball3.getBody().setFriction(application.ballFriction);
			application.ball4.getBody().setRestitution(application.ballRestitution);
			application.ball4.getBody().setFriction(application.ballFriction);
			application.ball5.getBody().setRestitution(application.ballRestitution);
			application.ball5.getBody().setFriction(application.ballFriction);
		}
		
		ground.getBody().setRestitution(application.groundRestitution);
		ground.getBody().setFriction(application.groundFriction);
		
	});
	
	
	Example.newBall(application);
	
}

Example.createConstraint=function(body1,body2){
	var frameIn1=application.ammoControler.makeTemporaryTransform();
	var frameIn2=application.ammoControler.makeTemporaryTransform();
	
	var pos1=body1.getMesh().position;
	var pos2=body2.getMesh().position.clone();
	var diff=pos2.sub(pos1);
	
	AmmoUtils.copyFromVector3(frameIn1.getOrigin(),diff);
	var constraint=application.ammoControler.createGeneric6DofConstraint(
			body1,body2, frameIn1,frameIn2,application.disableCollisionsBetweenLinkedBodies,application.frameInA);
	
	var dof=constraint.constraint;
	var limit=application.linearLimitValue;
	dof.setLinearLowerLimit(application.ammoControler.makeTemporaryVector3(-limit, -limit,-limit));
	dof.setLinearUpperLimit(application.ammoControler.makeTemporaryVector3(limit, limit, limit));
	
	constraint.getLine().material.color.set(0x333333);
	
	return constraint;
}
Example.newBall=function(application){
	if(application.ball!=null){
		application.ammoControler.destroyBodyAndMesh(application.ball);
		application.ammoControler.destroyBodyAndMesh(application.ball2);
		application.ammoControler.destroyBodyAndMesh(application.ball3);
		application.ammoControler.destroyBodyAndMesh(application.ball4);
		application.ammoControler.destroyBodyAndMesh(application.ball5);
	}
	
	//initial position is very important,if not disable each other,moved and hit.
	application.ball5=Example.createBox(application,0,0,Example.radius,0);
	application.ball4=Example.createBox(application,1,application.lineLength,Example.radius,0);
	application.ball3=Example.createBox(application,1,application.lineLength*2,Example.radius,0);
	application.ball2=Example.createBox(application,1,application.lineLength*3,Example.radius,0);
	application.ball=Example.createBox(application,1,application.lineLength*4,Example.radius,0);
	
	
	
	if(application.constraint!=null){
		application.ammoControler.destroyConstraintAndLine(application.constraint);
		application.ammoControler.destroyConstraintAndLine(application.constraint2);
		application.ammoControler.destroyConstraintAndLine(application.constraint3);
		application.ammoControler.destroyConstraintAndLine(application.constraint4);
	}
	
	application.constraint=Example.createConstraint(application.ball,application.ball2);
	application.constraint2=Example.createConstraint(application.ball2,application.ball3);
	application.constraint3=Example.createConstraint(application.ball3,application.ball4);
	application.constraint4=Example.createConstraint(application.ball4,application.ball5);
	
	
	AmmoUtils.setLinearVelocity(application.ball.getBody(),new THREE.Vector3(application.xForce,application.yForce,application.zForce));
	application.signals.ammoSettingUpdated.dispatch();
	
}

Example.createSphere=function(application,posX){
	 var bm=application.ammoControler.createSphere(1, 1, posX, 0, 0, 
			 new THREE.MeshPhongMaterial({color:0x880000})
						);
	 
	 bm.getBody().setActivationState(AmmoUtils.DISABLE_DEACTIVATION);
		var all=new Ammo.btVector3(1, 1, 1);
		bm.getBody().setLinearFactor(all);
		bm.getBody().setAngularFactor(all);
		AmmoUtils.destroy(all);
		
	return bm;
}


Example.createBox=function(application,mass,x,y,z){
	mass=mass!==undefined?mass:1;
	x=x!==undefined?x:0;
	y=y!==undefined?y:0;
	z=z!==undefined?z:0;
	 var bm=application.ammoControler.createBox(new THREE.Vector3(2, 2, 2), mass, x,y,z, 
				new THREE.MeshPhongMaterial({color:0x880000})
						);
	 
	    bm.getBody().setActivationState(AmmoUtils.DISABLE_DEACTIVATION);
		var all=new Ammo.btVector3(1, 1, 1);
		bm.getBody().setLinearFactor(all);
		bm.getBody().setAngularFactor(all);
		AmmoUtils.destroy(all);
		
		
	return bm;
}
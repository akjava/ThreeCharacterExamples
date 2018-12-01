Example=function(application){
	
	application.signals.ammoSettingUpdated.add(function(){
		if(application.ball!==undefined){
			application.ball.getBody().setDamping(application.linearDamping,application.angularDamping);
			application.ball2.getBody().setDamping(application.linearDamping,application.angularDamping);
		}
	});
	
	
	Example.newBall(application);
	
}

Example.newBall=function(application){
	if(application.ball!=null){
		application.ammoControler.destroyBodyAndMesh(application.ball);
		application.ammoControler.destroyBodyAndMesh(application.ball2);
	}
	
	//initial position is very important,if not disable each other,moved and hit.
	application.ball=Example.createBox(application,1,-application.lineLength);
	application.ball2=Example.createBox(application,0);
	
	
	
	
	if(application.constraint!=null){
		application.ammoControler.destroyConstraintAndLine(application.constraint);
	}
	
	var frameInA=application.ammoControler.makeTemporaryTransform();
	var frameInB=application.ammoControler.makeTemporaryTransform();
	
	
	
	var pos1=application.ball.getMesh().position;
	var pos2=application.ball2.getMesh().position.clone();
	var diff=pos2.sub(pos1);
	
	
	AmmoUtils.copyFromVector3(frameInA.getOrigin(),diff);
	
	
	application.constraint=application.ammoControler.createGeneric6DofConstraint(
			application.ball,application.ball2, frameInA,frameInB,application.disableCollisionsBetweenLinkedBodies,application.frameInA);
	
	var dof=application.constraint.constraint;
	
	
	//var MPI=Math.PI/2;//180
	//dof.setAngularLowerLimit(application.ammoControler.makeTemporaryVector3(-MPI, -MPI, -MPI));
	//dof.setAngularUpperLimit(application.ammoControler.makeTemporaryVector3(MPI, MPI, MPI));
	
	
		var limit=application.linearLimitValue;
		dof.setLinearLowerLimit(application.ammoControler.makeTemporaryVector3(-limit, -limit,-limit));
		dof.setLinearUpperLimit(application.ammoControler.makeTemporaryVector3(limit, limit, limit));
	
	
	//change color
	application.constraint.getLine().material.color.set(0x333333);
	
	AmmoUtils.setLinearVelocity(application.ball.getBody(),new THREE.Vector3(application.xForce,application.yForce,application.zForce));
	application.signals.ammoSettingUpdated.dispatch();
	
}

Example.createBox=function(application,mass,posY){
	mass=mass!==undefined?mass:1;
	posY=posY!==undefined?posY:0;
	 var bm=application.ammoControler.createBox(new THREE.Vector3(2, 2, 2), mass, 0,posY,0, 
				new THREE.MeshPhongMaterial({color:0x880000})
						);
	 
	    bm.getBody().setActivationState(AmmoUtils.DISABLE_DEACTIVATION);
		var all=new Ammo.btVector3(1, 1, 1);
		bm.getBody().setLinearFactor(all);
		bm.getBody().setAngularFactor(all);
		AmmoUtils.destroy(all);
		
		
	return bm;
}
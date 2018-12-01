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
	application.ball=Example.createBox(application,application.ballMass,-application.lineLength);
	
	if(application.lockEdge){
		AmmoUtils.setAngularFactor(application.ball.getBody(),0,0,0);
	}
	
	application.ball2=Example.createBox(application,application.ballMass);//this case have mass
	if(application.lockRoot){
		AmmoUtils.setLinearFactor(application.ball2.getBody(),0,0,0);//lock moving
	}
	
	
	
	
	if(application.constraint!=null){
		application.ammoControler.destroyConstraintAndLine(application.constraint);
	}
	
	var frameInA=application.ammoControler.makeTemporaryTransform();
	var frameInB=application.ammoControler.makeTemporaryTransform();
	
	
	
	var pos1=application.ball.getMesh().position;
	var pos2=application.ball2.getMesh().position.clone();
	var diff=pos2.sub(pos1);
	
	if(application.frameInAPos){
		AmmoUtils.copyFromVector3(frameInA.getOrigin(),diff);
	}else{
		AmmoUtils.copyFromVector3(frameInB.getOrigin(),diff.negate());
	}
	
	
	
	application.constraint=application.ammoControler.createGeneric6DofSpringConstraint(
			application.ball,application.ball2, frameInA,frameInB,application.disableCollisionsBetweenLinkedBodies,application.frameInA);
	
	var dof=application.constraint.constraint;
	
	
	
	AmmoUtils.seteAllEnableSpring(dof,true);
	AmmoUtils.seteAllStiffness(dof,application.stiffness);
	AmmoUtils.seteAllDamping(dof,application.damping);
	//dof.setBreakingImpulseThreshold(35000);//no idea,how effect.
	//console.log(dof.getBreakingImpulseThreshold());
	
	
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

Example.createBox=function(application,mass,value){
	mass=mass!==undefined?mass:1;
	value=value!==undefined?value:0;
	
	var posY=application.posYDirection?value:0;
	var posX=application.posYDirection?0:value;
	
	 var bm=application.ammoControler.createBox(new THREE.Vector3(2, 2, 2), mass, posX,posY,0, 
				new THREE.MeshPhongMaterial({color:0x880000})
						);
	 
	    bm.getBody().setActivationState(AmmoUtils.DISABLE_DEACTIVATION);
		var all=new Ammo.btVector3(1, 1, 1);
		bm.getBody().setLinearFactor(all);
		bm.getBody().setAngularFactor(all);
		AmmoUtils.destroy(all);
		
		
	return bm;
}
Example=function(application){
	var ap=application;
	application.signals.ammoSettingUpdated.add(function(){
		if(application.ball!==undefined){
			application.ball.getBody().setDamping(application.linearDamping,application.angularDamping);
			application.ball2.getBody().setDamping(application.linearDamping,application.angularDamping);
		}
	});
	
	
	var debug=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshPhongMaterial({color:0x00ff00,visible:false}));
	application.root.add(debug);
	
	Example.newBall(application);
	
	ap.mixer=new THREE.AnimationMixer(null);
	ap.clock=new THREE.Clock();
	
	ap.signals.rendered.add(function(){
		ap.ammoControler.update();
		if(ap.mixer){
			var delta = ap.clock.getDelta();
			ap.mixer.update(delta);
		}
		
		//keep distance
		if(ap.keepDistance){
			var limitDistance=10;
			var pos1=application.ball.getMesh().position;
			var pos2=application.ball2.getMesh().position;
			var distance=pos1.distanceTo(pos2);
			if(distance>limitDistance){//TODO auto set
				//console.log("over distance");
				//force keep distance
				var divided=distance/limitDistance;
				var diff=pos1.clone().sub(pos2);
				diff.divideScalar(divided).add(pos2);
				debug.position.copy(diff);
				diff.applyMatrix4(ap.root.matrixWorld);
				
				AmmoUtils.setPosition(application.ball.getBody(),diff.x,diff.y,diff.z);
				
				}
			}
		
	});
	
	ap.signals.animationStopped.add(function(){
		ap.mixer.stopAllAction();
		application.scene.quaternion.copy(new THREE.Quaternion());
	});
}



Example.newBall=function(application){
	application.signals.animationStopped.dispatch();
	if(application.ball!=null){
		application.ammoControler.destroyBodyAndMesh(application.ball);
		application.ammoControler.destroyBodyAndMesh(application.ball2);
	}
	
	//initial position is very important,if not disable each other,moved and hit.
	application.ball=Example.createBox(application,application.mass,-application.lineLength);
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
	var ap=application;
	mass=mass!==undefined?mass:1;
	value=value!==undefined?value:0;
	
	var baseY=25;
	
	var posY=application.posYDirection?value:0;
	var posX=application.posYDirection?0:value;
	
	 var bm=application.ammoControler.createBox(new THREE.Vector3(2, 2, 2), mass, posX,baseY+posY,0, 
				new THREE.MeshPhongMaterial({color:0x880000})
						);
	 
	 
	    bm.getBody().setActivationState(AmmoUtils.DISABLE_DEACTIVATION);
		var linearX=ap.linearX?1:0;
		var linearY=ap.linearY?1:0;
		var linearZ=ap.linearZ?1:0;
		AmmoUtils.setLinearFactor(bm.getBody(),linearX,linearY,linearZ);
		var angularX=ap.angularX?1:0;
		var angularY=ap.angularY?1:0;
		var angularZ=ap.angularZ?1:0;
		AmmoUtils.setAngularFactor(bm.getBody(),angularX,angularY,angularZ);
		
		
		
	return bm;
}
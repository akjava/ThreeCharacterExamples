Example=function(application){
	
	application.signals.ammoSettingUpdated.add(function(){
		if(application.ball!==undefined){
			application.ball.getBody().setDamping(application.linearDamping,application.angularDamping);
		}
	});
	
	
	Example.newBall(application);
	
}

Example.newBall=function(application){
	if(application.ball!=null){
		application.ammoControler.destroyBodyAndMesh(application.ball);
	}
	
	application.ball=Example.createBox(application);
	
	
	var pivot0Position=new THREE.Vector3(0,application.lineLength,0);
	
	if(application.constraint!=null){
		application.ammoControler.destroyConstraintAndLine(application.constraint);
	}
	application.constraint=application.ammoControler.createPoint2PointConstraint(application.ball, new THREE.Vector3().copy(pivot0Position));
	
	//change color
	application.constraint.getLine().material.color.set(0x333333);
	
	AmmoUtils.setLinearVelocity(application.ball.getBody(),new THREE.Vector3(application.xForce,application.yForce,application.zForce));
	application.signals.ammoSettingUpdated.dispatch();
	
}

Example.createBox=function(application){
	 var bm=application.ammoControler.createBox(new THREE.Vector3(2, 2, 2), 1, 0,0,0, 
				new THREE.MeshPhongMaterial({color:0x880000})
						);
	 
	    bm.getBody().setActivationState(AmmoUtils.DISABLE_DEACTIVATION);
		var all=new Ammo.btVector3(1, 1, 1);
		bm.getBody().setLinearFactor(all);
		bm.getBody().setAngularFactor(all);
		AmmoUtils.destroy(all);
		
		
	return bm;
}
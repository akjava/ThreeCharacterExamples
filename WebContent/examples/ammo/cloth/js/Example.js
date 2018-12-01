Example=function(application){
	var ap=application;
	ap.camera.position.set( 0, -10, 20 );
	ap.controls.target.set(0,-10,0);
	ap.controls.update();
	//init
	Example.particles=[];
	Example.constraints=[];
	
	application.signals.ammoSettingUpdated.add(function(){
		if(application.ball!==undefined){
			application.ball.getBody().setRestitution(application.ballRestitution);
			application.ball.getBody().setFriction(application.ballFriction);
			//user moving body should be set to damping 1.
			application.ball.getBody().setDamping(application.ballLinearDamping,application.ballAngularDamping);
			
		}
	});
	
	application.signals.rendered.add(function(){
		var t = Date.now()/1000;
		if(application.ball!==undefined){
			AmmoUtils.setPosition(application.ball.getBody(),
			ap.ballX+ap.ballMove * Math.sin(t), ap.ballY,ap.ballZ+ ap.ballMove * Math.cos(t));
		}
		
		
		Example.updateGeometry(application);
		
		
		//seems working. TODO add editor
		if(application.useLimitVelocity){
		var maxLiner=application.limitVelocity;
		var maxAngular=application.limitVelocity;
		var vec=new THREE.Vector3();
		Example.particles.forEach(function(p){
			var linear=AmmoUtils.getLinearVelocity(p.getBody());
			vec.set(Math.min(maxLiner,linear.x),Math.min(maxLiner,linear.y),Math.min(maxLiner,linear.z));
			AmmoUtils.setLinearVelocity(p.getBody(),vec);
			
			var angular=AmmoUtils.getAngularVelocity(p.getBody());
			vec.set(Math.min(maxAngular,angular.x),Math.min(maxAngular,angular.y),Math.min(maxAngular,angular.z));
			AmmoUtils.setAngularVelocity(p.getBody(),vec);
			
			/*
			var angular=AmmoUtils.getAngularVelocity(application.lastParticle.getBody());
			
			angularXText.setValue( angular.x.toFixed(2) );
			angularYText.setValue( angular.y.toFixed(2) );
			angularZText.setValue( angular.z.toFixed(2) );
			*/
		});
		}
		
	});
	
	
	application.signals.ballSizeChanged.add(function(){
		Example.newBall(application);
	});
	application.signals.visibleChanged.add(function(){
		Example.particles.forEach(function(object){
			object.getMesh().material.visible=application.visibleAmmo;
		});
		Example.constraints.forEach(function(object){
			object.getLine().material.visible=application.visibleAmmo;
		});
		
		application.clothMaterial.visible=application.visibleGeometry;
		
		application.ball.getMesh().material.visible=application.visibleBall;
	});
	
	Example.newBall(application);
	Example.newCloth(application);
	
	


	
	
}

Example.newBall=function(application){
	var ap=application;
	if(application.ball!=null){
		application.ammoControler.destroyBodyAndMesh(application.ball);
	}
	
	application.ball=application.ammoControler.createSphere(ap.ballSize, ap.ballMath, ap.ballX, ap.ballY, ap.ballZ, 
			new THREE.MeshPhongMaterial({color:0x888888}));
	
	//ball.getBody().setAngularVelocity(THREE.Vector3());//this working
	//ball.getBody().setLinearVelocity(THREE.Vector3(xForce, 0, zForce));
	
	
	application.signals.ammoSettingUpdated.dispatch();
}

Example.newCloth=function(application){
	if(application.ball!=null){//very important to clear velocity the object which is possible to conflict new creating object. 
	AmmoUtils.setLinearVelocity(application.ball.getBody(),new THREE.Vector3(0,0,0));
	AmmoUtils.setAngularVelocity(application.ball.getBody(),new THREE.Vector3(0,0,0));
	}

	var ap=application;
	//clear old one
	Example.particles.forEach(function(object){
		application.ammoControler.destroyBodyAndMesh(object);
	});
	Example.particles=[];
	
	Example.constraints.forEach(function(object){
		application.ammoControler.destroyConstraintAndLine(object);
	});
	Example.constraints=[];
	
	var pMass=application.clothMass/((ap.gridRows+1)*(ap.gridColumns+1));
	var p=new THREE.Vector3();
	Example.particleW=ap.gridColumns+1;
	
	for(var y=0;y<=ap.gridRows;y++){
		for(var x=0;x<=ap.gridColumns;x++){
			ap.clothFunction(x/(ap.gridRows),y/(ap.gridColumns),p);
			
			var pSize=ap.particleSize!=0?ap.particleSize:(ap.totalWidth/(ap.gridColumns+1))/2;
			var mass=Example.isPin(x,y)?0:pMass;
			
			var particle=application.ammoControler.createSphere(pSize, mass, p.x, p.y, p.z, 
					new THREE.MeshPhongMaterial({color:0x880000})
							);
			particle.forceSyncWhenHidden=true;//geometry need mesh-pos
			particle.getBody().setRestitution(application.particleRestitution);
			particle.getBody().setFriction(application.particleFriction);
			particle.getBody().setDamping(application.particleDamping,application.particleDamping);
			
			application.lastParticle=particle;
			
			Example.particles.push(particle);
		}
	}
	//for detect
	application.lastParticle.getMesh().material.color.set(0x000088);
	
	//connection
	for(var y=0;y<=ap.gridRows;y++){
		for(var x=0;x<=ap.gridColumns;x++){
			var body1=Example.getParticle(x,y);
			var bottom=Example.getParticle(x,y+1);
			if(y<ap.gridRows){
				var constraint=Example.connect(application,body1,bottom);
				Example.constraints.push(constraint);
			}
			
			if(application.connectHorizontal){
			var right=Example.getParticle(x+1,y);
			if(x<ap.gridColumns){
				var constraint=Example.connect(application,body1,right);
				Example.constraints.push(constraint);
			}
			}
			
			
		}
	}
	
	
	//new geometry
	if(application.clothMesh!=null){
		 application.scene.remove(application.clothMesh);
	}
	
	 
	application.clothMesh=Example.createMesh(application);
     
     application.scene.add(application.clothMesh);

 	application.signals.visibleChanged.dispatch();
 	
 	application.clothColumns=application.gridColumns;
 	application.clothRows=application.gridRows;
}

Example.updateGeometry=function(application){
	var ap=application;
	var maxidx=(ap.clothColumns+1)*(ap.clothRows+1);
	if(maxidx!=ap.clothGeometry.vertices.length){
		console.log("difference size:",maxidx,ap.clothGeometry.vertices.length);
		return;
	}
	
	for(var y=0;y<=ap.clothRows;y++){
		for(var x=0;x<=ap.clothColumns;x++){
			var idx = y*(ap.clothColumns+1) + x;
			ap.clothGeometry.vertices[idx].copy(Example.particles[idx].getMesh().position);
			
		}
	}
	ap.clothGeometry.computeFaceNormals();
	ap.clothGeometry.computeVertexNormals();
	ap.clothGeometry.normalsNeedUpdate = true;
	ap.clothGeometry.verticesNeedUpdate = true;
}

Example.createMesh=function(application){
	var clothGeometry = new THREE.ParametricGeometry( application.clothFunction, application.gridColumns, application.gridRows );
	clothGeometry.dynamic=true;
    clothGeometry.computeFaceNormals();
   
    var clothMesh = new THREE.Mesh(clothGeometry, application.clothMaterial);
    
    application.clothGeometry=clothGeometry;
    return clothMesh;
}


Example.getParticle=function(x,y){
	var index=(Example.particleW)*y+x;
	return Example.particles[index];
}

Example.isPin=function(x,y){
	if(y==0){
		return true;
	}else{
		return false;
	}
}

Example.connect=function(application,bm1,bm2){
	
	var frameInA=application.ammoControler.makeTemporaryTransform();
	var frameInB=application.ammoControler.makeTemporaryTransform();
	
	var body1=bm1.getBody();
	var body2=bm2.getBody();
	
	
	var diff=bm1.getMesh().position.clone().sub(bm2.getMesh().position).multiplyScalar(application.frameBRatio);
	AmmoUtils.copyFromVector3(frameInB.getOrigin(),diff);
	
	var diff=bm2.getMesh().position.clone().sub(bm1.getMesh().position).multiplyScalar(1.0-application.frameBRatio);
	AmmoUtils.copyFromVector3(frameInA.getOrigin(),diff);
	
	
	var cm=application.ammoControler.createGeneric6DofSpringConstraint(bm1,bm2, frameInA, frameInB, application.disableCollisionsBetweenLinkedBodies,application.frameInA);
	
	var dof=cm.constraint;
	AmmoUtils.seteAllEnableSpring(cm.constraint,true);
	AmmoUtils.seteAllStiffness(cm.constraint,application.stiffness);
	AmmoUtils.seteAllDamping(cm.constraint,application.damping);
	
	
	var limit=application.linearLimit;
	dof.setLinearLowerLimit(application.ammoControler.makeTemporaryVector3(-limit, -limit,-limit));
	dof.setLinearUpperLimit(application.ammoControler.makeTemporaryVector3(limit, limit, limit));
	
	
	dof.setAngularLowerLimit(application.ammoControler.makeTemporaryVector3(-application.angularLimit, -application.angularLimit,-application.angularLimit));
	dof.setAngularUpperLimit(application.ammoControler.makeTemporaryVector3(application.angularLimit, application.angularLimit, application.angularLimit));
	
	
	
	return cm;
}
Example=function(application){
	var ap=application;
	
	ap.camera.position.set( 0, -5, 30 );
	ap.controls.target.set(0,-5,0);
	ap.controls.update();
	
	
	//ammo setup
	var world=AmmoUtils.initWorld(0,-9.8,0);
	var ammoControler=new AmmoControler(ap.scene,world);
	ap.ammoControler=ammoControler;
	ap.signals.rendered.add(function(){
		ammoControler.update();
	});
	
	function connect(target1,target2){
		var frameInA=application.ammoControler.makeTemporaryTransform();
		var frameInB=application.ammoControler.makeTemporaryTransform();
		
		
		
		var pos1=target1.getMesh().position;
		var pos2=target2.getMesh().position.clone();
		var diff=pos1.sub(pos2);

		
		
		AmmoUtils.copyFromVector3(frameInB.getOrigin(),diff);
		
		
		application.constraint=application.ammoControler.createGeneric6DofSpringConstraint(
				target1,target2, frameInA,frameInB,false,true);
	}
	
	function setState(body){
		body.getBody().setActivationState(Ammo.DISABLE_DEACTIVATION);
		AmmoUtils.setAngularFactor(body.getBody(),1,1,1);
	}
	
	application.root=application.ammoControler.createSphere(1, 0, 0, 0, 0, 
			new THREE.MeshPhongMaterial({color:0x880000})
					);
	/*application.root=ap.ammoControler.createBox(new THREE.Vector3(2, 1, 1), 0, 0,0,0, 
			new THREE.MeshPhongMaterial({color:0x880000}));*/
	
	
	application.ball=ap.ammoControler.createBox(new THREE.Vector3(2, 1, 1), 1, 0,-5,0, 
			new THREE.MeshPhongMaterial({color:0x880000}));
	setState(application.ball);
	connect(application.root,application.ball);
	
	application.ball2=application.ammoControler.createSphere(1, 1, 0, -10, 0, 
			new THREE.MeshPhongMaterial({color:0x880000})
					);
	setState(application.ball2);
	connect(application.ball,application.ball2);
	
	
	application.ball3=ap.ammoControler.createBox(new THREE.Vector3(2, 1, 1), 1, 0,-15,0, 
			new THREE.MeshPhongMaterial({color:0x880000}));
	setState(application.ball3);
	connect(application.ball2,application.ball3);
	
	
}
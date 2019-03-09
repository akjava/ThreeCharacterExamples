Example=function(application){
	var ap=application;
	
	ap.camera.position.set( 0, -5, 30 );
	ap.controls.target.set(0,-5,0);
	ap.controls.update();
	
	//test group
	var group=new THREE.Group();
	ap.scene.add(group);
	ap.group=group;
	//group.position.set(10,5,5);
	
	//var xq=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.Math.degToRad(60));
	//group.quaternion.multiply(xq);
	//group.scale.set(0.1,0.1,0.1);
	//group.position.set(5,5,5);

	
	
	//ammo setup
	var world=AmmoUtils.initWorld(0,-9.8,0);
	var ammoControler=new AmmoControler(ap.group,world);
	ap.ammoControler=ammoControler;
	
	
	
	
	function syncBones(){
		var bones=ap.skinnedMesh.skeleton.bones;
		ap.skinnedMesh.skeleton.pose();
		//no need [0] root
		for(var i=0;i<bones.length;i++){
			//ap.scene.add(ap.skinnedMesh);//some trick for add different matrix object
			//ap.scene.updateMatrixWorld();//some trick
			var name=bones[i].name;
			var bm=application[name];
			ap.ammoControler.updateBone(bones[i], bm);
			//ap.group.add(ap.skinnedMesh);//some trick
		}
	};
	
	
	ap.signals.rendered.add(function(){
		ammoControler.update();
		syncBones();
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
	
	var list=[];
	
	list.push(new THREE.Vector3(0,0,0));
	list.push(new THREE.Vector3(0,-5,0));
	list.push(new THREE.Vector3(0,-10,0));
	
	var ammoObjects=[];
	var parent=null;
	list.forEach(function(pt){
		var mass=parent==null?0:1;
		var ball=application.ammoControler.createBox(new THREE.Vector3(1,1,1), mass, pt.x, pt.y, pt.z, 
				new THREE.MeshPhongMaterial({color:0x880000})
						);
		setState(ball);
		if(parent!=null){
			connect(parent,ball);
		}
		parent=ball;
		ammoObjects.push(ball);
	});
	
	for(var i=0;i<ammoObjects.length;i++){
		var name="ball"+i;
		application[name]=ammoObjects[i];
	}
	
	
	ap.camera.position.set( 0, -5, 30 );
	ap.controls.target.set(0,-5,0);
	ap.controls.update();
	
	
	
	var parent=-1;
	var parentPos=new THREE.Vector3();
	var bones=[];
	list.forEach(function(pt){
		var bone={pos:[0,0,0],scl:[1,1,1],rotq:[0,0,0,1]};
		bone.parent=parent;
		var pos=pt.clone().sub(parentPos);
		bone.pos=[pos.x,pos.y,pos.z];
		bone.name="ball"+String(parent+1);
		
		parentPos=pt;
		
		parent++;
		bones.push(bone);
	});
	
	
	var geometry=new THREE.Geometry();
	//geometry
	for(var i=0;i<list.length;i++){
		var pt=list[i];
		
		var mesh=new THREE.Mesh(new THREE.BoxGeometry(2,2,2));
		mesh.position.copy(pt);
		
		
		
		//copy direct to geometry
		for(var j=0;j<mesh.geometry.vertices.length;j++){
			geometry.skinIndices.push(new THREE.Vector4(i,0,0,0));
			geometry.skinWeights.push(new THREE.Vector4(1.0,0,0,0));
		}
		
		
		geometry.mergeMesh(mesh);
	}
	
	
	geometry.bones=bones;
	
	
	
	var mesh=new THREE.SkinnedMesh(geometry,new THREE.MeshPhongMaterial({color:0x000088,transparent: true, opacity: 0.5,skinning:true}));
	ap.group.add(mesh);

	
	ap.skinnedMesh=mesh;
	console.log(mesh);
	var helper = new THREE.SkeletonHelper(mesh);
	ap.scene.add(helper);//Very important
	ap.skeletonHelper=helper;

	//helper.matrixAutoUpdate=true;
	
	ap.mixer=new THREE.AnimationMixer(mesh);
	ap.clock=new THREE.Clock();
	
	ap.signals.rendered.add(function(){
		if(ap.mixer){
			var delta = ap.clock.getDelta();
			ap.mixer.update(delta);
			//console.log(ap.skinnedMesh.skeleton.bones[0].quaternion);
		}
	})
	
	ap.signals.skinnedMeshChanged.dispatch(mesh);
	
	
}
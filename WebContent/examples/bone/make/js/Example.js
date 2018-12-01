Example=function(application){
	var ap=application;
	
	ap.camera.position.set( 0, -5, 30 );
	ap.controls.target.set(0,-5,0);
	ap.controls.update();
	
	var list=[];
	
	list.push(new THREE.Vector3(0,0,0));
	list.push(new THREE.Vector3(0,-5,0));
	list.push(new THREE.Vector3(0,-10,0));
	
	var parent=-1;
	var parentPos=new THREE.Vector3();
	var bones=[];
	list.forEach(function(pt){
		var bone={pos:[0,0,0],scl:[1,1,1],rotq:[0,0,0,1]};
		bone.parent=parent;
		var pos=pt.clone().sub(parentPos);
		bone.pos=[pos.x,pos.y,pos.z];
		bone.name="bone-"+String(parent+1);
		
		parentPos=pt;
		
		parent++;
		bones.push(bone);
	});
	
	
	var geometry=new THREE.Geometry();
	//geometry
	for(var i=0;i<list.length;i++){
		var pt=list[i];
		
		var mesh=new THREE.Mesh(new THREE.BoxGeometry(1,1,1));
		mesh.position.copy(pt);
		
		
		
		//copy direct to geometry
		for(var j=0;j<mesh.geometry.vertices.length;j++){
			geometry.skinIndices.push(new THREE.Vector4(i,0,0,0));
			geometry.skinWeights.push(new THREE.Vector4(1.0,0,0,0));
		}
		
		
		geometry.mergeMesh(mesh);
	}
	
	
	geometry.bones=bones;
	
	
	
	var mesh=new THREE.SkinnedMesh(geometry,new THREE.MeshPhongMaterial({color:0x880000,skinning:true}));
	ap.scene.add(mesh);
	ap.skinnedMesh=mesh;

	var helper = new THREE.SkeletonHelper(mesh);
	ap.scene.add(helper);
	
	
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
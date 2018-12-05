Example=function(application){
	var ap=application;
	
	ap.camera.position.set( 0, 0, 30 );
	ap.controls.target.set(0,0,0);
	ap.controls.update();
	
	
	var mesh=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial({color:0x880000}));
	ap.scene.add(mesh);
	ap.mesh=mesh;
	
	var mesh2=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial({color:0x000088}));
	mesh2.position.set(3,0,0);
	mesh.add(mesh2);
	ap.mesh2=mesh2;
	
	//joint
	var geo = new THREE.Geometry();
	geo.vertices.push( new THREE.Vector3(  ));
	geo.vertices.push( new THREE.Vector3(3,0,0));
	var material=new THREE.LineBasicMaterial({color:0xcccccc});
	
	var joint = new THREE.Line( geo,material);
	mesh.add(joint);
	
	
	var target=new THREE.Mesh(new THREE.BoxGeometry(2,2,2),new THREE.MeshBasicMaterial({color:0x008800,transparent:true,opacity:0.5}));
	target.position.set(0,3,0);
	ap.scene.add(target);
	ap.target=target;
	
}
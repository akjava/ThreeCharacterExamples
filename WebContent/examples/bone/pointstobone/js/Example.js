Example=function(application){
	var ap=application;
	
	ap.camera.position.set( 0, 0, 30 );
	ap.controls.target.set(0,0,0);
	ap.controls.update();
	
	

	//from three.js example of webgl_animation_cloth.html
	function plane( width, height ) {

		return function ( u, v, target ) {

			var x = ( u - 0.5 ) * width;
			var y = -( v -.5 ) * height;
			var z = 0;

			target.set( x, y, z );

		};

	}
	var gridColumns=4;
	var gridRows=4;
	var points=[];
	var clothFunction = plane(10, 10);
	
	var p=new THREE.Vector3();
	Example.particleW=gridColumns+1;
	
	for(var y=0;y<=gridRows;y++){
		for(var x=0;x<=gridColumns;x++){
			clothFunction(x/(gridRows),y/(gridColumns),p);	
			points.push(p.clone());
		}
	}
	
	var bones=BoneUtils.createBonesFromPoints(points,gridColumns);
	var geo=new THREE.BoxGeometry(10,10,1,4);
	geo.bones=bones;
	console.log(bones);
	BoneUtils.initializeIndicesAndWeights(geo);
	
	var material=new THREE.MeshPhongMaterial({color:0x880000,skinning:true,wireframe:true});
	var mesh=new THREE.SkinnedMesh(geo,material);
	ap.scene.add(mesh);
	var helper=new THREE.SkeletonHelper(mesh);
	ap.scene.add(helper);
}
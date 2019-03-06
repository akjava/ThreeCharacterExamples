Sidebar.Skybox=function(ap){
	var container=new UI.TitlePanel("Skybox");
	
	if(!ap.defaultImageUrls){
		ap.defaultImageUrls={};
	}
	if(!ap.imageUrls){
		ap.imageUrls={};
	}
	if(!ap.images){
		ap.images={};
	}
	
	ap.camera.far=2000;
	
	var listImage=ListImageDiv(ap,["lythwood_field.jpg","satara_night.jpg","approaching_storm.jpg"],"skybox","../../../dataset/mbl3d/skybox/");
	container.add(listImage);
	
	ap.getSignal("loadingImageFinished").add(function(image){
		
		var texture=new THREE.Texture(image);
		texture.flipY=false;
		texture.magFilter=THREE.NearestFilter;
		texture.minFilter=THREE.NearestFilter;
		texture.mapping=THREE.EquirectangularReflectionMapping 
		texture.needsUpdate=true;
		
		
		var geometry=new THREE.SphereGeometry( 1500, 60, 40 );
		geometry.applyMatrix( new THREE.Matrix4().makeScale( 1, 1, -1 ) );
		var material=new THREE.MeshBasicMaterial({envMap:texture,overdraw: 2});
		var mesh=new THREE.Mesh(geometry,material);
		
		ap.skybox=mesh;
		ap.scene.add(mesh);
		
		
		//var generator = new THREE.CubemapGenerator( ap.renderer );
		//var renderTarget = generator.fromEquirectangular( texture, { resolution: 256 } ); // the resolution depends on your image
		//ap.scene.background = renderTarget;
	});
	
	listImage.load("lythwood_field.jpg");
	


	
	return container;
}
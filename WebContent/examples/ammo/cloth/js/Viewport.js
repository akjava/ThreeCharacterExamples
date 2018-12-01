var Viewport = function ( application ) {
	var signals = application.signals;
	
	var container = new UI.Panel();
	container.setId( 'viewport' );
	//container.setPosition( 'absolute' );
	
	var camera = application.camera;
	var scene = application.scene;
	
	
	//init renderer
	var renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize(0,0 );//windowResize call from html
	container.dom.appendChild( renderer.domElement );
	
	//light
	var light = new THREE.DirectionalLight(0xcccccc);
	light.position.set(100, 100, 100);
	scene.add(light);

	scene.add(new THREE.AmbientLight(0x666666));
	
	//controls
	var controls = new THREE.OrbitControls(camera ,renderer.domElement);
	application.controls=controls;
	controls.screenSpacePanning=true;
	controls.update();
	
	signals.windowResize.add( function () {
		
		camera.aspect = container.dom.offsetWidth / container.dom.offsetHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( container.dom.offsetWidth, container.dom.offsetHeight );

		render();

	} );
	
	var stats = new Stats();
	container.dom.appendChild( stats.dom );
     
	
     
     application.clothMaterial = new THREE.MeshPhongMaterial( {alphaTest: 0.5,ambient: 0x000000,color: 0xffffff,specular: 0x333333,emissive: 0x222222,shininess: 5,side: THREE.DoubleSide} );
     application.signals.loadingTextureStarted.dispatch();
     

	
	
	var world=AmmoUtils.initWorld(0,application.gravityY,0);
	var ammoControler=new AmmoControler(scene,world);
	ammoControler.substeps=0;//4 is broken?
	ammoControler.fixedTimeStep=1.0/120;
	application.ammoControler=ammoControler;
	
	
	function animate() {
		requestAnimationFrame( animate );
		render();
	}
	
	function render() {
		
		ammoControler.update(1.0/application.ammoTimeSteps);
		renderer.render( scene, camera );
		stats.update();
		application.signals.rendered.dispatch();
	}
	
	
	
	animate();
	
	return container;
}
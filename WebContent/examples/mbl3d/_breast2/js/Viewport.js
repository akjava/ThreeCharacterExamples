var Viewport = function ( app ) {
	var signals = app.signals;
	
	var container = new UI.Panel();
	container.setId( 'viewport' );
	//container.setPosition( 'absolute' );
	
	var camera = app.camera;
	var scene = app.scene;
	
	
	//init renderer
	var renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize(0,0 );//windowResize call from html
	container.dom.appendChild( renderer.domElement );
	
	//light
	var light = new THREE.DirectionalLight(0xcccccc);
	light.position.set(100, 100, 100);
	scene.add(light);

	scene.add(new THREE.AmbientLight(0xcccccc));
	
	//control
	var controls = new THREE.OrbitControls(camera ,renderer.domElement);

	controls.screenSpacePanning=true;
	controls.update();
	application.controls=controls;
	
	
	signals.windowResize.add( function () {
		
		camera.aspect = container.dom.offsetWidth / container.dom.offsetHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( container.dom.offsetWidth, container.dom.offsetHeight );

		render();

	} );
	
	function animate() {
		requestAnimationFrame( animate );
		render();
	}
	
	function render() {
		renderer.render( scene, camera );
		
		application.signals.rendered.dispatch();
	}
	
	animate();
	
	return container;
}
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
	controls.screenSpacePanning=true;
	controls.update();
	
	signals.windowResize.add( function () {
		
		camera.aspect = container.dom.offsetWidth / container.dom.offsetHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( container.dom.offsetWidth, container.dom.offsetHeight );

		render();

	} );
	
	application.root=new THREE.Mesh(new THREE.BoxGeometry(3,3,3),new THREE.MeshPhongMaterial({color:0x008800}));
	scene.add(application.root);
	
	var world=AmmoUtils.initWorld();
	var ammoControler=new AmmoControler(application.root,world);
	ammoControler.substeps=0;
	application.ammoControler=ammoControler;
	
	
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
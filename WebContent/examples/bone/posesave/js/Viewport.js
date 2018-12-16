var Viewport = function ( application ) {
	var ap=application;
	var signals = ap.signals;
	
	var container = new UI.Panel();
	container.setId( 'viewport' );
	//container.setPosition( 'absolute' );
	
	var camera = ap.camera;
	var scene = ap.scene;
	

	
	//init renderer
	var renderer = new THREE.WebGLRenderer( { antialias: true} );
	ap.renderer=renderer;
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize(0,0 );//windowResize call from html
	container.dom.appendChild( renderer.domElement );
	
	
	
	//light
	var light = new THREE.DirectionalLight(0xcccccc);
	light.position.set(100, 100, 100);
	scene.add(light);

	scene.add(new THREE.AmbientLight(0x666666));
	
	//control
	var controls = new THREE.OrbitControls(camera ,renderer.domElement);
	controls.screenSpacePanning=true;
	controls.update();
	ap.controls=controls;
	
	//transform
	var control = new THREE.TransformControls( ap.camera, ap.renderer.domElement );
	control.addEventListener( 'dragging-changed', function ( event ) {
		ap.controls.enabled = ! event.value;

	} );
	control.addEventListener( 'change', function () {
		//called attached or moved
		ap.signals.transformChanged.dispatch();
	});
	
	control.detach();
	ap.scene.add( control );//should here
	ap.transformControls=control;
	
	
	signals.windowResize.add( function () {
		
		camera.aspect = container.dom.offsetWidth / container.dom.offsetHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( container.dom.offsetWidth, container.dom.offsetHeight );


	} );
	
	function handleClick() {

		if ( onDownPosition.distanceTo( onUpPosition ) === 0 ) {

			var intersects = getIntersects( onUpPosition, ap.objects );

			if ( intersects.length > 0 ) {

				var object = intersects[ 0 ].object;

				ap.signals.transformSelectionChanged.dispatch(object);
				
			} else {

				ap.signals.transformSelectionChanged.dispatch(null);

			}


		}

	}
	
	var raycaster = new THREE.Raycaster();
	var mouse = new THREE.Vector2();

	// events

	function getIntersects( point, objects ) {

		mouse.set( ( point.x * 2 ) - 1, - ( point.y * 2 ) + 1 );

		raycaster.setFromCamera( mouse, camera );

		return raycaster.intersectObjects( objects );

	}
	
	var onDownPosition = new THREE.Vector2();
	var onUpPosition = new THREE.Vector2();
	var onDoubleClickPosition = new THREE.Vector2();

	function getMousePosition( dom, x, y ) {

		var rect = dom.getBoundingClientRect();
		return [ ( x - rect.left ) / rect.width, ( y - rect.top ) / rect.height ];

	}
	function onMouseDown( event ) {

		event.preventDefault();

		var array = getMousePosition( container.dom, event.clientX, event.clientY );
		onDownPosition.fromArray( array );

		document.addEventListener( 'mouseup', onMouseUp, false );

	}
	container.dom.addEventListener( 'mousedown', onMouseDown, false );
	
	function onMouseUp( event ) {

		var array = getMousePosition( container.dom, event.clientX, event.clientY );
		onUpPosition.fromArray( array );

		handleClick();

		document.removeEventListener( 'mouseup', onMouseUp, false );

	}
	
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
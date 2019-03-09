var MinCore = function ( application ) {
	var ap=application;
	var scope=this;
	var signals = application.signals;
	
	var container = new UI.Panel();
	container.setId( 'viewport' );
	ap.core=container;
	
	
	
	var camera = application.camera;
	var scene = application.scene;
	
	//init renderer
	var renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; //shadow type is fixed so far.
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize(0,0 );//windowResize call from html
	container.dom.appendChild( renderer.domElement );
	application.renderer=renderer;
	
	//control
	var controls = new THREE.OrbitControls( camera ,renderer.domElement);
	controls.screenSpacePanning=true;
	application.controls=controls;
	
	//camera & control position will set in Examples
	
	signals.windowResize.add( function () {
		camera.aspect = container.dom.offsetWidth / container.dom.offsetHeight;
		camera.updateProjectionMatrix();
		
		renderer.setSize( container.dom.offsetWidth, container.dom.offsetHeight );
	} );
	
	function animate() {
		requestAnimationFrame( animate );
		ap.onRender();
	}
	
	function render() {
		renderer.render( scene, camera );
		ap.signals.rendered.dispatch();
	}
	
	ap.onRender=render;
	
	ap.boneSelectedIndex=0;
	ap.getSignal("boneSelectionChanged").add(function(index){
		ap.boneSelectedIndex=index;
	});
	var root=new THREE.Group();
	ap.root=root;
	ap.scene.add(root);
	
	ap.convertToZeroRotatedBoneMesh=true;
	ap.convertBoneEulerOrders=true;
	
	animate();
	
	return container;
}
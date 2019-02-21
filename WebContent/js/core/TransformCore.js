var TransformCore = function ( application ) {
	var ap=application;
	var scope=this;
	var signals = application.signals;
	
	var container = new UI.Panel();
	container.setId( 'viewport' );
	
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
	
	//transform
	var control = new THREE.TransformControls( ap.camera, ap.renderer.domElement );
	control.addEventListener( 'dragging-changed', function ( event ) {
		ap.controls.enabled = ! event.value;

	} );
	control.addEventListener( 'change', function () {
		//called attached or moved
		ap.signals.transformChanged.dispatch(ap.transformControlsTarget);
	});
	
	ap.getSignal("transformSelectionChanged")
	ap.getSignal("transformChanged");
	ap.getSignal("transformFinished");
	ap.getSignal("transformStarted");
	
	control.detach();
	ap.scene.add( control );//should here
	ap.transformControls=control;
	
	//handle event

	ap.transformControlsTarget=null;
	var lastHandleClick=-1;
	function handleClick() {

		if ( onDownPosition.distanceTo( onUpPosition ) === 0 ) {

			var intersects = getIntersects( onUpPosition, ap.objects );

			if ( intersects.length > 0 ) {
				var index=0;
				if(lastHandleClick+1<intersects.length){
					index=lastHandleClick+1;
					lastHandleClick=index;
				}else{
					lastHandleClick=-1;
				}
				var object = intersects[index ].object;

				ap.signals.transformSelectionChanged.dispatch(object);
				
			} else {

				ap.signals.transformSelectionChanged.dispatch(null);

			}


		}

	}
	
	ap.transformControls.addEventListener( 'mouseUp', function () {
		ap.signals.transformFinished.dispatch(ap.transformControlsTarget);
	});
	
	ap.transformControls.addEventListener( 'mouseDown', function () {
		ap.signals.transformStarted.dispatch(ap.transformControlsTarget);
	});
	
	
	ap.getSignal("transformSelectionChanged").add(function(target){
		ap.transformControlsTarget=target;
		if(target==null){
			ap.transformControls.detach();
		}
	},undefined,100);//do first
	

	
	ap.signals.loadingModelFinished.add(function(mesh){
		ap.transformControls.detach();
	});
	
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
	
	ap.convertToZeroRotatedBoneMesh=true;
	
	
	var root=new THREE.Group();
	ap.root=root;
	ap.scene.add(root);
	
	ap.signals.loadingModelStarted.add(function(url,fileName){
		if(ap.skinnedMesh!=null && ap.skinnedMesh.parent!=null){
			ap.skinnedMesh.parent.remove(ap.skinnedMesh);
		}
		AppUtils.loadMesh(url,function(mesh){
			try{
			var isGltf=mesh.isGltf;//set before convert
			ap.isGltf=isGltf;
			
			if(ap.convertToZeroRotatedBoneMesh){
				mesh=BoneUtils.convertToZeroRotatedBoneMesh(mesh);
			}
			
			
			//TODO check and set
			mesh.scale.set(100,100,100);
			if(isGltf){
				
				//animation not compatible gltf
				//mesh.skeleton.bones[0].scale.set(100,100,100);
			}
			
			ap.root.add(mesh);
			ap.skinnedMesh=mesh;
			ap.signals.loadingModelFinished.dispatch(mesh);
			}catch(e){
				console.log(e);
			}
			
		},fileName);
	});
	
	animate();
	
	return container;
}
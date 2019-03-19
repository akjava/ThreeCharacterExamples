var MinTransformCore = function ( ap ) {
	MinCore.call(this,ap);

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
	var lastSelection=null;
	function handleClick() {

		if ( onDownPosition.distanceTo( onUpPosition ) === 0 ) {

			var intersects = getIntersects( onUpPosition, ap.objects );

			if ( intersects.length > 0 ) {
				var index=-1;
				var visibles=[];
				for(var i=0;i<intersects.length;i++){
					if(intersects[i].object.material && intersects[i].object.material.visible){
						visibles.push(intersects[i]);
					}
				}
				
				if(visibles.length==0){
					ap.signals.transformSelectionChanged.dispatch(null);
					return;
				}
				
				var index=0;
				if(visibles.length==1){
					lastSelection=null;
				}else{
					if(visibles[0].object==lastSelection){
						index=1;
						lastSelection=visibles[1].object;
					}else{
						lastSelection=visibles[0].object;
					}
					
				}
				
				
				var object = visibles[index ].object;

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

		raycaster.setFromCamera( mouse,ap. camera );

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

		var array = getMousePosition( ap.core.dom, event.clientX, event.clientY );
		onDownPosition.fromArray( array );

		document.addEventListener( 'mouseup', onMouseUp, false );

	}
	ap.core.dom.addEventListener( 'mousedown', onMouseDown, false );
	
	function onMouseUp( event ) {

		var array = getMousePosition( ap.core.dom, event.clientX, event.clientY );
		onUpPosition.fromArray( array );

		handleClick();

		document.removeEventListener( 'mouseup', onMouseUp, false );

	}
	return ap.core;
}
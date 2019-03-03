var Viewport = function ( application ) {
	var scope=this;
	var signals = application.signals;
	
	var container = new UI.Panel();
	container.setId( 'viewport' );
	//container.setPosition( 'absolute' );
	
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
	
	controls.target.set(0,application.frontPosition.y,0);
	controls.update();
	
	application.controls=controls;
	
	
	
	
	
	// ground
	var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
	mesh.rotation.x = - Math.PI / 2;
	mesh.receiveShadow = true;
	scene.add( mesh );
	application.groundMesh=mesh;

	var grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
	grid.material.opacity = 0.2;
	grid.material.transparent = true;
	scene.add( grid );
	
	signals.windowResize.add( function () {
		
		camera.aspect = container.dom.offsetWidth / container.dom.offsetHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( container.dom.offsetWidth, container.dom.offsetHeight );

		//controls.handleResize();
		

	} );
	
	
	
	var mixer=null;
	
	var clock = new THREE.Clock();
	
	signals.loadingModelStarted.add (function () {
		loadMesh(application.modelUrl);
	} );
	
	
	
	signals.materialTypeChanged.add(function(){
		
		 var material = new window['THREE'][application.materialType](
				 {skinning: true,morphTargets:true ,transparent:true,alphaTest:0.6,wireframe:application.materialWireframe} 
				 );
		 
		 application.skinnedMesh.material=material;
		 
		 application.signals.hairMaterialTypeChanged.dispatch();
		 
	});
	
	
	function loadMesh(url){
		
		AppUtils.loadFbxMesh(url,function(skinnedMesh){
			
			if(application.skinnedMesh!=null){
				application.scene.remove(application.skinnedMesh);
			}
			
			application.skinnedMesh=skinnedMesh;
			skinnedMesh.scale.set(100,100,100);
			application.scene.add(skinnedMesh);
			
			skinnedMesh.castShadow = true;
			skinnedMesh.receiveShadow = application.characterRecieveShadow;
			
			signals.materialTypeChanged.dispatch();	
			
			mixer = new THREE.AnimationMixer( skinnedMesh );
			
			application.mixer=mixer;
			
			signals.loadingModelFinished.dispatch();
		});
	
	}
	function stopAnimation(){
		clearmorphTargetInfluences();
		mixer.stopAllAction();
	}
	function clearmorphTargetInfluences(){
		//reset morphtargets.
		for(var i=0;i<application.skinnedMesh.morphTargetInfluences.length;i++){
			application.skinnedMesh.morphTargetInfluences[i]=0;
		}
	}
	function startAnimation(){
			
			
			var index=application.morphAnimationIndex;
			var skinnedMesh=application.skinnedMesh;
			
			var name="animation";
			mixer.stopAllAction();
			mixer.uncacheClip(name);
			
			clearmorphTargetInfluences();
			
			
			
			var trackName=".morphTargetInfluences["+index+"]";
			
			var duration=application.animationTime;
			var max=application.animationMaxValue;
			var values=application.animationDirection?[0,max,0]:[0,max];
			var times=application.animationDirection?[0,duration,duration*2]:[0,duration];
			
			var track=new THREE.NumberKeyframeTrack(trackName,times,values);
			var tracks=[track];
			
			var clip=new THREE.AnimationClip(name, -1, tracks);
			
			
			
			
			mixer.clipAction(clip).play();
			
	}
	
	signals.morphAnimationStarted.add(function(){
		startAnimation();
	});
	
	signals.morphAnimationFinished.add(function(){
		stopAnimation();
	});
	
	signals.morphAnimationSelectionChanged.add(function(){
		var index=application.morphAnimationIndex;
		var skinnedMesh=application.skinnedMesh;
		var max=application.animationMaxValue;
		clearmorphTargetInfluences();
		skinnedMesh.morphTargetInfluences[index]=max;
	});
	
	
	
	function animate() {
		requestAnimationFrame( animate );
		//controls.update();
		render();
	}
	
	 this.effect = new THREE.OutlineEffect( renderer,{defaultThickness:0.0005,defaultColor: [0.3, 0.3, 0.3 ]});
	
	
	function render() {
		if(mixer){
			mixer.update( clock.getDelta())
		}
		if(application.drawOutline){
			scope.effect.render( scene, camera );
		}else{
			renderer.render( scene, camera );
		}
		
	}
	
	
	
	animate();
	
	return container;
}
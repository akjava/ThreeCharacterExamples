var Viewport = function ( application ) {
	var ap=application;
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
	
	application.controls=controls;
	var scale=100;
	
	
	ap.camera.position.set( 0, 1.5*scale, 0.75*scale );
	ap.controls.target.set(0,1.5*scale,0);
	ap.controls.update();
	
	
	
	
	
	
	
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
				 {side:THREE.DoubleSide,skinning: true,morphTargets:true ,transparent:true,alphaTest:0.6,wireframe:application.materialWireframe} 
				 );
		 
		 application.skinnedMesh.material=material;
		 
		 application.signals.hairMaterialTypeChanged.dispatch();
		 
	});
	
	
	function loadMesh(url){
		
		AppUtils.loadFbxMesh(url,function(skinnedMesh){
			try{
				if(application.skinnedMesh!=null){
					application.scene.remove(application.skinnedMesh);
				}
				skinnedMesh=BoneUtils.convertToZeroRotatedBoneMesh(skinnedMesh);
				application.skinnedMesh=skinnedMesh;
				application.scene.add(skinnedMesh);
				
				skinnedMesh.castShadow = true;
				skinnedMesh.receiveShadow = application.characterRecieveShadow;
				
				signals.materialTypeChanged.dispatch();	
				
				
				application.boneAttachControler=new BoneAttachControler(skinnedMesh);
				application.boneAttachControler.setVisible(false);
				application.scene.add(application.boneAttachControler.object3d);
				
				signals.loadingModelFinished.dispatch();
			}catch(e){
				console.log(e);
			}
			
		});
	
	}

	application.signals.hairModelLoaded.add(function(){
		var index=BoneUtils.findBoneIndexByEndsName(ap.boneAttachControler.getBoneList(),"head");
		var name=ap.boneAttachControler.getBoneList()[index].name;
		var hairContainer=ap.boneAttachControler.getContainerByBoneName(name);
		hairContainer.add( ap.hairMesh );
		ap.hairMesh.updateMatrixWorld(true);
	});
	
	
	
	function animate() {
		requestAnimationFrame( animate );
		
		
		
		//controls.update();
		render();
	}
	
	 this.effect = new THREE.OutlineEffect( renderer,{defaultThickness:0.0005,defaultColor: [0.3, 0.3, 0.3 ]});
	
	
	function render() {
		
		if(ap.boneAttachControler){
			ap.skinnedMesh.updateMatrixWorld(true);
			ap.boneAttachControler.update();	
		}
		
		if(application.drawOutline){
			scope.effect.render( scene, camera );
		}else{
			renderer.render( scene, camera );
		}
		
	}
	
	//timelinear
	signals.loadingModelFinished.add(function(){
		var trackInfo = [];
		var onUpdate=function(){
			application.signals.morphAnimationSelectionChanged.dispatch();
			ap.signals.timelinerDisplayTimeChanged.dispatch();
		};
		
		var header="Expressions_";
		
		
		//swap and shorten
		
		
		for ( var key in application.skinnedMesh.morphTargetDictionary ) {
			var name=key.substring(header.length,key.length);
			var pname=".morphTargetInfluences["+application.skinnedMesh.morphTargetDictionary[key]+"]";
			var info={type: THREE.NumberKeyframeTrack,
					label:name,
					propertyPath:pname,
					initialValue: [0],
					interpolation: THREE.InterpolateLinear
					}
			trackInfo.push(info);
		}
		var timeliner=new Timeliner( new THREE.TimelinerController( ap.skinnedMesh, trackInfo, onUpdate ) );
		ap.timeliner=timeliner;
		
		timeliner.context.dispatcher.fire('totalTime.update',3);
		timeliner.context.timeScale=120;
		timeliner.context.fileName="morphAnimation";
		
	});
	
	
	animate();
	
	return container;
}
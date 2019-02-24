var BasicCore = function ( application ) {
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
	
	
	var root=new THREE.Group();
	ap.root=root;
	ap.scene.add(root);
	
	ap.convertToZeroRotatedBoneMesh=true;
	ap.convertBoneEulerOrders=true;
	
	ap.signals.loadingModelStarted.add(function(url,fileName){
		if(ap.skinnedMesh!=null && ap.skinnedMesh.parent!=null){
			ap.skinnedMesh.parent.remove(ap.skinnedMesh);
		}
		if(fileName){
			application.modelFileName=fileName;
		}else{
			application.modelFileName=url;
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
			if(ap.convertBoneEulerOrders){
				Mbl3dUtils.changeBoneEulerOrders(mesh);//Euler XYZ	
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
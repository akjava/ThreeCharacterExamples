Example=function(application){
	var ap=application;
	var scope=this;
	var scale=100;
	
	ap.camera.position.set( 0, 1*scale, 2.5*scale );
	ap.controls.target.set(0,1*scale,0);
	ap.controls.update();
	
	//var url="../../../dataset/mbl3d/models/anime2_nomorph.glb";
	var url="../../../dataset/mbl3d/models/anime2_female.fbx";
	
	var material=new THREE.MeshPhongMaterial({color:0x888888,skinning:true,transparent:true,opacity:1,depthTest: true});
	
	
	this.container=null;//add mesh here
	var boneList;
	var lastEuler=new THREE.Euler();
	ap.signals.transformChanged.add(function(){
		//console.log(ap.transformControls.axis);//null,X,Y,Z
	});

	
	var geo = new THREE.EdgesGeometry( new THREE.BoxGeometry(5,5,5) ); // or WireframeGeometry( geometry )

	var mat = new THREE.LineBasicMaterial( { color: 0xaaaaaa, linewidth: 2,transparent:true,opacity:1.0,depthTest:true,visible:false } );

	this.wireframe = new THREE.LineSegments( geo, mat );

	ap.scene.add( this.wireframe );
	
	
	AppUtils.loadMesh(url,function(mesh){
		try{
		console.log("loadGltfMesh:",url);
		var container=new THREE.Group();
		this.container=container;//try to not modify Application.js
		ap.scene.add(container);
		ap.container=container;
		
		var isGltf=mesh.isGltf;//set before convert
		
		//mesh part,modify bone and try to same size both glb & fbx
		mesh=BoneUtils.convertToZeroRotatedBoneMesh(mesh);
		mesh.normalizeSkinWeights();
		mesh.material=material;
		mesh.renderOrder = 0;
		container.add(mesh);
		ap.skinnedMesh=mesh;
		
		
		
		if(isGltf){
			mesh.scale.set(scale,scale,scale);
		}
		boneList=BoneUtils.getBoneList(mesh);
		
		ap.signals.skinnedMeshChanged.dispatch(mesh);
		
		
		
		
		
		
		
		//init mixer
		ap.mixer=new THREE.AnimationMixer(mesh);
		ap.clock=new THREE.Clock();
		
		ap.signals.rendered.add(function(){
			if(ap.mixer){
				var delta = ap.clock.getDelta();
				ap.mixer.update(delta);
			}
		});
		
		//init attach controler
		var boxSize=0.05*scale;
		scope.boneAttachControler=new BoneAttachControler(mesh,{color: 0x008800,boxSize:boxSize});
		scope.boneAttachControler.setVisible(false);
		
		this.container.add(scope.boneAttachControler.object3d);
		ap.signals.rendered.add(function(){
			if(scope.boneAttachControler){
				scope.boneAttachControler.update();	
			}
		});
		
		//init ikControler
		ap.ikControler.boneAttachControler=scope.boneAttachControler;
		ap.signals.boneSelectionChanged.add(function(index){
			ap.ikControler.boneSelectedIndex=index;
		});
		
		ap.signals.poseChanged.add(function(){
			ap.ikControler.resetAllIkTargets();
		});
		
		if(!ap.signals.solveIkCalled){
			console.error("Ik need ap.signals.solveIkCalled");
		}
		ap.signals.solveIkCalled.add(function(){
			ap.ikControler.solveIk(true);
		});
		ap.signals.boneRotationChanged.add(function(){
			ap.ikControler.resetAllIkTargets();
		});
		
		ap.signals.transformChanged.add(function(){
			//check conflict
			ap.ikControler.solveIk();
		});
		var mbl3dik=new Mbl3dIk(ap);
		ap.ikControler.ikTargets=mbl3dik.ikTargets;
		
		ap.ikControler.setEndSiteEnabled("Head",true);
		ap.ikControler.setEndSiteEnabled("LeftArm",true);
		ap.ikControler.setEndSiteEnabled("RightArm",true);
		
		//reset at endsite
		ap.ikControler.resetAllIkTargets();
		
		//call finish ik
		
		//rotation control
		var rotatationControler=new RotatationControler(ap,scope.boneAttachControler);
		rotatationControler.initialize(function(bone){
			return !Mbl3dUtils.isFingerBoneName(bone.name) && !Mbl3dUtils.isTwistBoneName(bone.name);
		});
		
		
		//transformSelectionChanged
		scope.target=null;
		ap.signals.transformSelectionChanged.add(function(target){
			scope.target=target;
			if(target==null){
				ap.transformControls.detach();
			}
			
			ap.ikControler.onTransformSelectionChanged(target);
			rotatationControler.onTransformSelectionChanged(target);
		});
		
		ap.transformControls.addEventListener( 'mouseUp', function () {
			rotatationControler.onTransformFinished(scope.target);
			ap.ikControler.onTransformFinished(scope.target);
		});

		ap.transformControls.addEventListener( 'mouseDown', function () {
			rotatationControler.onTransformStarted(scope.target);
		});
		
		ap.signals.ikInitialized.dispatch();
		}catch(e){
			console.error(e);
		}
	});
	
	

	
	

	
	

}
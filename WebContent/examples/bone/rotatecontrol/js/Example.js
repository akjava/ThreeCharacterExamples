Example=function(application){
	var ap=application;
	var scope=this;
	var scale=100;
	
	ap.camera.position.set( 0, 1*scale, 2.5*scale );
	ap.controls.target.set(0,1*scale,0);
	ap.controls.update();
	
	var url="../../../dataset/mbl3d/models/anime2_nomorph.glb";
	//var url="../../../dataset/mbl3d/models/anime2_female.fbx";
	
	var material=new THREE.MeshPhongMaterial({color:0x888888,skinning:true,transparent:false,opacity:1,depthTest: true});
	
	
	this.container=null;//add mesh here
	var boneList;
	

	
	AppUtils.loadMesh(url,function(mesh){
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
		
		
		mesh.scale.set(scale,scale,scale);
		boneList=BoneUtils.getBoneList(mesh);
		Mbl3dUtils.changeBoneOrders(mesh);
		
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
		
		//rotation controler
		var rotatationControler=new RotatationControler(ap,scope.boneAttachControler);
		rotatationControler.initialize(function(bone){
			return !Mbl3dUtils.isFingerBoneName(bone.name) && !Mbl3dUtils.isTwistBoneName(bone.name) && !Mbl3dUtils.isRootBoneName(bone.name);
		});
		ap.rotatationControler=rotatationControler;
		
		//event handling
		scope.target=null;
		ap.signals.transformSelectionChanged.add(function(target){
			scope.target=target;
			if(target==null){
				ap.transformControls.detach();
			}
			
			rotatationControler.onTransformSelectionChanged(target);
			
			
		},undefined,1);
		
		ap.transformControls.addEventListener( 'mouseUp', function () {
			rotatationControler.onTransformFinished(scope.target);
		});

		ap.transformControls.addEventListener( 'mouseDown', function () {
			rotatationControler.onTransformStarted(scope.target);
		});
		
		

		
		
		
		
		
		ap.signals.rendered.add(function(){	
			if(scope.boneAttachControler){
				scope.boneAttachControler.update();
			}
		});

		

	});
	
	


	

}
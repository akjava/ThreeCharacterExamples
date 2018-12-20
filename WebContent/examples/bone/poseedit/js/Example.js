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
			
			//translate
			sphere.position.copy(root.position);
		});
		
		if(!ap.signals.solveIkCalled){
			console.error("Ik need ap.signals.solveIkCalled");
		}
		ap.signals.solveIkCalled.add(function(){
			ap.ikControler.solveIk(true);
		});
		/*
		 ikControler call when onTransformFinished for editor
		 rotationControler call when edited
		 */
		ap.signals.boneRotationChanged.add(function(index){
			var selection=ap.ikControler.getSelectedIkName();
			ap.ikControler.resetAllIkTargets(selection);
			
			if(index==0){
				resetPosition();
			}
		});
		
		ap.signals.transformChanged.add(function(){
			//check conflict
			ap.ikControler.solveIk();
			onTransformChanged();
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
			return !Mbl3dUtils.isFingerBoneName(bone.name) && !Mbl3dUtils.isTwistBoneName(bone.name) && !Mbl3dUtils.isRootBoneName(bone.name);
		});
		
		//translate control
		var root=scope.boneAttachControler.containerList[0];
		var sphere=new THREE.Mesh(new THREE.SphereGeometry(2),new THREE.MeshBasicMaterial({color:0x000088,depthTest:false,transparent:true,opacity:.5}));
		sphere.renderOrder=1;
		sphere.position.copy(root.position);
		ap.scene.add(sphere);
		sphere.userData.boneIndex=0;
		sphere.userData.transformSelectionType="BoneTranslate";
		ap.objects.push(sphere);
		
		var pos=new THREE.Vector3();
		function onTransformChanged(){
			var target=scope.target;
			
			if(target!=null && target.userData.transformSelectionType=="BoneTranslate"){
				var bonePos=scope.boneAttachControler.boneList[target.userData.boneIndex].position;
				var diff=target.position.clone().sub(root.position);
				
				bonePos.add(diff);
				scope.boneAttachControler.update();
				
				ap.signals.boneTranslateChanged.dispatch();
			}
		}
		
		ap.signals.boneTranslateChanged.add(function(){
			ap.ikControler.resetAllIkTargets();
		});
		
		
		
		function onBoneTranslateChanged(){
			resetPosition();
			
		}
		
		ap.signals.boneTranslateChanged.add(onBoneTranslateChanged);
		
		function resetPosition(){
			scope.boneAttachControler.update();
			sphere.position.copy(root.position);
		}
		
		function onTransformSelectionChanged(target){
			if(target!=null && target.userData.transformSelectionType=="BoneTranslate"){
				ap.transformControls.setMode( "translate" );
				ap.transformControls.attach(target);
				//target.quaternion.copy(target.parent.quaternion);
				//target.position.set(0,0,0);
			}
		}
		
		function onTransformStarted(target){
			if(target!=null && target.userData.transformSelectionType=="BoneTranslate"){
				ap.signals.boneTranslateChanged.remove(onBoneTranslateChanged);
			}
		}
		
		function onTransformFinished(target){
			if(target!=null && target.userData.transformSelectionType=="BoneTranslate"){
				ap.ikControler.resetAllIkTargets();
				
				ap.signals.boneTranslateChanged.add(onBoneTranslateChanged);
			}
		}
		
		//transformSelectionChanged
		scope.target=null;
		ap.signals.transformSelectionChanged.add(function(target){
			scope.target=target;
			if(target==null){
				ap.transformControls.detach();
			}
			
			ap.ikControler.onTransformSelectionChanged(target);
			rotatationControler.onTransformSelectionChanged(target);
			onTransformSelectionChanged(target);
		},undefined,1);
		
		ap.transformControls.addEventListener( 'mouseUp', function () {
			rotatationControler.onTransformFinished(scope.target);
			ap.ikControler.onTransformFinished(scope.target);
			onTransformFinished(scope.target);
		});

		ap.transformControls.addEventListener( 'mouseDown', function () {
			onTransformStarted(scope.target);
			rotatationControler.onTransformStarted(scope.target);
		});
		
		ap.signals.ikInitialized.dispatch();
		}catch(e){
			console.error(e);
		}
	});
	
	

	
	

	
	

}
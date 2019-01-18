var Mbl3dPoseEditor=function(ap,scale){
	this.ap=ap;
	this.container=null;//add mesh here
	this.scale=scale
	
	var scope=this;
	ap.signals.rendered.add(function(){	
		if(scope.boneAttachControler){
			scope.boneAttachControler.update();
		}
	});
}

Mbl3dPoseEditor.prototype.loadMesh=function(url,material){
	var scope=this;
	
	var ap=this.ap;
	var scale=this.scale;
	
	AppUtils.loadMesh(url,function(mesh){
		try{
		console.log("loadGltfMesh:",url);
		var container=new THREE.Group();
		scope.container=container;//try to not modify Application.js
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
		
		scope.container.add(scope.boneAttachControler.object3d);
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
			
			//solve others
			if(!ap.ikControler.followOtherIkTargets){
				ap.ikControler.solveOtherIkTargets();
			}
			
			onTransformChanged();
		});
		var mbl3dik=new Mbl3dIk(ap);
		ap.ikControler.ikTargets=mbl3dik.ikTargets;
		
		ap.ikControler.setBoneRatio("clavicle_L",0.01);
		ap.ikControler.setBoneRatio("upperarm_L",0.1);
		ap.ikControler.setBoneRatio("lowerarm_L",1);
		ap.ikControler.setBoneRatio("hand_L",0.1);
		ap.ikControler.setBoneRatio("clavicle_R",0.01);
		ap.ikControler.setBoneRatio("upperarm_R",0.1);
		ap.ikControler.setBoneRatio("lowerarm_R",1);
		ap.ikControler.setBoneRatio("hand_R",0.1);
		
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
		ap.rotatationControler=rotatationControler;
		
		//translate control
		var root=scope.boneAttachControler.containerList[0];
		var sphere=new THREE.Mesh(new THREE.SphereGeometry(2),new THREE.MeshBasicMaterial({color:0x000088,depthTest:false,transparent:true,opacity:.5}));
		sphere.renderOrder=1;
		sphere.position.copy(root.position);
		ap.scene.add(sphere);
		sphere.userData.boneIndex=0;
		sphere.userData.transformSelectionType="BoneTranslate";
		ap.objects.push(sphere);
		ap.translateControler=sphere;
		
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
		

		ap.signals.skinnedMeshChanged.dispatch(mesh);
		ap.signals.ikInitialized.dispatch();
		}catch(e){
			console.error(e);
		}
	});
	
}
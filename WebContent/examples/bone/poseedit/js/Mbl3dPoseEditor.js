var Mbl3dPoseEditor=function(ap,scale,optionalControler){
	this.ap=ap;
	this.container=null;//add mesh here
	this.scale=scale
	
	var scope=this;
	ap.signals.rendered.add(function(){	
		if(scope.boneAttachControler){
			scope.boneAttachControler.update();
		}
	});
	
	this.optionalControler=optionalControler;
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
		console.log(mesh.material);
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
		
		scope.onRendered=function(){
			if(ap.mixer){
				var delta = ap.clock.getDelta();
				ap.mixer.update(delta);
			}
		}
		
		ap.signals.rendered.add(scope.onRendered);
		
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
				ap.signals.boneTranslateChanged.dispatch();//I'm not sure this is need?
			}
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
		var translateControler=new TranslateControler(ap,scope.boneAttachControler);
		translateControler.initialize();
		
		ap.translateControler=translateControler;
		
		var pos=new THREE.Vector3();

		
		ap.signals.boneTranslateChanged.add(function(){
			ap.ikControler.resetAllIkTargets();
		});
		
		
		ap.signals.transformChanged.add(function(){
			//check conflict
			ap.ikControler.solveIk();
			
			//solve others
			if(!ap.ikControler.followOtherIkTargets){
				ap.ikControler.solveOtherIkTargets();
			}
			
			translateControler.onTransformChanged(scope.target);
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
			translateControler.onTransformSelectionChanged(target);
			
			if(scope.optionalControler){
				scope.optionalControler.onTransformSelectionChanged(target);
			}
			
		},undefined,1);
		
		ap.transformControls.addEventListener( 'mouseUp', function () {
			rotatationControler.onTransformFinished(scope.target);
			ap.ikControler.onTransformFinished(scope.target);
			translateControler.onTransformFinished(scope.target);
			
			if(scope.optionalControler){
				scope.optionalControler.onTransformFinished(scope.target);
			}
		});

		ap.transformControls.addEventListener( 'mouseDown', function () {
			translateControler.onTransformStarted(scope.target);
			rotatationControler.onTransformStarted(scope.target);
			
			if(scope.optionalControler){
				scope.optionalControler.onTransformStarted(scope.target);
			}
		});
		

		ap.signals.skinnedMeshChanged.dispatch(mesh);
		//add hair & hand item
		//temporary
		var index=BoneUtils.findBoneIndexByEndsName(ap.ikControler.getBoneList(),"head");
		var name=boneList[index].name;
		
		var hairContainer=ap.ikControler.boneAttachControler.getContainerByBoneName(name);
		function loadHair(){
			var hairUrl="../../../dataset/mbl3d/hairs/geometry-twelve-short.json";
			var loader = new THREE.JSONLoader();
			loader.load(
					hairUrl,

					// onLoad callback
					function ( geometry, materials ) {
						geometry.center();
						var m=new THREE.MeshPhongMaterial({color:0x694b17})
						ap.hairMesh = new THREE.Mesh( geometry,m);
						ap.hairMesh.scale.set(100,100,100);
						ap.hairMesh.position.set(0,10,0);//no way to modify so far
						hairContainer.add( ap.hairMesh );
						
						ap.hairMesh.updateMatrixWorld(true);
					}
					
					);
		}
		loadHair();
		ap.signals.ikInitialized.dispatch();
		
		ap.signals.loadingTextureStarted.dispatch();
		ap.signals.loadingTextureFinished.dispatch();
		
		}catch(e){
			console.error(e);
		}
	});
	
}
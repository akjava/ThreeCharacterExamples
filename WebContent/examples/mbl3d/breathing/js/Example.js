Example=function(application){
	var ap=application;
	
	ap.camera.position.set( 0, 10, 25 );
	ap.controls.target.set(0,10,0);
	ap.controls.update();
	
	var url="../../../dataset/mbl3d/models/anime2_female.fbx";
	
	
	var textureUrl="../../../dataset/mbl3d/texture/m_brown.png";
	
	var texture=Mbl3dUtils.loadTexture(textureUrl);
	texture.flipY = true;//FBX
	var material=new THREE.MeshPhongMaterial({color:0x888888,skinning:true,morphTargets:true,map:texture});
	
	
	function loadHair(){
		var hairUrl="../../../dataset/mbl3d/hairs/geometry-twelve-short.json";
		var loader = new THREE.JSONLoader();
		loader.load(
				hairUrl,

				// onLoad callback
				function ( geometry, materials ) {
					var m=new THREE.MeshPhongMaterial({color:0x694b17})
					application.hairMesh = new THREE.Mesh( geometry,m);
					application.hairMesh.scale.set(10,10,10);
					
					application.scene.add( application.hairMesh );
					
				}
				
				);
	}
	
	this.container=null;//add mesh too
	var boneList;
	var boxList=[];
	AppUtils.loadFbxMesh(url,function(mesh){
		mesh.geometry.computeBoundingBox();
		console.log(mesh.skeleton.bones[0].scale);
		var x=THREE.Math.degToRad(0);
		mesh.quaternion.copy(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), x));
		//TODO apply matrix
		//mesh=BoneUtils.convertToZeroRotatedBoneMesh(mesh);
		var container=new THREE.Group();
		
		ap.scene.add(container);
		this.container=container;
		
		console.log("loadFbxMesh:",url);
		mesh.scale.set(.10,.10,.10);
		mesh.material=material;
		container.add(mesh);
		console.log(mesh.parent);
		ap.skinnedMesh=mesh;
		ap.container=container;
		
		var list=BoneUtils.getBoneList(mesh);
		
		var index=0;
		list.forEach(function(bone){
			index++;
		});
		
		ap.mixer=new THREE.AnimationMixer(mesh);
		ap.clock=new THREE.Clock();
		
		mesh.updateMatrixWorld(true);
		mesh.skeleton.pose();
		ap.defaultBoneMatrix=BoneUtils.storeDefaultBoneMatrix(BoneUtils.getBoneList(mesh));
		
		ap.signals.loadingModelFinished.dispatch();
		
		loadHair();
	});
	
	var boneMatrix=new THREE.Matrix4();
	var matrixWorldInv=new THREE.Matrix4();
	ap.signals.rendered.add(function(){
		if(this.container){//wait loader's load
			
		}
	});
	
	
	
	ap.signals.rendered.add(function(){
		if(ap.mixer){
			var delta = ap.clock.getDelta();
			ap.mixer.update(delta);
			ap.skinnedMesh.updateMatrixWorld(true);
		}
	})
	ap.signals.animationStopped.add(function(){
		ap.mixer.stopAllAction();
		AnimeUtils.resetPose(ap.skinnedMesh);
		AnimeUtils.resetMorph(ap.skinnedMesh);
	});
	
	ap.signals.animationStarted.add(function(){
		ap.signals.animationStopped.dispatch();
		if(ap.enableScaleAnimation){
			ap.signals.scaleAnimationStarted.dispatch();
		}
		if(ap.enableMorphAnimation){
			ap.signals.morphAnimationStarted.dispatch();
		}
		if(ap.enableTranslateAnimation){
			ap.signals.translateAnimationStarted.dispatch();
		}
		if(ap.enableRotateAnimation){
			ap.signals.rotateAnimationStarted.dispatch();
		}
	});
}
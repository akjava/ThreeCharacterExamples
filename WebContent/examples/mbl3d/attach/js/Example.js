Example=function(application){
	var ap=application;
	
	ap.camera.position.set( 0, 100, 250 );
	ap.controls.target.set(0,100,0);
	ap.controls.update();
	
	var url="../models/anime_female1.glb";
	
	var textureUrl="../models/montage_texture2.png";
	//var textureUrl="../models/m_brown.png";
	
	var texture=Mbl3dUtils.loadTexture(textureUrl);
	var material=new THREE.MeshPhongMaterial({color:0x888888,skinning:true,morphTargets:true,map:texture,alphaTest:0.2});

	var convertToZeroRotatedBoneMesh=false;
	AppUtils.loadGltfMesh(url,function(mesh){
		if(convertToZeroRotatedBoneMesh){
			mesh=BoneUtils.convertToZeroRotatedBoneMesh(mesh);
		}
		
		
		var container=new THREE.Group();
		ap.scene.add(container);
		this.container=container;
		
		console.log("loadGltfMesh:",url);
		mesh.scale.set(100,100,100);
		mesh.material=material;
		container.add(mesh);
		ap.skinnedMesh=mesh;
		ap.container=container;
		
		ap.mixer=new THREE.AnimationMixer(mesh);
		ap.clock=new THREE.Clock();
		
		mesh.updateMatrixWorld(true);
		var boneList=BoneUtils.getBoneList(mesh);
		ap.defaultBoneMatrix=BoneUtils.storeDefaultBoneMatrix(boneList);
		
		//attacher
		ap.attachControler=new BoneAttachControler(mesh,{color:0x880000,boxSize:5});
		ap.attachControler.setVisible(true);
		this.container.add(ap.attachControler.object3d);
		ap.attachControler.update();
		
		var index=BoneUtils.findBoneIndexByEndsName(boneList,"head");
		var name=boneList[index].name;
		
		var container=ap.attachControler.getContainerByBoneName(name);
		var box=new THREE.Mesh(new THREE.BoxGeometry(10,10,10),new THREE.MeshPhongMaterial({color:0x008800}));
		container.add(box);
		
		ap.signals.skinnedMeshChanged.dispatch(mesh);
		
		//add hair & hand item
	});
	ap.signals.rendered.add(function(){
		if(ap.mixer){
			var delta = ap.clock.getDelta();
			ap.mixer.update(delta);
			ap.attachControler.update();
		}
	});
}
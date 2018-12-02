Example=function(application){
	var ap=application;
	
	ap.camera.position.set( 0, 10, 30 );
	ap.controls.target.set(0,10,0);
	ap.controls.update();
	
	var url="../../../dataset/mbl3d/models/anime2_nomorph.glb";
	
	var mesh=null;
	
	var material=new THREE.MeshPhongMaterial({color:0x888888,skinning:true});
	
	AppUtils.loadGltfMesh(url,function(mesh){
		console.log("loadGltfMesh:",url);

		mesh.scale.set(10,10,10);
		mesh.material=material;
		ap.scene.add(mesh);
		ap.skinnedMesh=mesh;
		var helper=new THREE.SkeletonHelper(mesh);
		ap.scene.add(helper);
		
		mesh.updateMatrixWorld(true);
		//keep default values.
		var boneList=BoneUtils.getBoneList(mesh);
		
		
		
		ap.defaultBoneMatrix=BoneUtils.storeDefaultBoneMatrix(boneList);
		ap.currentBoneMatrix=BoneUtils.makeEmptyBoneMatrix(boneList);
		//var name=Mbl3dUtils.shortenMbl3dBoneName(bone.name);
		
		ap.signals.loadingModelFinished.dispatch();
	});
		
}
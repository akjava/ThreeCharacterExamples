Example=function(application){
	var ap=application;
	var scale=100;
	
	ap.camera.position.set( 0, 1*scale, 2.5*scale );
	ap.controls.target.set(0,1*scale,0);
	ap.controls.update();
	
	var url="../../../dataset/mbl3d/models/anime2_nomorph.glb";
	//var url="../../../dataset/mbl3d/models/anime2_female.fbx";
	
	var material=new THREE.MeshPhongMaterial({color:0x888888,skinning:true,transparent:true,opacity:0.5});
	
	
	this.container=null;//add mesh too
	var boneList;
	var boxList=[];
	var originBoneList;
	var originBoxList=[];
	AppUtils.loadMesh(url,function(mesh){
	//AppUtils.loadGltfMesh(url,function(mesh){
		
		
		var container=new THREE.Group();
		originBoneList=BoneUtils.getBoneList(mesh);
		mesh.updateMatrixWorld(true);
		
		var bonePosition=[];
		
		originBoneList.forEach(function(bone){
			var pos=new THREE.Vector3().setFromMatrixPosition( bone.matrixWorld );
			bonePosition.push(pos);
		});
		
		var boxSize=0.05*scale;
		
		//debug green bone is ok!
		for(var i=0;i<bonePosition.length;i++){
			var cube=new THREE.Mesh( new THREE.BoxGeometry(boxSize,boxSize,boxSize), new THREE.MeshBasicMaterial( {color: 0x008800,wireframe:true} ) );
			container.add(cube);
			originBoxList.push(cube);
		};
		//TODO support origin
		
		container.add(mesh);
		
		mesh.material.visible=false;
		var originMesh=mesh;
		
		var isGltf=mesh.isGltf;
	
		mesh=BoneUtils.convertToZeroRotatedBoneMesh(originMesh);
		if(isGltf){
			
			mesh.scale.set(scale,scale,scale);
			originMesh.scale.set(scale,scale,scale);
			
		}
		boneList=BoneUtils.getBoneList(mesh);
		
		//
		
		var helper=new THREE.SkeletonHelper(mesh);
		helper.material.visible=ap.visibleSkeletonHelper;
		ap.skeletonHelper=helper;
		ap.scene.add(helper);
		
		
		
		boneList.forEach(function(bone){
			var cube=new THREE.Mesh( new THREE.BoxGeometry(boxSize,boxSize,boxSize), new THREE.MeshBasicMaterial( {color: 0x000088,wireframe:true,visible:true} ) );
			boxList.push(cube);
			cube.material.visible=false;
			container.add(cube);
		});
		
		ap.scene.add(container);
		this.container=container;
		//container.quaternion.copy(BoneUtils.makeQuaternionFromXYZDegree(45,0,0));
		//container.position.set(5,5,5);
		
		console.log("loadGltfMesh:",url);
		//mesh.scale.set(.10,.10,.10);
		mesh.material=material;
		container.add(mesh);
		ap.skinnedMesh=mesh;
		ap.container=container;
		
		
		//mesh=originMesh;
		
		ap.signals.skinnedMeshChanged.dispatch(mesh);
		//init mixer
		ap.mixer=new THREE.AnimationMixer(mesh);
		ap.clock=new THREE.Clock();
		
		ap.signals.rendered.add(function(){
			if(ap.mixer){
				var delta = ap.clock.getDelta();
				ap.mixer.update(delta);
			
				ap.skinnedMesh.updateMatrixWorld(true);
			}
		});
		
		var parentIndexs={};
		
		boneList.forEach(function(bone){
			var name=bone.name;
			var list=[];
			while(bone && bone.isBone){
				list.push(bone);
				bone=bone.parent;
			}
			parentIndexs[name]=list;
			ap.boneParentIndexs=parentIndexs;
		});
		
		
		this.boneAttachControler=new BoneAttachControler(mesh,{color: 0x880000,boxSize:0.05*scale});
		this.boneAttachControler.setVisible(true);
		this.boneAttachControler.updateAll=true;
		this.container.add(this.boneAttachControler.object3d);

	});
	
	

	
	
	var boneMatrix=new THREE.Matrix4();
	var matrixWorldInv=new THREE.Matrix4();
	ap.signals.rendered.add(function(){
		
		if(this.boneAttachControler){
			boneAttachControler.update();
		}
		
		if(this.container){//wait loader's load
			
			matrixWorldInv.getInverse( this.container.matrixWorld );
			
			for(var i=0;i<boneList.length;i++){
				cube=boxList[i];
				bone=boneList[i];
				bone.updateMatrixWorld(true);
				
				boneMatrix.multiplyMatrices( matrixWorldInv, bone.matrixWorld );
				
				
				cube.matrixWorld.multiplyMatrices(cube.matrix,boneMatrix);
				
				
				boneMatrix.multiplyMatrices( matrixWorldInv, bone.matrixWorld );
				cube.position.setFromMatrixPosition(boneMatrix );
				cube.rotation.setFromRotationMatrix(boneMatrix);
				
				cube.updateMatrixWorld(true);
				
			}
			
			for(var i=0;i<originBoneList.length;i++){
				cube=originBoxList[i];
				bone=originBoneList[i];
				bone.updateMatrixWorld(true);
				
				boneMatrix.multiplyMatrices( matrixWorldInv, bone.matrixWorld );
				cube.position.setFromMatrixPosition(boneMatrix );
				cube.rotation.setFromRotationMatrix(boneMatrix);
				
				cube.updateMatrixWorld(true);
			}
		}
	});
	
	ap.signals.boxVisibleChanged.add(function(){
		boxList.forEach(function(box){
			box.material.visible=ap.visibleBone;
		});
		originBoxList.forEach(function(box){
			box.material.visible=ap.visibleOriginBone;
		});
	})
	

	 application.signals.boneAnimationIndexChanged.add(function(index){
		
		var boneList=BoneUtils.getBoneList(ap.skinnedMesh);

		ap.selectedBone=boneList[index];
		console.log(ap.selectedBone);
	 });
	

}
Example=function(application){
	var ap=application;
	
	ap.camera.position.set( 0, 10, 30 );
	ap.controls.target.set(0,10,0);
	ap.controls.update();
	
	var url="../../../dataset/mbl3d/models/anime2_nomorph.glb";
	
	var material=new THREE.MeshPhongMaterial({color:0x888888,skinning:true,transparent:true,opacity:0.5});
	
	
	this.container=null;//add mesh too
	var boneList;
	var boxList=[];
	AppUtils.loadGltfMesh(url,function(mesh){
		
		var container=new THREE.Group();
		boneList=BoneUtils.getBoneList(mesh);
		boneList.forEach(function(bone){
			var cube=new THREE.Mesh( new THREE.SphereGeometry(.1,.1,.1), new THREE.MeshBasicMaterial( {color: 0x880000} ) );
			boxList.push(cube);
			container.add(cube);
		});
		
		ap.scene.add(container);
		this.container=container;
		//container.quaternion.copy(BoneUtils.makeQuaternionFromXYZDegree(45,0,0));
		//container.position.set(5,5,5);
		
		console.log("loadGltfMesh:",url);
		mesh.scale.set(10,10,10);
		mesh.material=material;
		container.add(mesh);
		ap.skinnedMesh=mesh;
		ap.container=container;
	});
	
	var boneMatrix=new THREE.Matrix4();
	var matrixWorldInv=new THREE.Matrix4();
	ap.signals.rendered.add(function(){
		if(this.container){//wait loader's load
			
			matrixWorldInv.getInverse( this.container.matrixWorld );
		
			for(var i=0;i<boneList.length;i++){
				cube=boxList[i];
				bone=boneList[i];
				
				boneMatrix.multiplyMatrices( matrixWorldInv, bone.matrixWorld );
				cube.position.setFromMatrixPosition( boneMatrix );
				
			}
		}
	});
}
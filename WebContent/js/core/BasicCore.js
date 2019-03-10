var BasicCore = function ( ap ) {
	MinCore.call(this,ap);
	
	ap.signals.loadingModelStarted.add(function(url,fileName){
		if(ap.skinnedMesh!=null && ap.skinnedMesh.parent!=null){
			ap.skinnedMesh.parent.remove(ap.skinnedMesh);
		}
		if(fileName){
			ap.modelFileName=fileName;
		}else{
			ap.modelFileName=url;
		}
		AppUtils.loadMesh(url,function(mesh){
			try{
			var isGltf=mesh.isGltf;//set before convert
			ap.isGltf=isGltf;
			
			if(ap.convertToZeroRotatedBoneMesh){
				mesh=BoneUtils.convertToZeroRotatedBoneMesh(mesh);
			}
			
			
			//TODO check and set
			mesh.scale.set(100,100,100);
			if(ap.convertBoneEulerOrders){
				Mbl3dUtils.changeBoneEulerOrders(mesh);//Euler XYZ	
			}
			
			
			ap.root.add(mesh);
			ap.skinnedMesh=mesh;
			ap.signals.loadingModelFinished.dispatch(mesh);
			}catch(e){
				console.log(e);
			}
			
		},fileName);
	});
	
	return ap.core;
}
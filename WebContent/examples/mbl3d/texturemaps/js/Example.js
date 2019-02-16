Example=function(application){
	var ap=application;
	
	//default camera
	ap.camera.position.set( 0, 100, 250 );
	ap.controls.target.set(0,100,0);
	ap.controls.update();
	
	var url="../../../dataset/mbl3d/models/anime2_female_modifybreast.fbx";
	ap.modelUrl=ap.defaultModelUrl==undefined?url:ap.defaultModelUrl; //defaultModelUrl set by sidebar

	//simple light
	//light
	/*var light = new THREE.DirectionalLight(0xaaaaaa);
	light.position.set(100, 100, 100);
	ap.scene.add(light);
	var light2 = new THREE.DirectionalLight(0xaaaaaa);
	light2.position.set(-100, -100, -100);
	ap.scene.add(light2);
	
	ap.scene.add(new THREE.AmbientLight(0x666666));*/
	
	//sidebar.Hair
	application.signals.loadingHairFinished.add(function(hair){
		//initialized when loadingModelFinished
		ap.boneAttachControler.getContainerByBoneEndName("head").add(hair);
	});
	
	
	//sidebar.texture	
	application.signals.materialChanged.add(function(){
		
		//var material=new THREE.MeshPhongMaterial({skinning:true,morphTargets:true,transparent:true,alphaTest:0.6});
		 var material = new window['THREE'][application.materialType](
				 {skinning: true,morphTargets:true ,transparent:true,alphaTest:0.6,wireframe:application.materialWireframe} 
				 );
		
		material.color.set(ap.color);
		material.shininess=ap.shininess;
		
		material.displacementScale=ap.displacementScale;
		material.bumpScale=ap.bumpScale;
		material.displacementBias=ap.displacementBias;
		material.emissiveIntensity=ap.emissiveIntensity;
		material.emissive.set(ap.emissive);
		material.specular.set(ap.specular);
		material.aoMapIntensity=ap.aoIntensity;
		//TODO normalmap
		
		
		
		Object.keys(ap.textures).forEach(function(key){
			
			var texture=ap.textures[key];
			//reset here
			if(texture!=null && texture!==undefined){
				if(ap.isGltf){
					texture.flipY = false;
				}else{
					texture.flipY = true;//FBX
				}
				texture.needsUpdate=true;
			}
			
			
			material[key]=texture;
		});
		
		material.needsUpdate=true;
		
		ap.skinnedMesh.material=material;
	});
	
	
	
	ap.signals.loadingModelFinished.add(function(mesh){
		if(ap.boneAttachControler!=null){
			ap.boneAttachControler.dispose();
		}
		ap.boneAttachControler=new BoneAttachControler(mesh);
		ap.boneAttachControler.setParentObject(ap.root);
		
		ap.mixer=undefined;
		
	},undefined,100);//call at first
	
	ap.signals.rendered.add(function(){
		if(ap.boneAttachControler){
			ap.boneAttachControler.update(true);
		}
	},undefined,-1);//call later
	
	ap.signals.loadingModelFinished.add(function(mesh){
		var geometry=mesh.geometry;
		if(geometry.isGeometry){
			geometry.faceVertexUvs.push(geometry.faceVertexUvs[0]);
		}else{
			geometry.attributes.uv2 = geometry.attributes.uv
		}
		//for aoMap
		
		});
	
	ap.signals.loadingModelStarted.dispatch(ap.modelUrl);
}
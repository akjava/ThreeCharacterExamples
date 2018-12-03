Example=function(application){
	var ap=application;
	var scope=this;
	
	ap.camera.position.set( 0, 150, 220 );
	ap.controls.target.set(0,100,0);
	ap.controls.update();
	
	AppUtils.decoderPath="../../libs/draco/gltf/";
	
	/*
	 * draco totally difference vertex order.
	 */
	var url="../../../dataset/mbl3d/models/anime2_nomorph.glb";//anime2_nomorph//breast-middle
	//var url3="../../../dataset/mbl3d/models/leg-max.glb";
	var url2="../../../dataset/mbl3d/models/edithip.glb";
	var textureUrl="../../../dataset/mbl3d/texture/m_brown.png";
	
	var texture=Mbl3dUtils.loadTexture(textureUrl);
	var material=new THREE.MeshPhongMaterial({color:0x888888,skinning:true,morphTargets:true,morphNormals:true,map:texture,alphaTest:0.2});
	
	AppUtils.loadGltfMesh(url,function(mesh){
		console.log("loadGltfMesh:",url);
		mesh.scale.set(100,100,100);
		mesh.material=material;
		ap.skinnedMesh=mesh;
		
		
		
		
		//for later add
		function initMorphTargetsValues(mesh){
			if(mesh.geometry.morphAttributes==undefined ){
				mesh.geometry.morphAttributes={position:[],normal:[]};
			}else {
				if(mesh.geometry.morphAttributes.position==undefined ){
				mesh.geometry.morphAttributes.position=[];
				mesh.geometry.morphAttributes.normal=[];
				}
			}
			if(mesh.morphTargetInfluences==undefined){
				mesh.morphTargetInfluences=[];
			}
			if(mesh.morphTargetDictionary==undefined){
				mesh.morphTargetDictionary={};
			}	
		}
		initMorphTargetsValues(mesh);
		

		AppUtils.loadGltfMesh(url2,function(mesh2){
			var position=mesh2.geometry.attributes.position;
			var normal=mesh2.geometry.attributes.normal;
			
			mesh.geometry.morphAttributes.position.push(position);
			mesh.geometry.morphAttributes.normal.push(normal);
			
			mesh.morphTargetInfluences.push(0);
			mesh.morphTargetDictionary.breast_min=mesh.morphTargetInfluences.length-1;
			
			
			
			ap.scene.add(mesh);//important add last,or render cache morphtarget info.alternative way is create from geometry
		
			ap.mixer=new THREE.AnimationMixer(mesh);
			ap.clock=new THREE.Clock();
		});
//			
//			AppUtils.loadGltfMesh(url3,function(mesh3){
//				var position=mesh3.geometry.attributes.position;
//				var normal=mesh3.geometry.attributes.normal;
//				console.log(position);
//				morphAttributes.position.push(position);
//				morphAttributes.normal.push(normal);
//				
//				morphTargetInfluences.push(0);
//				morphTargetDictionary.breast_max=1;
//				
//				mesh.geometry.morphAttributes=morphAttributes;
//				mesh.morphTargetInfluences=morphTargetInfluences;
//				mesh.morphTargetDictionary=morphTargetDictionary;
//				
//				ap.scene.add(mesh);//important add last
//			});
//			
//			//it safe add before start rendering,some trick work on r98 do at once
//			
//		});
	});
	
	ap.signals.rendered.add(function(){
		if(ap.mixer){
			var delta = ap.clock.getDelta();
			ap.mixer.update(delta);
		}
	})
}
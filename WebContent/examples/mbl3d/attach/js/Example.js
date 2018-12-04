Example=function(application){
	var ap=application;
	
	ap.camera.position.set( 0, 100, 250 );
	ap.controls.target.set(0,100,0);
	ap.controls.update();
	
	AppUtils.decoderPath="../../libs/draco/gltf/";
	var url="../../../dataset/mbl3d/models/anime2_nomorph_draco.glb";
	
	var textureUrl="../../../dataset/mbl3d/texture/m_brown.png";
	//var textureUrl="../models/m_brown.png";
	
	var texture=Mbl3dUtils.loadTexture(textureUrl);
	var material=new THREE.MeshPhongMaterial({color:0x888888,skinning:true,morphTargets:true,map:texture,alphaTest:0.2});

	var convertToZeroRotatedBoneMesh=true;
	AppUtils.loadGltfMesh(url,function(mesh){
		if(convertToZeroRotatedBoneMesh){
			mesh=BoneUtils.convertToZeroRotatedBoneMesh(mesh);
		}
		mesh.normalizeSkinWeights();
		
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
		ap.attachControler=new BoneAttachControler(mesh,{color:0x880000,boxSize:1});
		ap.attachControler.setVisible(false);
		this.container.add(ap.attachControler.object3d);
		ap.attachControler.update();
		
		var index=BoneUtils.findBoneIndexByEndsName(boneList,"head");
		var name=boneList[index].name;
		
		var container=ap.attachControler.getContainerByBoneName(name);
		var box=new THREE.Mesh(new THREE.BoxGeometry(10,10,10),new THREE.MeshPhongMaterial({color:0x008800}));
		;
		
		
		ap.signals.skinnedMeshChanged.dispatch(mesh);
		
		//add hair & hand item
		function loadHair(){
			var hairUrl="../../../dataset/mbl3d/hairs/geometry-twelve-short.json";
			var loader = new THREE.JSONLoader();
			loader.load(
					hairUrl,

					// onLoad callback
					function ( geometry, materials ) {
						geometry.center();
						var m=new THREE.MeshPhongMaterial({color:0x694b17})
						application.hairMesh = new THREE.Mesh( geometry,m);
						application.hairMesh.scale.set(100,100,100);
						application.hairMesh.position.set(0,10,0);
						container.add( application.hairMesh );
						
						application.hairMesh.updateMatrix();
						application.hairMesh.updateMatrixWorld(true);
					}
					
					);
		}
		loadHair();
		
		//add hand item
		var geo=new THREE.BoxGeometry(1,16,1);
		//geo.translate(6,10,3);
		//geo.rotateX(THREE.Math.degToRad(90));
		var stick=new THREE.Mesh(geo,new THREE.MeshPhongMaterial({color:0x000088}));
		var index2=BoneUtils.findBoneIndexByEndsName(boneList,"hand_L");
		var container2=ap.attachControler.getContainerByBoneName(boneList[index2].name);
	
		stick.position.set(6,-3,10);
		
		var xq=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.Math.degToRad(90));
		stick.quaternion.copy(xq);
		//stick.matrixAutoUpdate=false;
		//
		
		
		stick.updateMatrix();
		container2.add(stick);
		ap.stick=stick;
		
		function makePoseByEndsName(boneList,name,x,y,z,object){
			var index=BoneUtils.findBoneIndexByEndsName(boneList,name);
			if(index==-1){
				console.log("makePoseByEndsName:not found ",name);
				return null;
			}
			var key=String(index);
			
			object[key]=BoneUtils.makeQuaternionFromXYZDegree(x,y,z);
			return object;
		}
		//for default pose TODO load from clip
		//console.log(boneList);
		var obj={};
		var boneList=BoneUtils.getBoneList(ap.skinnedMesh);
	
		makePoseByEndsName(boneList,"lowerarm_L",0,-85,0,obj);
		makePoseByEndsName(boneList,"upperarm_L",0,0,-75,obj);
		makePoseByEndsName(boneList,"clavicle_R",0,0,-45,obj);
		makePoseByEndsName(boneList,"upperarm_R",0,0,-45,obj);
		makePoseByEndsName(boneList,"lowerarm_R",-60,0,0,obj);
		makePoseByEndsName(boneList,"pelvis",0,45,0,obj);
		makePoseByEndsName(boneList,"spine03",0,-15,0,obj);
		makePoseByEndsName(boneList,"spine02",0,-15,0,obj);
		makePoseByEndsName(boneList,"spine01",0,-15,0,obj);
		
		makePoseByEndsName(boneList,"thigh_L",-90,0,0,obj);
		makePoseByEndsName(boneList,"calf_L",90,0,0,obj);
		makePoseByEndsName(boneList,"thigh_R",0,-45,0,obj);
		makePoseByEndsName(boneList,"calf_R",120,0,0,obj);
		
		//glip hand
		makePoseByEndsName(boneList,"index03_L",0,0,-80,obj);
		makePoseByEndsName(boneList,"index02_L",0,0,-75,obj);
		makePoseByEndsName(boneList,"index01_L",0,0,-60,obj);
		makePoseByEndsName(boneList,"middle03_L",0,0,-85,obj);
		makePoseByEndsName(boneList,"middle02_L",0,0,-75,obj);
		makePoseByEndsName(boneList,"middle01_L",0,0,-60,obj);
		makePoseByEndsName(boneList,"ring03_L",0,0,-90,obj);
		makePoseByEndsName(boneList,"ring02_L",0,0,-75,obj);
		makePoseByEndsName(boneList,"ring01_L",0,0,-60,obj);
		makePoseByEndsName(boneList,"pinky03_L",0,0,-95,obj);
		makePoseByEndsName(boneList,"pinky02_L",0,0,-75,obj);
		makePoseByEndsName(boneList,"pinky01_L",0,0,-60,obj);
		
		makePoseByEndsName(boneList,"thumb03_L",45,30,-45,obj);
		makePoseByEndsName(boneList,"thumb02_L",90,0,0,obj);
		makePoseByEndsName(boneList,"thumb01_L",0,0,25,obj);
		var rot=new THREE.Euler();
		Object.keys(obj).forEach(function(key){
			//console.log(key);
			rot.setFromQuaternion(obj[key]);
			ap.currentBoneMatrix[boneList[key].name].rotation=rot.clone();
		});
		ap.signals.boneAnimationFinished.dispatch();
	});
	ap.signals.renderStarted.add(function(){
		if(ap.mixer){
			var delta = ap.clock.getDelta();
			ap.mixer.update(delta);
		}
		if(ap.attachControler){
			ap.attachControler.update();
		}
	});
	ap.signals.rendered.add(function(){
		

	});
}
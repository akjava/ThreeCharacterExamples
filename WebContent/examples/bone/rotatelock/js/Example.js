Example=function(application){
	var ap=application;
	var scope=this;
	var scale=100;
	
	ap.camera.position.set( 0, 1*scale, 2.5*scale );
	ap.controls.target.set(0,1*scale,0);
	ap.controls.update();
	
	//var url="../../../dataset/mbl3d/models/anime2_nomorph.glb";
	var url="../../../dataset/mbl3d/models/anime2_female.fbx";
	
	var material=new THREE.MeshPhongMaterial({color:0x888888,skinning:true,transparent:false,opacity:1,depthTest: true});
	
	
	this.container=null;//add mesh here
	var boneList;
	
	ap.signals.transformChanged.add(function(){
		console.log(ap.transformControls.axis);//null,X,Y,Z
	});

	
	AppUtils.loadMesh(url,function(mesh){
		console.log("loadGltfMesh:",url);
		var container=new THREE.Group();
		this.container=container;//try to not modify Application.js
		ap.scene.add(container);
		ap.container=container;
		
		var isGltf=mesh.isGltf;//set before convert
		
		//mesh part,modify bone and try to same size both glb & fbx
		mesh=BoneUtils.convertToZeroRotatedBoneMesh(mesh);
		mesh.normalizeSkinWeights();
		mesh.material=material;
		mesh.renderOrder = 0;
		container.add(mesh);
		ap.skinnedMesh=mesh;
		
		
		
		if(isGltf){
			mesh.scale.set(scale,scale,scale);
		}
		boneList=BoneUtils.getBoneList(mesh);
		
		ap.signals.skinnedMeshChanged.dispatch(mesh);
		
		
		
		
		
		
		
		//init mixer
		ap.mixer=new THREE.AnimationMixer(mesh);
		ap.clock=new THREE.Clock();
		
		ap.signals.rendered.add(function(){
			if(ap.mixer){
				var delta = ap.clock.getDelta();
				ap.mixer.update(delta);
			}
		});
		
		//init attach controler
		var boxSize=0.05*scale;
		scope.boneAttachControler=new BoneAttachControler(mesh,{color: 0x008800,boxSize:boxSize});
		scope.boneAttachControler.setVisible(false);
		
		this.container.add(scope.boneAttachControler.object3d);
		
		
		//link to bone
		var index=0;
		boneList.forEach(function(bone){
			if(!Mbl3dUtils.isFingerBoneName(bone.name) && !Mbl3dUtils.isTwistBoneName(bone.name)){
				//console.log("false",bone.name);
				//THREE.SphereGeometry(2)
				var sphere=new THREE.Mesh(new THREE.SphereGeometry(2),new THREE.MeshBasicMaterial({color:0x880000,depthTest:false,transparent:true,opacity:.5}));
				scope.boneAttachControler.containerList[index].add(sphere);
				sphere.boneIndex=index;
				sphere.quaternion.copy(boneList[index].quaternion);
				var cbone=index;
				var enableFire=true;
				sphere.quaternion.onChange(function(){
					if(enableFire){
					ap.skinnedMesh.skeleton.bones[cbone].quaternion.copy( sphere.quaternion);
					}
					ap.signals.boneRotationChanged.dispatch(cbone);
				});
				ap.skinnedMesh.skeleton.bones[cbone].quaternion.onChange(function(){
					var quaternion=ap.skinnedMesh.skeleton.bones[cbone].quaternion;
					ap.skinnedMesh.skeleton.bones[cbone].rotation.setFromQuaternion( quaternion, undefined, false );
					enableFire=false;
					sphere.quaternion.copy(quaternion);
					enableFire=true;
					
				});
				ap.objects.push(sphere);
			}
			index++;
		});
		

		
		
		
		ap.signals.transformSelectionChanged.add(function(target){
			if(target==null){
				ap.transformControls.detach();
			}else{
				ap.transformControls.setMode( "rotate" );
				ap.transformControls.attach(target);
				var boneIndex=target.boneIndex;
				ap.signals.boneSelectionChanged.dispatch(boneIndex);
			}
		});
		

	});
	
	

	
	
	var boneMatrix=new THREE.Matrix4();
	var matrixWorldInv=new THREE.Matrix4();
	ap.signals.rendered.add(function(){
		
		if(scope.boneAttachControler){
			scope.boneAttachControler.update();
			
		}
		
	});
	
	

}
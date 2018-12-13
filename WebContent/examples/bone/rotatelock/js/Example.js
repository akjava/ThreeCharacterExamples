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
	var lastEuler=new THREE.Euler();
	ap.signals.transformChanged.add(function(){
		//console.log(ap.transformControls.axis);//null,X,Y,Z
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
		
		//var lastQ=new THREE.Quaternion();
		var rotationControls={};
		//link to bone
		var index=0;
		

		
		boneList.forEach(function(bone){
			if(!Mbl3dUtils.isFingerBoneName(bone.name) && !Mbl3dUtils.isTwistBoneName(bone.name)){
				//console.log("false",bone.name);
				//THREE.SphereGeometry(2)
				var sphere=new THREE.Mesh(new THREE.SphereGeometry(2),new THREE.MeshBasicMaterial({color:0x880000,depthTest:false,transparent:true,opacity:.5}));
				rotationControls[bone.name]=sphere;
				scope.boneAttachControler.containerList[index].add(sphere);
				sphere.boneIndex=index;
				sphere.quaternion.copy(boneList[index].quaternion);
				var cbone=index;
				
				var q=new THREE.Quaternion();
				var e=new THREE.Euler();
				var matrix = new THREE.Matrix4();

				sphere.quaternion.onChange(function(){
					console.log("sphere.quaternion.onChange");
					var tmp1=new THREE.Euler().setFromQuaternion(ap.skinnedMesh.skeleton.bones[cbone].quaternion);
					AppUtils.printDeg(tmp1,"bone-q");
					
					//var tmp2=new THREE.Euler().setFromQuaternion(lastQ);
					//AppUtils.printDeg(tmp2,"lastQ");
					
					
					var tmp3=new THREE.Euler().setFromQuaternion(sphere.quaternion);
					AppUtils.printDeg(tmp3,"sphere-q");
					
					//var inverse=q.copy(ap.skinnedMesh.skeleton.bones[cbone].quaternion).inverse();
					//var inverse=q.copy(lastQ).inverse();
					//var tmp4=new THREE.Euler().setFromQuaternion(inverse);
					//AppUtils.printDeg(tmp4,"inverse");
					
					//var diff=inverse.multiply(sphere.quaternion);
					
					//var tmp5=new THREE.Euler().setFromQuaternion(diff);
					//AppUtils.printDeg(tmp5,"diff");
					var euler=e.setFromQuaternion(sphere.quaternion);
					//var euler=e.setFromQuaternion(diff);
					//console.log(euler.x,euler.y,euler.z);
					//var r=ap.skinnedMesh.skeleton.bones[cbone].rotation;
					var r=lastEuler;
					var max=Math.abs(euler.x);
					if(euler.y>max){
						max=Math.abs(euler.y);
					}
					if(euler.z>max){
						max=Math.abs(euler.z);
					}
					
					//AppUtils.printDeg(euler,"diff");
					if(max>THREE.Math.degToRad(180)){
						AppUtils.printDeg(ap.skinnedMesh.skeleton.bones[cbone].rotation,"bone-r");
						var tmp=new THREE.Euler().setFromQuaternion(sphere.quaternion);
						AppUtils.printDeg(tmp,"sphere-r");
						
						console.log("ignore over move",max,euler.x,euler.y,euler.z);
						sphere.enableFire=false;
						var rotation=ap.skinnedMesh.skeleton.bones[cbone].rotation;//copy back
						//sphere.rotation.copy(rotation);
						//lastQ.copy(sphere.quaternion);
						sphere.enableFire=true;
						return;
					}else{
						AppUtils.printDeg(euler,"added");
						euler.set(euler.x+r.x,euler.y+r.y,euler.z+r.z);
						//enableFire=false;
						var rotation=ap.skinnedMesh.skeleton.bones[cbone].rotation;
						rotation.copy(euler);
						ap.signals.boneRotationChanged.dispatch(cbone);
						//sphere.rotation.copy(euler);//update local-q & bone-rotate&q;
					}
					
					//enableFire=true;
				});
				/*sphere.rotation.onChange(function(){
					console.log("sphere.rotation.onChange");
					matrix.makeRotationFromEuler( sphere.rotation );
					sphere.quaternion.setFromEuler( sphere.rotation, false );
					if(sphere.enableFire){
						ap.skinnedMesh.skeleton.bones[cbone].rotation.setFromRotationMatrix( matrix, undefined, false );
						ap.skinnedMesh.skeleton.bones[cbone].quaternion.setFromRotationMatrix( matrix, undefined, false );
					}else{
						console.log("not fire");
					}
					ap.signals.boneRotationChanged.dispatch(cbone);
					
					AppUtils.printDeg(ap.skinnedMesh.skeleton.bones[cbone].rotation,"final-bone-r");
					AppUtils.printDeg(sphere.rotation,"final-sphere-r");
				});*/
				/*ap.skinnedMesh.skeleton.bones[cbone].rotation.onChange(function(){
					console.log("bone.rotation.onChange");
					var rotation=ap.skinnedMesh.skeleton.bones[cbone].rotation;
					ap.skinnedMesh.skeleton.bones[cbone].quaternion.setFromEuler( rotation, undefined, false );
					sphere.enableFire=false;
					sphere.rotation.copy(rotation);
					sphere.enableFire=true;
					
					
					
				});*/
				ap.objects.push(sphere);
			}
			index++;
		});
		

		
		this.boneIndex;
		
		ap.signals.transformSelectionChanged.add(function(target){
			if(target==null){
				ap.transformControls.detach();
			}else{
				ap.transformControls.setMode( "rotate" );
				ap.transformControls.attach(target);
				var boneIndex=target.boneIndex;
				scope.boneIndex=boneIndex;
				ap.signals.boneSelectionChanged.dispatch(boneIndex);
				
				var bone=scope.boneAttachControler.boneList[boneIndex];
				var rotC=rotationControls[bone.name];
				
				rotC.enableFire=false;
				rotC.rotation.set(0,0,0);
				//rotC.quaternion.setFromEuler( bone.rotation, false );
				rotC.enableFire=true;
				//lastQ.copy(rotC.quaternion);
				lastEuler.copy(bone.rotation);
				
				AppUtils.printDeg(rotC.rotation,"attached");
			}
		});
		
		ap.transformControls.addEventListener( 'mouseUp', function () {
			var bone=scope.boneAttachControler.boneList[scope.boneIndex];
			lastEuler.copy(bone.rotation);
			var rotC=rotationControls[bone.name];
			rotC.rotation.set(0,0,0);
		});

		ap.transformControls.addEventListener( 'mouseDown', function () {
			var bone=scope.boneAttachControler.boneList[scope.boneIndex];
			lastEuler.copy(bone.rotation);
			var rotC=rotationControls[bone.name];
			rotC.rotation.set(0,0,0);
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
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

	
	var geo = new THREE.EdgesGeometry( new THREE.BoxGeometry(5,5,5) ); // or WireframeGeometry( geometry )

	var mat = new THREE.LineBasicMaterial( { color: 0xaaaaaa, linewidth: 2,transparent:true,opacity:1.0,depthTest:false,visible:false } );

	this.wireframe = new THREE.LineSegments( geo, mat );

	ap.scene.add( this.wireframe );
	
	
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
		console.log("boneAttachControler initialized");
		window.onerror = function(e) { console.error(e) }
		
		ap.ikControler.boneAttachControler=scope.boneAttachControler;
		ap.signals.boneSelectionChanged.add(function(index){
			ap.ikControler.boneSelectedIndex=index;
		});
		
		ap.signals.poseChanged.add(function(){
			ap.ikControler.resetAllIkTargets();
		});
		
		if(!ap.signals.solveIkCalled){
			console.error("Ik need ap.signals.solveIkCalled");
		}
		ap.signals.solveIkCalled.add(function(){
			ap.ikControler.solveIk(true);
		});
		ap.signals.boneRotationChanged.add(function(){
			ap.ikControler.resetAllIkTargets();
		});
		
		ap.signals.transformChanged.add(function(){
			//check conflict
			ap.ikControler.solveIk();
		});
		var mbl3dik=new Mbl3dIk(ap);
		ap.ikControler.ikTargets=mbl3dik.ikTargets;
		
		var rotationControls={};
		var index=0;
		

		var e=new THREE.Euler();
		boneList.forEach(function(bone){
			if(!Mbl3dUtils.isFingerBoneName(bone.name) && !Mbl3dUtils.isTwistBoneName(bone.name)){
				var sphere=new THREE.Mesh(new THREE.SphereGeometry(2),new THREE.MeshBasicMaterial({color:0x880000,depthTest:false,transparent:true,opacity:.5}));
				rotationControls[bone.name]=sphere;
				scope.boneAttachControler.containerList[index].add(sphere);
				sphere.boneIndex=index;
				sphere.quaternion.copy(boneList[index].quaternion);
				var cbone=index;
				
				sphere.quaternion.onChange(function(){
					var euler=e.setFromQuaternion(sphere.quaternion);

					var r=lastEuler;
					var max=Math.abs(euler.x);
					if(euler.y>max){
						max=Math.abs(euler.y);
					}
					if(euler.z>max){
						max=Math.abs(euler.z);
					}
					
					//TODO limit
					euler.set(euler.x+r.x,euler.y+r.y,euler.z+r.z);
					var rotation=ap.skinnedMesh.skeleton.bones[cbone].rotation;
					rotation.copy(euler);
					ap.signals.boneRotationChanged.dispatch(cbone);
					
				});
				ap.objects.push(sphere);
			}
			index++;
		});
		

		
		this.boneIndex=0;
		
		function refreshSphere(){
			var bone=scope.boneAttachControler.boneList[scope.boneIndex];
			lastEuler.copy(bone.rotation);
			var rotC=rotationControls[bone.name];
			rotC.rotation.set(0,0,0);
		}
		
		ap.signals.transformSelectionChanged.add(function(target){
			if(target==null){
				ap.transformControls.detach();
				
				//ik null selection
				ap.ikControler.ikIndices=null;
				ap.ikControler.ikTarget=null;
				
				scope.wireframe.material.visible=false;
			}else{
				if(target.ikName){
					//ik selected
					ap.transformControls.setMode( "translate" );
					ap.ikControler.ikTarget=target;
					ap.ikControler.ikIndices=ap.ikControler.iks[target.ikName];
					ap.transformControls.attach(target);
					
					
					scope.wireframe.material.visible=false;//for rotate
				}else{
					//not ik selected
					ap.ikControler.ikIndices=null;
					ap.ikControler.ikTarget=null;
					
					ap.transformControls.setMode( "rotate" );
					ap.transformControls.attach(target);
					var boneIndex=target.boneIndex;
					scope.boneIndex=boneIndex;
					ap.signals.boneSelectionChanged.dispatch(boneIndex);
					
					refreshSphere();
					
					scope.wireframe.position.copy(scope.boneAttachControler.containerList[boneIndex].position);
					scope.wireframe.material.visible=true;
				}
				
				
			}
		});
		
		ap.transformControls.addEventListener( 'mouseUp', function () {
			scope.wireframe.material.color.set(0xaaaaaa);
			refreshSphere();
		});

		ap.transformControls.addEventListener( 'mouseDown', function () {
			scope.wireframe.material.color.set(0xffffff);
			refreshSphere();
		});
		

	});
	
	

	
	
	ap.signals.rendered.add(function(){
		
		if(scope.boneAttachControler){
			scope.boneAttachControler.update();
			
		}
		
	});
	
	

}
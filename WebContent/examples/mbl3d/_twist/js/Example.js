Example=function(application){
	var ap=application;
	var scope=this;
	var scale=100;
	
	ap.camera.position.set( 0, 1*scale, 2.5*scale );
	ap.controls.target.set(0,1*scale,0);
	ap.controls.update();
	
	//var url="../../../dataset/mbl3d/models/anime2_nomorph.glb";
	var url="../../../dataset/mbl3d/models/anime2_female.fbx";
	
	var textureUrl="../../../dataset/mbl3d/texture/uv_2048.png";
	//var textureUrl="../../../dataset/mbl3d/texture/m_brown.png";
	
	var texture=Mbl3dUtils.loadTexture(textureUrl);
	texture.flipY = true;//FBX
	var meshMaterial=new THREE.MeshPhongMaterial({color:0x888888,skinning:true,morphTargets:true,map:texture});
	
	var material=new THREE.MeshPhongMaterial({color:0x888888,skinning:true,transparent:false,opacity:1,depthTest: true});
	
	
	this.container=null;//add mesh here
	var boneList;
	

	
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
		mesh.material=meshMaterial;
		mesh.renderOrder = 0;
		container.add(mesh);
		ap.skinnedMesh=mesh;
		
		console.log(mesh);
		
		mesh.scale.set(scale,scale,scale);
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
		
		
		//link to bone quaternion base
		var index=0;
		boneList.forEach(function(bone){
			if(!Mbl3dUtils.isFingerBoneName(bone.name) && !Mbl3dUtils.isTwistBoneName(bone.name)){
				//console.log("false",bone.name);
				//THREE.SphereGeometry(2)
				var sphere=new THREE.Mesh(new THREE.SphereGeometry(2),new THREE.MeshBasicMaterial({color:0x880000,depthTest:false,transparent:true,opacity:.5}));
				sphere.renderOrder=100;
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
		
		

		
		function resetIkPosition(name){
			var target=ikTargets[name];
			var indices=ap.iks[name];
			var index=indices[indices.length-1];
			target.position.copy(scope.boneAttachControler.containerList[index].position);
		}
		
		ap.signals.poseChanged.add(function(){
			scope.boneAttachControler.update();
			Object.keys(ikTargets).forEach(function(key){
				resetIkPosition(key);
			});
		});
		
		var ikTargets={};
		
		function registIk(ikName,jointNames){
			var indices=[];
			ap.iks[ikName]=indices;
			jointNames.forEach(function(name){
				var index=BoneUtils.findBoneIndexByEndsName(boneList,name);
				if(index==-1){
					console.error("registIk:bone not contain,"+name);
				}
				indices.push(index);
			});
			var ikBox=new THREE.Mesh(new THREE.BoxGeometry(5,5,5),new THREE.MeshBasicMaterial({color:0x880000,depthTest:false,transparent:true,opacity:.5}));
			ikBox.renderOrder = 1;
			ikBox.material.visible=false;
			var index=indices.length-1;
			ikBox.position.copy(scope.boneAttachControler.containerList[indices[indices.length-1]].position);
			ikBox.ikName=ikName;
			
			ap.objects.push(ikBox);
			
			ikTargets[ikName]=ikBox;
			ap.scene.add(ikBox);
		}
		
		
		//initialize ik
		ap.iks={};
		ap.ikTarget=null;
		ap.ikIndices=null;
		
		//TODO support end-site-ik
		/*registIk("head",["spine01","spine02","spine03","neck","head"]);
		registIk("leftArm",["upperarm_L","lowerarm_L","hand_L"]);
		registIk("rightArm",["upperarm_R","lowerarm_R","hand_R"]);
		registIk("leftLeg",["thigh_L","calf_L","foot_L"]);
		registIk("rightLeg",["thigh_R","calf_R","foot_R"]);*/
		
		
		
		
		
		
		ap.signals.transformSelectionChanged.add(function(target){
			
			if(target!=null && target.ikName){
				ap.ikTarget=target;
				console.log("ik selected");
			}
			
			
			
			if(target==null){
				ap.ikIndices=null;
				ap.transformControls.detach();
			}else{
				if(target.ikName){
					ap.ikIndices=ap.iks[target.ikName];
					ap.transformControls.setMode( "translate" );
					ap.transformControls.attach(target);
				}else{//bone
					ap.transformControls.setMode( "rotate" );
					ap.transformControls.attach(target);
					var boneIndex=target.boneIndex;
					ap.signals.boneSelectionChanged.dispatch(boneIndex);
				}
			}
		});
		

		var lastPosition=new THREE.Vector3();
		var solving=false;
		function solveIk(){
			if(ap.ikTarget==null){
				return;
			}
			if(ap.ikTarget.position.equals(lastPosition)){
				return;
			}
			if(solving){
				console.log("busy solving");
				return;
			}
			
			
			
			lastPosition.copy(ap.ikTarget.position);
			var lastMesh=scope.boneAttachControler.containerList[ap.ikIndices[ap.ikIndices.length-1]];
			var targetMesh=ap.ikTarget;
			
			var targetPos=targetMesh.position;
			
			var euler=new THREE.Euler();
			for(var j=0;j<ap.iteration;j++){
			
			
			
			
			for(var i=0;i<ap.ikIndices.length-1;i++){
				var lastJointPos=lastMesh.position;
				
				
				var bone=scope.boneAttachControler.boneList[ap.ikIndices[i]];
				var joint=scope.boneAttachControler.containerList[ap.ikIndices[i]];
				var jointPos=joint.position;
				
				//joint.lookAt(scope.boneAttachControler.containerList[ap.ikIndices[i+1]].position);
				var jointRotQ=joint.quaternion;
				
				if(targetPos.equals(lastJointPos)){
					if(IkUtils.logging){
						console.log("no need ik, skipped");
					}
					
					return;
				}
				
				//var jointRotQ=bone.getWorldQuaternion(new THREE.Quaternion());
				//var jointRotQ=bone.quaternion;
				
				//stepCalculate,limitation broken?
				//var newQ=IkUtils.stepCalculate(lastJointPos,jointPos,jointRotQ,targetPos,ap.maxAngle,false);
				var newQ=IkUtils.calculateAngles(lastJointPos,jointPos,jointRotQ,targetPos,ap.maxAngle,false);
				
				//dont add parent
				
				// * not working yet,no idea
				var inverseQ=bone.parent.clone().getWorldQuaternion(new THREE.Quaternion()).inverse();
				var newQ=IkUtils.stepCalculate2(inverseQ,lastJointPos,jointPos,targetPos,ap.maxAngle);
				
				
				if(newQ==null){
					//console.log("null q");
					newQ=new THREE.Quaternion();
					continue;
				}
				
				
				var euler=new THREE.Euler().setFromQuaternion(newQ);
				//newQ.multiply(jointRotQ);
				
				var r=bone.rotation;
				bone.rotation.set(r.x+euler.x,r.y+euler.y,r.z+euler.z);
				//bone.quaternion.multiply(newQ);//not  good at complex bone angles
				
				
				/*euler.setFromQuaternion(newQ);
				
				
				var rad=THREE.Math.degToRad(ap.maxAngle);
				if(euler.x>rad+0.0001 ||euler.y>rad+0.0001 ||euler.z>rad+0.0001 ){
					AppUtils.printDeg(euler,"over limit euler");
					//console.log(max/rad);
					continue;
				}
				
				euler.set(bone.rotation.x+euler.x,bone.rotation.y+euler.y,bone.rotation.z+euler.z);
				//check correct
				var limit=THREE.Math.degToRad(ap.maxAngle)*2;
				if(Math.abs(euler.x-bone.rotation.x)<=limit &&
				   Math.abs(euler.y-bone.rotation.y)<=limit &&
				   Math.abs(euler.z-bone.rotation.z)<=limit
						){
					//console.log("ok");
					//bone.rotation.copy(euler);	
				}else{
					//bone.rotation.copy(euler);	
					var x=Math.abs(euler.x-bone.rotation.x);
					var y=Math.abs(euler.y-bone.rotation.y);
					var z=Math.abs(euler.z-bone.rotation.z);
					
					//AppUtils.printDeg(new THREE.Vector3(x,y,z),String(limit));
				}*/
				
				
				//bone.quaternion.multiply(newQ);
				scope.boneAttachControler.update();
			}
			}
		}
		
		
		ap.signals.transformChanged.add(function(){
			solveIk();
		});
	});
	
	

	
	
	var boneMatrix=new THREE.Matrix4();
	var matrixWorldInv=new THREE.Matrix4();
	ap.signals.rendered.add(function(){
		
		if(scope.boneAttachControler){
			scope.boneAttachControler.update();
			
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
	 });
	

}
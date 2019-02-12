Example=function(application){
	var ap=application;
	var scale=100;
	
	ap.camera.position.set( 0, 1*scale, 2.5*scale );
	ap.controls.target.set(0,1*scale,0);
	ap.controls.update();
	
	var url="../../../dataset/mbl3d/models/anime2_nomorph.glb";
	//var url="../../../dataset/mbl3d/models/anime2_female.fbx";
	
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
		mesh.material=material;
		mesh.renderOrder = 0;
		container.add(mesh);
		ap.skinnedMesh=mesh;
		
		
		
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
		this.boneAttachControler=new BoneAttachControler(mesh,{color: 0x008800,boxSize:boxSize});
		this.boneAttachControler.setVisible(false);
		
		this.container.add(this.boneAttachControler.object3d);

		
		
		
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
			var index=indices.length-1;
			ikBox.position.copy(this.boneAttachControler.containerList[indices[indices.length-1]].position);
			ikBox.ikName=ikName;
			ap.objects.push(ikBox);
			ap.scene.add(ikBox);
		}
		
		
		//initialize ik
		ap.iks={};
		ap.ikTarget=null;
		ap.ikIndices=null;
		
		
		registIk("head",["spine01","spine02","spine03","neck","head"]);
		registIk("leftArm",["upperarm_L","lowerarm_L","hand_L"]);
		registIk("rightArm",["upperarm_R","lowerarm_R","hand_R"]);
		registIk("leftLeg",["thigh_L","calf_L","foot_L"]);
		registIk("rightLeg",["thigh_R","calf_R","foot_R"]);
		
		
		
		
		
		
		ap.signals.transformSelectionChanged.add(function(target){
			
			ap.ikTarget=target;
			
			
			if(target==null){
				ap.ikIndices=null;
				ap.transformControls.detach();
			}else{
				ap.ikIndices=ap.iks[target.ikName];
				ap.transformControls.attach(target);
			}
		});
		

		var solving=false;
		function solveIk(){
			if(ap.ikTarget==null){
				return;
			}
			
			if(solving){
				console.log("busy solving");
				return;
			}
			
			
			
			var lastMesh=this.boneAttachControler.containerList[ap.ikIndices[ap.ikIndices.length-1]];
			var targetMesh=ap.ikTarget;
			
			var targetPos=targetMesh.position;
			
			//same no need ik
			if(ap.ikTarget.position.equals(lastMesh.position)){
				return;
			}
			
			var euler=new THREE.Euler();
			for(var j=0;j<ap.iteration;j++){
			
			
			
			
			for(var i=0;i<ap.ikIndices.length-1;i++){
				var lastJointPos=lastMesh.position;
				
				
				var bone=this.boneAttachControler.boneList[ap.ikIndices[i]];
				var joint=this.boneAttachControler.containerList[ap.ikIndices[i]];
				var jointPos=joint.position;
				
				
				var jointRotQ=joint.quaternion;
				
				if(targetPos.equals(lastJointPos)){
					if(IkUtils.logging){
						console.log("no need ik, skipped");
					}
					
					return;
				}
				
				var newQ=IkUtils.calculateAngles(lastJointPos,jointPos,jointRotQ,targetPos,ap.maxAngle,false);
				
				var inverseQ=bone.parent.clone().getWorldQuaternion(new THREE.Quaternion()).inverse();
				var newQ=IkUtils.stepCalculate2(inverseQ,lastJointPos,jointPos,targetPos,ap.maxAngle);
				
				
				if(newQ==null){
					newQ=new THREE.Quaternion();
					continue;
				}
				
				
				var euler=new THREE.Euler().setFromQuaternion(newQ);
				
				var r=bone.rotation;
				bone.rotation.set(r.x+euler.x,r.y+euler.y,r.z+euler.z);
				
				this.boneAttachControler.update();
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
		
		if(this.boneAttachControler){
			boneAttachControler.update();
			
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
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
	
	ap.ikLimitMin={};
	ap.ikLimitMax={};
	
	function limitBone(boneList,endName,minX,minY,minZ,maxX,maxY,maxZ){
		var name=BoneUtils.findBoneByEndsName(boneList,endName).name;
		ap.ikLimitMin[name]={};
		ap.ikLimitMax[name]={};
		ap.ikLimitMin[name].x=minX;
		ap.ikLimitMin[name].y=minY;
		ap.ikLimitMin[name].z=minZ;
		ap.ikLimitMax[name].x=maxX;
		ap.ikLimitMax[name].y=maxY;
		ap.ikLimitMax[name].z=maxZ;
	}

	function initlimitBone(){
		
		var boneList=BoneUtils.getBoneList(ap.skinnedMesh);
		/*boneList.forEach(function(bone){
			limitBone(boneList,bone.name,-180,-180,-180,180,180,180);
		});*/
		
		limitBone(boneList,"calf_R",0,0,0,165,0,0);
		limitBone(boneList,"thigh_R",-120,0,-70,120,0,70);
		
		limitBone(boneList,"hand_R",-15,-15,-15,15,15,15);
		limitBone(boneList,"lowerarm_R",0,0,0,0,150,0);
		limitBone(boneList,"upperarm_R",-45,-75,-30,45,75,85);
		limitBone(boneList,"clavicle_R",-25,-15,-25,25,0,0);
		
		
		limitBone(boneList,"calf_L",0,0,0,165,0,0);
		limitBone(boneList,"thigh_L",-120,0,-70,120,0,70);
		
		limitBone(boneList,"hand_L",-15,-15,-15,15,15,15);
		limitBone(boneList,"lowerarm_L",0,-150,0,0,0,0);
		limitBone(boneList,"upperarm_L",-45,-75,-85,45,75,30);
		limitBone(boneList,"clavicle_L",-25,0,0,25,15,25);
		
		limitBone(boneList,"spine01",-15,-45,-45,15,45,45);
		limitBone(boneList,"spine02",-45,-45,-45,45,45,45);
		limitBone(boneList,"spine03",-45,-45,-45,45,45,45);
		limitBone(boneList,"neck",-45,-45,-45,45,45,45);
		limitBone(boneList,"root",-45,-45,-45,45,45,45);
		
		//copy to default
		Object.keys(ap.ikLimitMin).forEach(function(key){
			ap.ikDefaultLimitMin[key]={};
			ap.ikDefaultLimitMin[key].x=ap.ikLimitMin[key].x;
			ap.ikDefaultLimitMin[key].y=ap.ikLimitMin[key].y;
			ap.ikDefaultLimitMin[key].z=ap.ikLimitMin[key].z;
			ap.ikDefaultLimitMax[key]={};
			ap.ikDefaultLimitMax[key].x=ap.ikLimitMax[key].x;
			ap.ikDefaultLimitMax[key].y=ap.ikLimitMax[key].y;
			ap.ikDefaultLimitMax[key].z=ap.ikLimitMax[key].z;
		});
		
		//send ref
		ap.signals.boneLimitLoaded.dispatch(ap.ikLimitMin,ap.ikLimitMax);
	}
	
	
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
		ap.boneAttachControler=scope.boneAttachControler;
		scope.boneAttachControler.setVisible(false);
		
		ap.ikControler=new IkControler(scope.boneAttachControler,ap);

		
		this.container.add(scope.boneAttachControler.object3d);//no need
		
		function resetIkPosition(name){
			var target=ikTargets[name];
			var indices=ap.ikControler.iks[name];
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
			ap.ikControler.iks[ikName]=indices;
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
			ikBox.position.copy(scope.boneAttachControler.containerList[indices[indices.length-1]].position);
			ikBox.ikName=ikName;
			ap.objects.push(ikBox);
			ikTargets[ikName]=ikBox;
			ap.scene.add(ikBox);
		}
		
		
		//initialize ik

		
		registIk("Hip",["root","spine01"]);
		registIk("Head",["spine01","spine02","spine03","neck","head"]);
		registIk("LeftArm",["clavicle_L","upperarm_L","lowerarm_L","hand_L","middle00_L"]);
		registIk("RightArm",["clavicle_R","upperarm_R","lowerarm_R","hand_R","middle00_R"]);
		registIk("LeftLeg",["thigh_L","calf_L","foot_L"]);
		registIk("RightLeg",["thigh_R","calf_R","foot_R"]);
		
		initlimitBone();
		
		
		
		
		ap.signals.transformSelectionChanged.add(function(target){
			ap.ikControler.ikTarget=target;
			
			
			if(target==null){
				ap.ikControler.ikIndices=null;
				ap.transformControls.detach();
			}else{
				ap.ikControler.ikIndices=ap.ikControler.iks[target.ikName];
				ap.transformControls.attach(target);
			}
		},undefined,1);//need high priority to call first
		

		
		
		
		ap.signals.solveIkCalled.add(function(){
			ap.ikControler.solveIk(true);
		});
		
		var lastTargetMovedPosition=new THREE.Vector3();
		
		
		
		ap.signals.transformChanged.add(function(){	
			ap.ikControler.solveIk();
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
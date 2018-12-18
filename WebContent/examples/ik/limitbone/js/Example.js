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
		
		ap.ikControler.boneAttachControler=scope.boneAttachControler;
		
		this.container.add(scope.boneAttachControler.object3d);
		

		ap.signals.boneSelectionChanged.add(function(index){
			ap.ikControler.boneSelectedIndex=index;
		});
		
		
		
		
		

		
		ap.signals.poseChanged.add(function(){
			console.log("poseChanged");
			ap.ikControler.resetAllIkTargets();
		});
		
		
		

		
		
		//initialize ik

		
		
		
		var mbl3dik=new Mbl3dIk(ap);
		ap.ikControler.ikTargets=mbl3dik.ikTargets;
		
		
		
		
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
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
		try{
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
		this.container.add(scope.boneAttachControler.object3d);
		
		ap.ikControler.boneAttachControler=scope.boneAttachControler;
		ap.signals.boneSelectionChanged.add(function(index){
			ap.ikControler.boneSelectedIndex=index;
		});
		
		
		
		
		

		
		ap.signals.poseChanged.add(function(){
			ap.ikControler.resetAllIkTargets();
		});
		
		
		

		
		
		//initialize ik

		
		
		
		var mbl3dik=new Mbl3dIk(ap);
		ap.ikControler.ikTargets=mbl3dik.ikTargets;
		
		ap.ikControler.setEndSiteEnabled("LeftArm",true);
		ap.ikControler.setEndSiteEnabled("RightArm",true);
		
		scope.target=null;
		ap.signals.transformSelectionChanged.add(function(target){
			scope.target=target;
			if(target==null){
				ap.transformControls.detach();
			}
			
			ap.ikControler.onTransformSelectionChanged(target);
		},undefined,1);//need high priority to call first
		
		
		var renderer=function(){
			ap.renderer.render( ap.scene, ap.camera );	
		}
		ap.signals.rendered.add(renderer,undefined,1);
		
		
		function onTransformStarted(target){
			if(target!=null && target.userData.transformSelectionType=="BoneIk"){
				ap.signals.recoverTurnArm.dispatch(ap.ikControler.getSelectedIkName());
				ap.signals.rendered.remove(renderer);
			}
		}
		
		function onTransformFinished(target){
			if(target!=null && target.userData.transformSelectionType=="BoneIk"){
				//ap.signals.storeTurnArm.dispatch(ap.ikControler.getSelectedIkName());
				//ap.signals.applyTurnArm.dispatch(ap.ikControler.getSelectedIkName());//store & update
				
				ap.signals.rendered.add(renderer,undefined,1);
			}
		}
		
		
	
		
		ap.transformControls.addEventListener( 'mouseUp', function () {
			ap.ikControler.onTransformFinished(scope.target);
			onTransformFinished(scope.target);
		});

		ap.transformControls.addEventListener( 'mouseDown', function () {
			onTransformStarted(scope.target);
			ap.signals.rendered.remove(renderer);
		});

		
		
		
		
		ap.signals.solveIkCalled.add(function(){
			ap.ikControler.solveIk(true);
		});
		
		
		
		ap.signals.transformChanged.add(function(){
			var target=scope.target;
			if(target!=null && target.userData.transformSelectionType=="BoneIk"){
				ap.signals.recoverTurnArm.dispatch(ap.ikControler.getSelectedIkName());
			}
			ap.ikControler.solveIk();
			if(target!=null && target.userData.transformSelectionType=="BoneIk"){
				ap.signals.storeTurnArm.dispatch(ap.ikControler.getSelectedIkName());
				ap.signals.applyTurnArm.dispatch(ap.ikControler.getSelectedIkName());//store & update
			}
			
			ap.renderer.render( ap.scene, ap.camera );
		});
		} catch(e) {
			  console.error(e);
			}
	});
	
	

	

	
	
	ap.signals.rendered.add(function(){
		
		if(scope.boneAttachControler){
			scope.boneAttachControler.update();
			
		}
		
	});
	

	

}